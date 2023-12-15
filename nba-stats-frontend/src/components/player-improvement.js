import ArrowUpIcon from '@heroicons/react/24/solid/ArrowUpIcon';
import { Avatar, Card, CardContent, Stack, SvgIcon, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { REACT_APP_BASE_URL } from '../const';

const getSeasonOptions = () => {
    const currentYear = 2024
    const seasons = [];
    for (let i = 0; i < 10; i++) {
        seasons.push(`${currentYear - i - 1}-${currentYear - i - 2000}`);
    }
    return seasons;
};


export const ImprovementCard = (props) => {
    const [improvedPlayer, setImprovedPlayer] = useState({})
    const seasons = getSeasonOptions();
    const [season, setSeason] = useState("2023-24")
    const [season2, setSeason2] = useState("2022-23")


    useEffect(() => {
        const index = seasons.findIndex(season => season === props.season);
        let inputSeason = '';

        if (props.season && 0 <= index < seasons.length - 1) {  // Ensure we're not at the first element
            inputSeason =  seasons[index+1] +  ','  + props.season ;
            setSeason(props.season)
            setSeason2(seasons[index+1])
        } else {
            inputSeason = '2022-23,2023-24';
        }
        
        axios.get(`${REACT_APP_BASE_URL}/${inputSeason}/most_improved_player`, {
            params: {
                stat: props.stats
            }
        })
            .then((response) => {
                setImprovedPlayer(response.data);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
            });
    }, [props.stats, props.season]);

    return (
        <Card >
            <CardContent>
                <Stack
                    alignItems="flex-start"
                    direction="row"
                    justifyContent="space-between"
                    spacing={3}
                >
                    <Stack spacing={1}>
                        <Typography
                            color="text.secondary"
                            variant="overline"
                        >
                            {props.stats_name} in {season}
                        </Typography>
                        <Typography variant="h4">
                            {improvedPlayer.stat_23_24}
                        </Typography>
                    </Stack>
                    <Stack spacing={1} alignItems="flex-end">
                        <Avatar
                            src={improvedPlayer.avatar_url}
                            sx={{
                                borderRadius: 1,
                                height: 68,
                                width: 48
                            }}
                        >
                        </Avatar>
                        <Typography variant="body1">
                            {improvedPlayer.player_name}
                        </Typography>
                    </Stack>

                </Stack>
                {improvedPlayer.improvement_percentage && (
                    <Stack
                        alignItems="center"
                        direction="row"
                        spacing={2}
                        sx={{ mt: 2 }}
                    >
                        <Stack
                            alignItems="center"
                            direction="row"
                            spacing={0.5}
                        >
                            <SvgIcon
                                color={'success'}
                                fontSize="small"
                            >
                                <ArrowUpIcon />
                            </SvgIcon>
                            <Typography
                                color={'success.main'}
                                variant="body2"
                            >
                                {improvedPlayer.improvement_percentage.toFixed(2)}%
                            </Typography>
                        </Stack>
                        <Typography
                            color="text.secondary"
                            variant="caption"
                        >
                            Since Season {season2}
                        </Typography>
                    </Stack>
                )}
            </CardContent>
        </Card>
    );
};
