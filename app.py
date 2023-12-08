from flask import Flask, jsonify
from models import PlayerStat  # This would be your SQLAlchemy model
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)

@app.route('/api/stats/<string:season>')
def get_season_stats(season):
    stats = {
        'score': get_top_players_by_stat(season, 'points'),
        'rebound': get_top_players_by_stat(season, 'rebounds'),
        'assist': get_top_players_by_stat(season, 'assists'),
    }
    return jsonify(stats)

def get_top_players_by_stat(season, stat):
    return PlayerStat.query.filter_by(season=season)\
        .order_by(getattr(PlayerStat, stat).desc())\
        .limit(5)\
        .all()
