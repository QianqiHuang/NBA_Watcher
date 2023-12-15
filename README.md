<a name="readme-top"></a>

<!-- PROJECT LOGO -->
# NBA Stats Watcher
<br />
<div align="center">
  <a href="https://github.com/QianqiHuang/NBA_Watcher">
    <img src="nba-stats-frontend\public\icon.ico" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">NBA-Watcher-README</h3>

  <p align="center">
    An awesome tool to visualize NBA stats!
    <br />
    <a href="https://github.com/QianqiHuang/NBA_Watcher"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://github.com/QianqiHuang/NBA_Watcher/issues">Report Bug</a>
    ·
    <a href="https://github.com/QianqiHuang/NBA_Watcher/issues">Request Feature</a>
  </p>
</div>

[landing](https://imgur.com/a/I0K5nUc.png)

## About The Project
[Our Project is live!!](http://nbawatcher.s3-website.us-east-2.amazonaws.com/)\
Welcome to the NBA Watcher Visualization Website, the ultimate platform for basketball enthusiasts to explore in-depth statistics and trends from the National Basketball Association (NBA). Our project is dedicated to constructing a comprehensive database filled with NBA statistics and insights, centering on individual player stats and team records. The goal is to analyze and track the performance of players in depth. Therefore, our site offers interactive data presentations, player performance tracking, and historical data comparison to bring fans closer to the game they love.

## Features
- **Player Search**: Quickly find player profiles with current season stats.
- **Interactive Filters**: Refine player lists based on specific stat ranges.
- **Seasonal Data**: Compare player statistics across different seasons.
- **Top Performers**: View top 5 players for points, rebounds, assists, and more.
- **Most Improved Players**: Highlight players with the most significant improvements.
- **Data Trends**: Visualize a player's career progress with interactive charts.

## Built With

Here are major frameworks/libraries we used to build our project.
* [Python](https://www.python.org/)
* [Flask](https://flask.palletsprojects.com/en/3.0.x/)
* [Mysql](https://www.mysql.com/)
* [Node.js](https://nodejs.org/en/)
* [React](https://reactjs.org/)
* [MaterialUI](https://mui.com)
* [Axios](https://axios-http.com/docs/intro)
* [Amazon Web Service](https://aws.amazon.com/)


## Getting Started

This project uses **Python Flask** for backend framework, **React** for frontend, and **mySQL** for database.
___
### Populating the Database
 1. Locate `NBA_db.sql` in the main folder.
 2. Use MySQL Workbench or a similar tool to import and populate the database.
 3. fter populating the database, configure the database connection parameters in `nba-stats-server/app.py`:
    - **host**: Your local host address (usually 'localhost')
    - **username**: Your MySQL username
    - **password**: Your MySQL password
    - **database**: The name of your populated database
___
### Deploying the Backend


1. Navigate to the `nba-stats-server` directory and Install the required Python dependencies:

  ```sh
  cd nba-stats-server
  pip install -r requirement.txt
  ```

2. Start the backend server:
```sh
python app.py
```
___
### Setting Up the Frontend

1. In the `nba-stats-frontend/src/const.js` file, update the `base_url` to your backend address (if running locally, this will be `http://127.0.0.1:5000` in most cases).
2. Move to the `nba-stats-frontend` directory and install the necessary Node.js dependencies:

```sh
  cd nba-stats-frontend
  npm install
```
3. Start the frontend application:
```sh
npm start
```
4. Access the frontend in a web browser at `http://localhost:3000`.

## Contributing

Contributions are what make the development community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork this repo and create a pull request. 

Don't forget to give the project a star! :star: Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b`)
3. Commit your Changes (`git commit -m 'RandomMessage'`)
4. Push to the Branch (`git push origin`)
5. Open a Pull Request

## Contact (listed in alphabetical order)
- Qianqi Huang - [@QianqiHuang](https://github.com/QianqiHuang) - qhuang35@jhu.edu
- Yujian (Ken) He - [@Kennnnn774](https://github.com/Kennnnn774) - yhe99@jhu.edu

