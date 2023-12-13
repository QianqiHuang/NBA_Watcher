import {
    Card, Box, Typography,
    Grid, MenuItem, FormControl, Select,
    Slider, InputLabel
} from '@mui/material';
import React, { useState, useEffect} from 'react';
import axios from 'axios';
import { REACT_APP_BASE_URL } from '../const';
import { styled } from '@mui/material/styles';

const ValueSlider = styled(Slider)(({ theme }) => ({
    '& .MuiSlider-valueLabel': {
        fontSize: 12,
        fontWeight: 'normal',
        top: -6,
        backgroundColor: 'unset',
        color: theme.palette.text.primary,
        '&:before': {
            display: 'none',
        },
        '& *': {
            background: 'transparent',
            color: theme.palette.mode === 'dark' ? '#fff' : '#000',
        },
    },
}));


export const FilterBar = ({ onSeasonUpdate, onSelectedPlayer }) => {
    const [filter, setFilter] = useState('2023-24');
    const maxPoints = 37;
    const maxRebounds = 16;
    const maxAssists = 12;
    const [points, setPoints] = useState([0, maxPoints / 2]);
    const [rebounds, setrebounds] = useState([0, maxRebounds / 2]);
    const [assists, setAssists] = useState([0, maxAssists / 2]);

    useEffect(() => {
        axios.get(`${REACT_APP_BASE_URL}/stats/${filter}/range`, {
            params: {
              min_pts: points[0],
              max_pts: points[1],
              min_ast: assists[0],
              max_ast: assists[1],
              min_trb: rebounds[0],
              max_trb: rebounds[1],
            }
          })
            .then((response) => {
                onSelectedPlayer(response.data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, [points, rebounds, assists, filter]);

    const getSeasonOptions = () => {
        const currentYear = 2024
        const seasons = [];
        for (let i = 0; i < 10; i++) {
            seasons.push(`${currentYear - i - 1}-${currentYear - i - 2000}`);
        }
        return seasons;
    };

    const seasons = getSeasonOptions();


    const handlePointsSlider = (event, newValue) => {
        setPoints(newValue)
    };

    const handleReboundsSlider = (event, newValue) => {
        setrebounds(newValue)
    };

    const handleAssistsSlider = (event, newValue) => {
        setAssists(newValue);
    };


    const handleSeasonFilterChange = (event) => {
        setFilter(event.target.value);
        onSeasonUpdate(event.target.value);
    };

    return (

        <Card sx={{
            p: 2, display: 'flex',
            flexDirection: 'row', alignItems: 'center', gap: 8,
            height: 100
        }}>


            <FormControl sx={{ minWidth: 200 }}>
                <InputLabel id="demo-simple-select-label">Select Season to Show..</InputLabel>

                <Select
                    value={filter}
                    onChange={handleSeasonFilterChange}
                    //   displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
                >
                    {seasons.map((season) => (
                        <MenuItem key={season} value={season}>{'Season ' + season}</MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Box sx={{ width: '100%', maxWidth: 300 }}>

                <Grid container spacing={2} alignItems="center">
                    <Grid item>
                        <Typography id="input-slider" gutterBottom>
                            Points
                        </Typography>
                    </Grid>
                    <Grid item xs>
                        <ValueSlider
                            valueLabelDisplay="on"
                            value={points}
                            onChange={handlePointsSlider}
                            aria-labelledby="input-slider"
                            step={0.1}
                            min={0}
                            max={maxPoints}
                        />
                    </Grid>

                </Grid>
            </Box>

            <Box sx={{ width: '100%', maxWidth: 300 }}>

                <Grid container spacing={2} alignItems="center">
                    <Grid item>
                        <Typography id="input-slider" gutterBottom>
                            Rebounds
                        </Typography>
                    </Grid>
                    <Grid item xs>
                        <ValueSlider
                            valueLabelDisplay="on"
                            value={rebounds}
                            onChange={handleReboundsSlider}
                            aria-labelledby="input-slider"
                            step={0.1}
                            min={0}
                            max={maxRebounds}
                        />
                    </Grid>

                </Grid>
            </Box>

            <Box sx={{ width: '100%', maxWidth: 300 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item>
                        <Typography id="input-slider" gutterBottom>
                            Assists
                        </Typography>
                    </Grid>
                    <Grid item xs>
                        <ValueSlider
                            valueLabelDisplay="on"
                            value={assists}
                            onChange={handleAssistsSlider}
                            aria-labelledby="input-slider"
                            step={0.1}
                            min={0}
                            max={maxAssists}
                        />
                    </Grid>

                </Grid>
            </Box>

        </Card>
    );

}


