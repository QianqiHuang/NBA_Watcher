
NBA Watcher
=====================
Our project focuses on building a database of NBA statistics and information. This database focus on player stats, team records. The aim of this project is to analyze the individual performance of player. 

Getting Started
---------------

This project uses Python Flask for backend framework, React for frontend, and mySQL for database.

### set up backend

Install these libraries using `pip`:


```sh
cd nba-stats-server
pip install Flask Flask-CORS Flask-SQLAlchemy SQLAlchemy mysql-connector-python
```

### set up frontend

Install these React dependencies


```sh
  cd nba-stats-frontend
  npm install
```



Start Application
--------
After setting up the envrionment, the project can be started locally.

Frontend:
```sh
  cd nba-stats-frontend
  npm start
```
The frontend will run in http://localhost:3000. 

Backend 
```sh
  cd nba-stats-server
  python app.py    
```

