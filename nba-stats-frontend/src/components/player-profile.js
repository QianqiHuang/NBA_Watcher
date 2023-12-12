import {
    Avatar,
    Box,
    Button,
    Card,
    CardActions,
    CardContent,
    Divider,
    Typography
} from '@mui/material';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { REACT_APP_BASE_URL } from '../const';


export const PlayerProfile = (props) => {
    const player = props.player;
    const [playersTeamInfo, setPlayersTeamInfo] = useState([]);
    const [lastPlayer, setLastPlayers] = useState([]); // Track the last players array

    useEffect(() => {
        // Check if the current players array is different from the last one
        if (JSON.stringify(player) !== JSON.stringify(lastPlayer)) {
            setLastPlayers(player); // Update the last players array
            axios.get(REACT_APP_BASE_URL + `/player/team/${player.player_ID}`)
                .then((response) => {
                    setPlayersTeamInfo(response.data);
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                });
        }
    }, [props]);

    return (
        <Card sx={{
            height: 560
        }}>
            <CardContent
                sx={{
                    marginY: 10
                }}
            >
                <Box
                    sx={{
                        alignItems: 'center',
                        display: 'flex',
                        flexDirection: 'column'
                    }}
                >
                    <Avatar
                        src={player.avatar_url}
                        variant='square'
                        sx={{
                            height: 180,
                            mb: 2,
                            width: 120
                        }}
                    />
                    <Typography
                        gutterBottom
                        variant="h5"
                    >
                        {player.player_name}
                    </Typography>


                    <Typography
                        color="text.secondary"
                        variant="subtitle1"
                    >
                        {playersTeamInfo.find(player => player.value === props.season)?.team_name || 'Team not found'}
                        {' | '}
                        {player.position}
                        {' | Ages:'}
                        {playersTeamInfo.find(player => player.value === props.season)?.age || 'Age not found'}
                    </Typography>

                    <Typography
                        color="text.secondary"
                        variant="subtitle1"
                    >
                        Experience: {player.year_min}
                        {' - '}
                        {player.year_max}
                    </Typography>
                </Box>
                <Divider sx={{ my: 2 }} variant="middle" />
                <Box
                    sx={{
                        my: 2,
                        alignItems: 'center',
                        display: 'flex',
                        flexDirection: 'row',
                        '& hr': {
                            mx: 0.5,
                        }
                    }}
                >
                    <Typography
                        color="text.secondary"
                        variant="body2"
                        marginX={1}
                    >
                        Height:<br /> {player.height}
                    </Typography>
                    <Divider orientation="vertical" flexItem style={{ borderWidth: '1.2px' }} />

                    <Typography
                        color="text.secondary"
                        variant="body2"
                        marginX={1}

                    >
                        Weight:<br />
                        {player.weight}
                    </Typography>
                    <Divider orientation="vertical" flexItem style={{ borderWidth: '1.2px' }} />

                    <Typography
                        color="text.secondary"
                        variant="body2"
                        marginX={1}

                    >
                        {'Birthday:'}
                        <br />
                        {player.birth_date}
                    </Typography>

                </Box>

            </CardContent>
            {/* <CardActions>
            <Button
              fullWidth
              variant="text"
            >
              Upload picture
            </Button>
          </CardActions> */}
        </Card>
    );
}
