import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
  Unstable_Grid2 as Grid,
  Card,
  CardHeader,
  CardContent
} from '@mui/material';
import { PlayerSearch } from '../components/player-search';
import { Layout as DashboardLayout } from './layout';
import { TopStatsCard } from '../components/top-stats-card';
import { PlayerProfile } from '../components/player-profile';

import IncomeAreaChart from '../components/player-stat-plot';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { REACT_APP_BASE_URL } from '../const';
import { FilterBar } from '../components/stats-filter';
import { PlayersTable } from '../components/player-table';
import { ImprovementCard } from '../components/player-improvement';


const Page = () => {
  const stats = [
    {
      name: 'Points Per Game',
      col_name: 'pts'
    },
    {
      name: 'Rebounds Per Game',
      col_name: 'trb'
    },
    {
      name: 'Assists Per Game',
      col_name: 'ast'
    },
    {
      name: 'Blocks Per Game',
      col_name: 'blk'
    },
    {
      name: 'Steals Per Game',
      col_name: 'stl'
    },
    {
      name: 'Field Goals Per Game',
      col_name: 'fg'
    },
    {
      name: '3-Point Field Goals Per Game',
      col_name: 'three_p'
    },
    {
      name: 'Free Throws Per Game',
      col_name: 'ft'
    },
    {
      name: 'Minutes Played Per Game',
      col_name: 'mp'
    },
  ];
  const [selectedStats, setSelectedStats] = useState(stats); // Initial selected stats
  const [selectedSeason, setSelectedSeason] = useState('2023-24')
  const [statsData, setStatsData] = useState({});
  const [selectPlayer, setSelectPlayer] = useState([]);

  const [ifSearch, setIfSearch] = useState(false);
  const [playerInfo, setPlayerInfo] = useState(null);


  const handleSelectedSeason = (data) => {
    setSelectedSeason(data);
  };

  const handleSelectedPlayers = (data) => {
    setSelectPlayer(data);
  };

  const handleSearchPlayer = (data) => {
    if (data) {
      setPlayerInfo(data)
      console.log(data)

    } else {
      setIfSearch(false);
    }
  }

  const handleClickHeader = () => {
    setIfSearch(false);
  }

  useEffect(() => {
    if (playerInfo) { setIfSearch(true); }
    else { setIfSearch(false); }
  }, [playerInfo]

  )
  useEffect(() => {
    const statsList = selectedStats.map((item) => (item.col_name));
    const selectedStatsStr = statsList.join(',');

    // Make a GET request to the API endpoint with selected stats
    axios.get(REACT_APP_BASE_URL + `/stats/${selectedSeason}/${selectedStatsStr}`)
      .then((response) => {
        // Update the state with the fetched data
        setStatsData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [selectedStats, selectedSeason]);


  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 3
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={4}
            >
              <Stack spacing={1}>
                <Button onClick={handleClickHeader}>

                  <Typography variant="h4">
                    NBA Players Stats
                  </Typography>
                </Button>

              </Stack>
            </Stack>
            <PlayerSearch
              onSearchPlayer={handleSearchPlayer} />

            {(!ifSearch) ?
              (<>
                <FilterBar
                  onSelectedPlayer={handleSelectedPlayers}
                  onSeasonUpdate={handleSelectedSeason} />
                <PlayersTable
                  items={selectPlayer} />
                <Card>
                  <CardHeader title={'Most Improved Player'} />
                  <CardContent>
                    <Grid container
                      spacing={3}>
                      <Grid item
                        xs={12}
                        md={6}
                        lg={4}>
                        <ImprovementCard
                          stats={'pts'}
                          stats_name={'Average Points'}
                          season={selectedSeason} /></Grid>
                      <Grid item
                        xs={12}
                        md={6}
                        lg={4}>
                        <ImprovementCard
                          stats={'trb'}
                          stats_name={'Average Rebounds'}
                          season={selectedSeason} /></Grid>
                      <Grid item
                        xs={12}
                        md={6}
                        lg={4}>
                        <ImprovementCard
                          stats={'ast'}
                          stats_name={'Average Assists'}
                          season={selectedSeason} /></Grid>
                    </Grid>
                  </CardContent>

                </Card>



                <Grid
                  container
                  spacing={3}
                >
                  {stats.map((statsItem, index) => (
                    <Grid
                      xs={12}
                      md={6}
                      lg={4}
                      key={index}
                    >
                      <TopStatsCard
                        title={statsItem.name + ' Top 5'}
                        players={statsData[statsItem.col_name]}
                      />
                    </Grid>
                  ))}
                </Grid>

              </>) :

              (<Grid
                container
                spacing={3}
              >

                <Grid item xs={12}
                  md={6}
                  lg={4} >
                  <PlayerProfile
                    player={playerInfo}
                    season={'2023-24'} />
                </Grid>
                <Grid item xs={12}
                  md={6}
                  lg={8}>
                  <Card sx={{
                    height: 560
                  }} >
                    <CardHeader title="Basic Stats" />
                    <IncomeAreaChart
                      player={playerInfo}
                      season={selectedSeason}
                    />

                  </ Card>

                </Grid>
              </Grid>)}

          </Stack>
        </Container>
      </Box>
    </>
  );
}

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);


export default Page;
