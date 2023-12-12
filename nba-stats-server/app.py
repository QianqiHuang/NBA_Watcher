from flask import Flask, jsonify
from models import db, PlayerStat, PlayerInfo, TeamInfo  # This would be your SQLAlchemy model
from flask_cors import CORS


host = 'localhost'
username = 'root'
password = 'woaitetsu0511'
database = 'db_final_proj'


app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+mysqlconnector://{username}:{password}@{host}/{database}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

@app.route('/stats/<string:season>/<string:stats>')
def get_season_stats(season, stats):
    stats_list = stats.split(',')
    stats_data = {}
    
    for stat in stats_list:
        top_players = get_top_players_by_stat(season, stat)
        stats_data[stat] = [player.to_dict_item(stat) for player in top_players]
    return jsonify(stats_data)

@app.route('/stats/player/<string:player_id>')
def get_player_performance(player_id):
    player_href = '/players/' + player_id[0] +'/' + player_id
    player = PlayerStat.query.filter_by(player_href=player_href).all()
    if player:
        return jsonify([player_item.to_dict() for player_item in player])
    else:
        return jsonify({"message": "Player not found"}), 404

@app.route('/player/<string:player_id>')
def get_player_info(player_id):
    player = PlayerInfo.query.filter_by(player_ID=player_id).first()
    if player:
        return jsonify(player.to_dict())
    else:
        return jsonify({"message": "Player not found"}), 404
    
@app.route('/search/<string:player_name>')
def search_player(player_name):
    players = PlayerInfo.query.filter(PlayerInfo.player_name.like(f'%{player_name}%')).all()
    return jsonify([player.to_dict() for player in players])

@app.route('/player/team/<string:player_id>')
def search_player_teams(player_id):
    player_href = '/players/' + player_id[0] +'/' + player_id
    player = db.session.query(PlayerStat, TeamInfo).\
                join(TeamInfo, PlayerStat.tm == TeamInfo.abbreviation).\
                filter(PlayerStat.player_href == player_href).\
                all()

    if player:
        # Convert the result to a dictionary or a desired format
        result = []
        for player_stat, team in player:
            player_dict = player_stat.to_dict_item('season')
            player_dict['team_name'] = team.team_name  # Adding team name to the result
            result.append(player_dict)
        return jsonify(result)
    else:
        return jsonify({"message": "Player not found"}), 404


@app.route('/season/<string:season>')
def get_season(season):
    player = PlayerStat.query.filter_by(season=season).first()
    if player:
        return jsonify(player.to_dict())
    else:
        return jsonify({"message": "Season not found"}), 404

    
def get_top_players_by_stat(season, stat):
    return PlayerStat.query.filter_by(season=season)\
        .order_by(getattr(PlayerStat, stat).desc())\
        .limit(10)\
        .all()

if __name__ == '__main__':
    app.run(debug=True)