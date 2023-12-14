import requests
from bs4 import BeautifulSoup
import pandas as pd
from urllib.parse import urljoin
import time

import mysql.connector
from sqlalchemy import create_engine

host = 'database-1.chpdbqbkfh2m.us-east-2.rds.amazonaws.com'
username = 'admin'
password = 'dbfinalproj'
database = 'NBA_watcher'

engine = create_engine(f'mysql+mysqlconnector://{username}:{password}@{host}/{database}')

mydb = mysql.connector.connect(
  host=host,
  user=username,
  password=password,
  database=database
)
mycursor = mydb.cursor()

def parse_player_basic_info(index_letter, filter_year=2012):
    """
    input:
        index_letter: a-z
        filter_year: int,  only extract player active after given year
    output:
        dataframe
    """
 
    # URL of the page to scrape
    root_url = 'https://www.basketball-reference.com/players/'
    url = urljoin(root_url, index_letter) #'https://www.basketball-reference.com/players/a/'

    response = requests.get(url)
    # print(response)
    soup = BeautifulSoup(response.text, 'html.parser')
    table = soup.find('table', {'id': 'players'})
    rows = table.find_all('tr')
    data = []

    # Extract data from each row
    for row in rows:
        cols = row.find_all('td')
        if cols:
            year_max = cols[1].text.strip()  # 'Year Max' is the second column
            if int(year_max) >= filter_year:
                player_tag = row.find('th', {'data-stat': 'player'}).find('a')
                if player_tag:
                    player_name = player_tag.text
                    player_href = player_tag['href']
                    player_href = player_href.split('.html')[0]
                    player_unique_id = player_href.split('/')[-1]
                    # Add player name and href to the row's data
                    row_data = [player_name, player_href, player_unique_id]
                else:
                    # If player tag is not found, continue to the next iteration
                    continue
                
                cols = [ele.text.strip() for ele in cols]
                # Add the rest of the columns to the row's data
                row_data.extend(cols)
                data.append(row_data)

    # Define column names
    columns = ['Player_Name', 'Player_Href', 'Player_ID', 'Year_Min', 'Year_Max', 'Position', 'Height', 'Weight', 'Birth_Date', 'Colleges']

    # Create a DataFrame
    df = pd.DataFrame(data, columns=columns)

    return df

def parse_player_game_performance(player_href, year_min, year_max=2024, filter_year=2012):
    """
    input:
        player_href: can be obtained from player table, e.g.:/players/a/abrinal01
        year_min: int,  season start to play
        year_max: int, season stop to play, default is current season 2023-2024
        filter_year: int, only extracted season data after filter_year
    output:
        dataframe
    """
    year_min = int(year_min)
    if year_min < filter_year:
        year_min = filter_year

    columns = ['Game_ID', 'Season', 'Rk', 'G', 'Date', 'Age', 'Tm', 'Location', 'Opp', 'Result', 'GS', 'MP', 'FG', 'FGA', 'FG%', '3P', '3PA', '3P%', 'FT', 'FTA', 'FT%', 'ORB', 'DRB', 'TRB', 'AST', 'STL', 'BLK', 'TOV', 'PF', 'PTS', 'GmSc', '+/-']
    data = []
    root_url = 'https://www.basketball-reference.com' + player_href + '/' # https://www.basketball-reference.com/players/j/jamesle01/gamelog/2004
    url = urljoin(root_url,  "gamelog/")
    for year in range(year_min, year_max+1):

        url_year = urljoin(url, str(year))
        response = requests.get(url_year)
        soup = BeautifulSoup(response.text, 'html.parser')
        rows = soup.find_all('tr')
        for row in rows:
            if row.find('th', attrs={'data-stat': 'ranker'}) and 'csk' in row.find('th').attrs:
                # Extract data from all cells
                cells = row.find_all(['th', 'td'])
                row_data = [cell.get_text(strip=True) for cell in cells]
                game_id = row_data[2] #date
                if row_data[5] == '@':
                    game_id = game_id + row_data[4] + '@' + row_data[6]
                else:
                    game_id = game_id + row_data[6] + '@' + row_data[4]
                row_data.insert(0, game_id)
                row_data.insert(1, year)
                data.append(row_data)

    df = pd.DataFrame(data, columns=columns)
    df.drop(columns=['Rk', 'G'])
    # stats = ['FG', 'FGA', 'FG%', '3P', '3PA', '3P%', 'FT', 'FTA', 'FT%', 'ORB', 'DRB', 'TRB', 'AST', 'STL', 'BLK', 'TOV', 'PF', 'PTS', 'GmSc']
    # df[stats] = df[stats].astype(float)
    # stats_average_values = df.groupby(['Season', 'Tm'])[stats].mean()

    return df

def parse_player_game_performance_per_season(player_href, sql_table_name):
    root_url = 'https://www.basketball-reference.com' + player_href + '.html'
    response = requests.get(root_url)
    # Assuming `html_content` is the HTML string that contains the table
    soup = BeautifulSoup(response.text, 'html.parser')

    # Find the table in the HTML
    table = soup.find('table', {'id': 'per_game'})

    # Parse the table headers
    headers = [header.text for header in table.find_all('th') if header.get('data-tip')]

    # Parse the rows
    rows = []
    for row in table.find_all('tr'):
        # print(row.get('class'))
        if row.get('class') and "full_table" in row.get('class'): 
            cells = row.find_all(['th', 'td'])
            rows.append([cell.text for cell in cells])

    # Create a pandas DataFrame
    df = pd.DataFrame(rows, columns=headers)
    df.insert(0, 'Player Href', player_href)
    df.to_sql(sql_table_name, con=engine, if_exists='append', index=False, chunksize=1000)


def parse_player_avatar():

    mycursor.execute("SELECT Player_Href FROM Player")
    all_player_href = mycursor.fetchall()
    for index, player_href in enumerate(all_player_href):
        print('working on ', player_href[0])
        print('current index', index)
        time.sleep(3)
        # print(player_href)
        root_url = 'https://www.basketball-reference.com' + player_href[0] + '.html'
        response = requests.get(root_url)
        # Assuming `html_content` is the HTML string that contains the table
        soup = BeautifulSoup(response.text, 'html.parser')
        image_element = soup.find('img', {'itemscope': 'image'})

        # Check if the image element exists
        if image_element:
            # Get the src attribute value
            image_url = image_element['src']
            print(image_url)
            update_query = "UPDATE Player SET avatar_url = %s WHERE Player_Href = %s"
            values = (image_url, player_href[0])
            mycursor.execute(update_query, values)
            mydb.commit()


def parse_all_player(sql_table_name):
    # parse all players' basic information and drop into mysql
    for index in range(0, 26):
        letter = chr(ord('a') + index)
        print('working on ', letter)
        time.sleep(5)
        df_cur_letter = parse_player_basic_info(letter)
        df_cur_letter.to_sql(sql_table_name, con=engine, if_exists='append', index=False, chunksize=1000)
    
def parse_all_player_season_performance(sql_table_name):

    mycursor.execute("SELECT Player_Href FROM Player")
    all_player_href = mycursor.fetchall()
    for index, player_href in enumerate(all_player_href[372+1165:]):
        print('working on ', player_href[0])
        print('current index', index)
        time.sleep(3)
        # print(player_href)
        parse_player_game_performance_per_season(player_href[0], sql_table_name)

def parse_all_player_game_performance(sql_table_name):

    mycursor.execute("SELECT Player_Href, Year_min FROM Player")
    all_player_href = mycursor.fetchall()
    for index, player_href in enumerate(all_player_href[57+20:]):
        print('working on ', player_href[0])
        # print(player_href[1])
        print('current index', index)
        time.sleep(3)
        # print(player_href)
        df = parse_player_game_performance(player_href[0], player_href[1])
        df.to_sql(sql_table_name, con=engine, if_exists='append', index=False, chunksize=1000)

# response = requests.get( "https://www.basketball-reference.com/players/j/jamesle01/gamelog/2004")
# df = parse_player_game_performance("/players/j/jamesle01", 2022, 2024)
# df.to_csv('test.csv')

# df = parse_player_basic_info('a')
# df.to_csv('players_data.csv')
# parse_all_player('Player')
# parse_player_game_performance_per_season("/players/j/jamesle01")
# parse_all_player_season_performance('Player_Season_Performance')


# mycursor.execute("SELECT Player_Href FROM Player")
# all_player_href = mycursor.fetchall()
# print(all_player_href[372])

# parse_player_avatar()

parse_all_player_game_performance('Game_Performance')