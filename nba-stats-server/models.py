from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()



class PlayerStat(db.Model):
    __tablename__ = 'Player_Season_Performance'

    player_href = db.Column('Player Href', db.String(255), primary_key=True)
    season = db.Column('Season', db.String(10), primary_key=True)
    age = db.Column(db.Integer)
    tm = db.Column(db.String(10))
    lg = db.Column(db.String(10))
    pos = db.Column(db.String(10))
    g = db.Column(db.Integer)
    gs = db.Column(db.Integer)
    mp = db.Column(db.Float)
    fg = db.Column(db.Float)
    fga = db.Column(db.Float)
    fg_percent = db.Column('FG%', db.Float)
    three_p = db.Column('3P', db.Float)
    three_pa = db.Column('3PA', db.Float)
    three_p_percent = db.Column('3P%', db.Float, nullable=False)
    two_p = db.Column('2P', db.Float)
    two_pa = db.Column('2PA', db.Float)
    two_p_percent = db.Column('2P%', db.Float)
    efg_percent = db.Column('eFG%', db.Float)
    ft = db.Column(db.Float)
    fta = db.Column(db.Float)
    ft_percent = db.Column('FT%', db.Float)
    drb = db.Column(db.Float)  # Defensive Rebounds
    trb = db.Column(db.Float)  # Total Rebounds
    ast = db.Column(db.Float)  # Assists
    stl = db.Column(db.Float)  # Steals
    blk = db.Column(db.Float)  # Blocks
    tov = db.Column(db.Float)  # Turnovers
    pf = db.Column(db.Float)   # Personal Fouls
    pts = db.Column(db.Float)  # Points



    def to_dict(self):
        player_id = self.player_href.split('/')[-1]
        return {
            'player id': player_id,
            'player href': self.player_href,
            'season': self.season,
            'age': self.age,
            'tm': self.tm,
            'lg': self.lg,
            'pos': self.pos,
            'g': self.g,
            'gs': self.gs,
            'mp': self.mp,
            'fg': self.fg,
            'fga': self.fga,
            'fg_percent': self.fg_percent,
            'three_p': self.three_p,
            'three_pa': self.three_pa,
            'three_p_percen': self.three_p_percent,
            'two_p': self.two_p,
            'two_pa': self.two_pa,
            'two_p_percent': self.two_p_percent,
            'efg_percent': self.efg_percent,
            'ft': self.ft,
            'fta': self.fta,
            'ft_percent': self.ft_percent,
            'drb': self.drb,
            'trb': self.trb,
            'ast': self.ast,
            'stl': self.stl,
            'blk': self.blk,
            'tov': self.tov,
            'pf': self.pf,
            'pts': self.pts
        }


    def to_dict_item(self, item):
        player_stats = self.to_dict()
        selected_items = {
            'player id': player_stats['player id'],
            'player href': player_stats['player href'],
            'tm': player_stats['tm'],
            'age': player_stats['age'],
            'value': player_stats[item]
        }
        return selected_items
    

class PlayerInfo(db.Model):
    __tablename__ = 'Player'

    player_href = db.Column('Player_Href', db.String(255), primary_key=True)
    player_ID = db.Column('Player_ID', db.String(255), primary_key=True)
    player_name = db.Column('Player_Name', db.String(255))
    year_min = db.Column(db.String(100))
    year_max = db.Column(db.String(100))
    position = db.Column(db.String(100))
    height = db.Column(db.String(100))
    weight = db.Column(db.String(100))
    birth_date = db.Column(db.String(100))
    colleges = db.Column(db.String(100))
    avatar_url = db.Column(db.String(255))



    def to_dict(self):
        return {
            'player_ID': self.player_ID,
            'player_href': self.player_href,
            'player_name': self.player_name,
            'year_min': self.year_min,
            'year_max':self.year_max,
            'position': self.position,
            'height': self.height,
            'weight': self.weight,
            'birth_date': self.birth_date,
            'colleges': self.colleges,
            'avatar_url': self.avatar_url
        }


class TeamInfo(db.Model):
    __tablename__ = 'nba_teams'


    id = db.Column(db.Integer, primary_key=True)
    team_name = db.Column(db.String(50))
    abbreviation = db.Column(db.String(5))


    def to_dict(self):
        return {
            'team_ID': self.id,
            'team_name': self.team_name,
            'team_abbreviation': self.abbreviation,
        }
