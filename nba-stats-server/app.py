from flask import Flask, jsonify, request
from models import db, PlayerStat, PlayerInfo, TeamInfo  # This would be your SQLAlchemy model
from flask_cors import CORS
from sqlalchemy import desc



host = 'database-1.chpdbqbkfh2m.us-east-2.rds.amazonaws.com'
username = 'admin'
password = 'dbfinalproj'
database = 'NBA_watcher'


app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = f'mysql+mysqlconnector://{username}:{password}@{host}/{database}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

@app.route('/')
def hello_world():
	return 'Hello World!'

# Fetches top players by specific stats for a given season.
# SQL Equivalent: 
# SELECT * FROM PlayerStat WHERE season = {season} ORDER BY {stat} DESC LIMIT 10
@app.route('/stats/<string:season>/<string:stats>')
def get_season_stats(season, stats):
    stats_list = stats.split(',')
    stats_data = {}
    
    for stat in stats_list:
        top_players = get_top_players_by_stat(season, stat)
        stats_data[stat] = [player.to_dict_item(stat) for player in top_players]
    return jsonify(stats_data)

# Retrieves players whose stats fall within specified ranges for a given season.
# SQL Equivalent: 
# SELECT * FROM PlayerStat JOIN PlayerInfo ON PlayerStat.player_href = PlayerInfo.player_href 
# WHERE season = {season} AND pts BETWEEN {min_pts} AND {max_pts} AND BETWEEN {min_ast} AND {max_ast}
# BETWEEN {min_trb} AND {max_trb}
@app.route('/stats/<string:season>/range/')
def get_players_by_stat_range(season):
    min_pts = request.args.get('min_pts', type=float)
    max_pts = request.args.get('max_pts', type=float)
    min_ast = request.args.get('min_ast', type=float)
    max_ast = request.args.get('max_ast', type=float)
    min_trb = request.args.get('min_trb', type=float)
    max_trb = request.args.get('max_trb', type=float)

        # Start the query with a join
    query = db.session.query(PlayerStat, PlayerInfo).join(
        PlayerInfo, PlayerStat.player_href == PlayerInfo.player_href
    )  

    # Filter by season if provided
    if season:
        query = query.filter(PlayerStat.season == season)
        

    # Apply filters based on the provided stat ranges
    if min_pts is not None:
        query = query.filter(PlayerStat.pts >= min_pts)
    if max_pts is not None:
        query = query.filter(PlayerStat.pts <= max_pts)

    if min_ast is not None:
        query = query.filter(PlayerStat.ast >= min_ast)
    if max_ast is not None:
        query = query.filter(PlayerStat.ast <= max_ast)

    if min_trb is not None:
        query = query.filter(PlayerStat.trb >= min_trb)
    if max_trb is not None:
        query = query.filter(PlayerStat.trb <= max_trb)

    players_within_range = query.all()

    # Serialize the results into a JSON-friendly format
    players_data = []
    for player_stat, player_info in players_within_range:
        player_data = player_stat.to_dict()
        player_data.update({
            'player_name': player_info.player_name,
            'avatar_url': player_info.avatar_url,
        })
        players_data.append(player_data)

    return jsonify(players_data)

# Fetches performance details of a player based on player_id.
# SQL Equivalent: 
# SELECT * FROM PlayerStat WHERE player_href = '/players/{player_id[0]}/{player_id}'
@app.route('/stats/player/<string:player_id>')
def get_player_performance(player_id):
    player_href = '/players/' + player_id[0] +'/' + player_id
    player = PlayerStat.query.filter_by(player_href=player_href).all()
    if player:
        return jsonify([player_item.to_dict() for player_item in player])
    else:
        return jsonify({"message": "Player not found"}), 404

# Retrieves information about a player by player_id.
# SQL Equivalent: 
# SELECT * FROM PlayerInfo WHERE player_ID = {player_id}
@app.route('/player/<string:player_id>')
def get_player_info(player_id):
    player = PlayerInfo.query.filter_by(player_ID=player_id).first()
    if player:
        return jsonify(player.to_dict())
    else:
        return jsonify({"message": "Player not found"}), 404

# Searches for players by name.
# SQL Equivalent: 
# SELECT * FROM PlayerInfo WHERE player_name LIKE '%{player_name}%'
@app.route('/search/<string:player_name>')
def search_player(player_name):
    players = PlayerInfo.query.filter(PlayerInfo.player_name.like(f'%{player_name}%')).all()
    return jsonify([player.to_dict() for player in players])


# Provides team history for a given player.
# SQL Equivalent: 
# SELECT PlayerStat.*, TeamInfo.* FROM PlayerStat JOIN TeamInfo 
# ON PlayerStat.tm = TeamInfo.abbreviation WHERE PlayerStat.player_href = '/players/{player_id[0]}/{player_id}'
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

# Retrieves data for a specific season.
# SQL Equivalent: 
# SELECT * FROM PlayerStat WHERE season = {season}
@app.route('/season/<string:season>')
def get_season(season):
    player = PlayerStat.query.filter_by(season=season).first()
    if player:
        return jsonify(player.to_dict())
    else:
        return jsonify({"message": "Season not found"}), 404
    
# Identifies the most improved player over two seasons based on a specific stat.
# SQL Equivalent: 
# SELECT PlayerInfo.*, ((stat_23_24 - stat_22_23) / stat_22_23) AS improvement_percentage 
# FROM PlayerInfo JOIN (SELECT player_href, {stat} AS stat_23_24 FROM PlayerStat WHERE season = {next_season} AND mp >= 10) 
# ON PlayerInfo.player_href = stat_23_24.player_href 
# JOIN (SELECT player_href, {stat} AS stat_22_23 FROM PlayerStat WHERE season = {last_season} AND mp >= 10) 
# ON PlayerInfo.player_href = stat_22_23.player_href 
# WHERE stat_22_23 != 0 ORDER BY improvement_percentage DESC LIMIT 1
@app.route('/<string:seasons>/most_improved_player')
def get_most_improved_player(seasons):
    last_season = seasons.split(',')[0]
    next_season = seasons.split(',')[1]
    # Get the stat parameter from the query string
    stat = request.args.get('stat', 'pts')  # Default to 'pts' if not provided

    # Validate the stat parameter
    allowed_stats = ['pts', 'ast', 'trb', 'stl', 'blk']  # List other stats as needed
    if stat not in allowed_stats:
        return 'Invalid statistic', 400

    # Subquery for '22-23' season
    stat_22_23 = db.session.query(
        PlayerStat.player_href,
        getattr(PlayerStat, stat).label(f'stat_22_23')
    ).filter(
        PlayerStat.season == last_season
    ).filter(
        PlayerStat.mp >= 10
    ).subquery()

    # Subquery for '23-24' season
    stat_23_24 = db.session.query(
        PlayerStat.player_href,
        getattr(PlayerStat, stat).label(f'stat_23_24')
    ).filter(
        PlayerStat.season == next_season
    ).filter(
        PlayerStat.mp >= 10
    ).subquery()

    # Main query to calculate improvement
    query = db.session.query(
        PlayerInfo.player_href,
        PlayerInfo.player_name,
        PlayerInfo.avatar_url,
        stat_23_24.c.stat_23_24,
        stat_22_23.c.stat_22_23,
        ((stat_23_24.c.stat_23_24 - stat_22_23.c.stat_22_23) / stat_22_23.c.stat_22_23).label('improvement_percentage')
    ).join(
        stat_22_23, PlayerInfo.player_href == stat_22_23.c.player_href
    ).join(
        stat_23_24, PlayerInfo.player_href == stat_23_24.c.player_href
    ).filter(
        stat_22_23.c.stat_22_23 != 0
    ).order_by(
        desc('improvement_percentage')
    ).limit(1)

    most_improved_players = query.all()

    players_data = [{
        'avatar_url':player.avatar_url,
        'player_href': player.player_href,
        'player_name': player.player_name,
        'stat_23_24': getattr(player, 'stat_23_24'),
        'stat_22_23': getattr(player, 'stat_22_23'),
        'improvement_percentage': getattr(player, 'improvement_percentage')
    } for player in most_improved_players]

    return jsonify(players_data[0])

def get_top_players_by_stat(season, stat):
    return PlayerStat.query.filter_by(season=season)\
        .order_by(getattr(PlayerStat, stat).desc())\
        .limit(10)\
        .all()

if __name__ == '__main__':
    app.run(debug=True)