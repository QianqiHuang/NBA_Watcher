import requests
from bs4 import BeautifulSoup
import pandas as pd
from urllib.parse import urljoin



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

    # Send a request to the URL
    response = requests.get(url)

    # Parse the HTML content of the page
    soup = BeautifulSoup(response.text, 'html.parser')

    # Find the table in the HTML
    table = soup.find('table', {'id': 'players'})

    # Extract the rows from the table
    rows = table.find_all('tr')

    # List to store row data
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
    columns = ['Player Name', 'Player Href', 'Player Unique ID', 'Year Min', 'Year Max', 'Position', 'Height', 'Weight', 'Birth Date', 'Colleges']

    # Create a DataFrame
    df = pd.DataFrame(data, columns=columns)

    return df

def parse_player_game_performance(player_href, year_min, year_max):
    """
    input:
        player_href: can be obtained from player table, e.g.:/players/a/abrinal01
        filter_year: int,  only extract player active after given year
    output:
        dataframe
    """
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
                data.append(row_data)

        # Define column names (list them as they appear in the table)
    columns = ['Game_ID', 'Rk', 'G', 'Date', 'Age', 'Tm', 'Location', 'Opp', 'Result', 'GS', 'MP', 'FG', 'FGA', 'FG%', '3P', '3PA', '3P%', 'FT', 'FTA', 'FT%', 'ORB', 'DRB', 'TRB', 'AST', 'STL', 'BLK', 'TOV', 'PF', 'PTS', 'GmSc', '+/-']
    df = pd.DataFrame(data, columns=columns)
    df.drop(columns=['Rk', 'G'])
    return df


# Save to CSV




response = requests.get( "https://www.basketball-reference.com/players/j/jamesle01/gamelog/2004")
df = parse_player_game_performance("/players/j/jamesle01", 2022, 2024)
df.to_csv('test.csv')

df = parse_player_basic_info('a')
df.to_csv('players_data.csv')