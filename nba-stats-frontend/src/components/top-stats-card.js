import { formatDistanceToNow } from 'date-fns';
import PropTypes from 'prop-types';
import ArrowRightIcon from '@heroicons/react/24/solid/ArrowRightIcon';
import EllipsisVerticalIcon from '@heroicons/react/24/solid/EllipsisVerticalIcon';
import {
    Box,
    Button,
    Card,
    CardActions,
    CardHeader,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    SvgIcon,
    Typography
} from '@mui/material';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { REACT_APP_BASE_URL } from '../const';

export const TopStatsCard = (props) => {
    const { players = [], sx, title } = props;
    const [playersInfo, setPlayersInfo] = useState([]);
    const [lastPlayers, setLastPlayers] = useState([]); // Track the last players array

    useEffect(() => {
        // Check if the current players array is different from the last one
        if (JSON.stringify(players) !== JSON.stringify(lastPlayers)) {
            setLastPlayers(players); // Update the last players array

            // Fetch player info only if players array has changed
            Promise.all(
                players.slice(0, 5).map((player) =>
                    axios.get(REACT_APP_BASE_URL + `/player/${player['player id']}`)
                        .then((response) => response.data)
                        .catch((error) => {
                            console.error('Error fetching data:', error);
                            return null; // Return null for errors
                        })
                )
            )
                .then((playerinfo) => {
                    setPlayersInfo(playerinfo);
                });
        }
    }, [players, title]); // Depend on players array and title

    return (
        <Card sx={sx}>
            <CardHeader title={props.title} />
            <List>
                {players.slice(0, 5).map((player, index) => {
                    const hasDivider = index < players.length - 1;
                    const playerInfo = playersInfo[index];
                    return (
                        <ListItem
                            divider={hasDivider}
                            key={index}
                            sx={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                            }}
                        >
                            <Box sx={{ width: '100%', maxWidth: 'calc(100% - 300px)' }}>
                                <ListItemText
                                    primary={`#${index + 1}`}
                                />
                            </Box>
                            <ListItemAvatar
                                sx={{ marginLeft: 0, alignSelf: 'center' }}>
                                {
                                    playerInfo
                                        ? (
                                            <Box
                                                component="img"
                                                src={playerInfo.avatar_url}
                                                sx={{
                                                    borderRadius: 1,
                                                    height: 68,
                                                    width: 48
                                                }}
                                            />
                                        )
                                        : (
                                            <Box
                                                component="img"
                                                src=''
                                                sx={{
                                                    borderRadius: 1,
                                                    height: 68,
                                                    width: 48
                                                }}
                                            />
                                        )
                                }
                            </ListItemAvatar>
                            <ListItemText
                                primary={playerInfo ? playerInfo.player_name : 'N/A'} // Handle missing data
                                primaryTypographyProps={{ variant: 'subtitle1' }}
                                secondary= {<React.Fragment>
                                <Typography
                                  sx={{ display: 'inline' }}
                                  component="span"
                                  variant="subtitle2"
                                  color="text.primary"
                                >
                                  {player.value}
                                </Typography>
                                <Typography
                                  sx={{ display: 'inline' }}
                                  component="span"
                                  variant="body2"
                                  color="text.primary"
                                >
                                  {'        in ' + player.tm}
                                </Typography>
                              </React.Fragment>}
                                
                            />
                        </ListItem>
                    );
                })}
            </List>
            <Divider />
            {/* <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Button
                    color="inherit"
                    endIcon={(
                        <SvgIcon fontSize="small">
                            <ArrowRightIcon />
                        </SvgIcon>
                    )}
                    size="small"
                    variant="text"
                >
                    View all
                </Button>
            </CardActions> */}
        </Card>
    );
};

TopStatsCard.propTypes = {
    players: PropTypes.array,
    sx: PropTypes.object
};
