from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class PlayerStat(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50))
    points = db.Column(db.Integer)
    rebounds = db.Column(db.Integer)
    assists = db.Column(db.Integer)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'points': self.points,
            'rebounds': self.rebounds,
            'assists': self.assists
        }
