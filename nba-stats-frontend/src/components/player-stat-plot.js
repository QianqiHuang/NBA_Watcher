import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { REACT_APP_BASE_URL } from '../const';
import { useTheme } from '@mui/material/styles';

import ReactApexChart from 'react-apexcharts';

const areaChartOptions = {
    chart: {
        height: 450,
        type: 'area',
        toolbar: {
            show: false
        }
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'smooth',
        width: 2
    },
    grid: {
        strokeDashArray: 0
    }
};

// ==============================|| INCOME AREA CHART ||============================== //

const IncomeAreaChart = (props) => {
    const theme = useTheme();

    const { primary, secondary } = theme.palette.text;
    const line = theme.palette.divider;

    const [options, setOptions] = useState(areaChartOptions);

    const player = props.player;
    const [playerInfo, setPlayerInfo] = useState([]);

    useEffect(() => {

            axios.get(REACT_APP_BASE_URL + `/stats/player/${player.player_ID}`)
                .then((response) => {
                    setPlayerInfo(response.data);
                    console.log(playerInfo)
                })
                .catch((error) => {
                    console.error('Error fetching data:', error);
                });
    }, [props]);

    useEffect(() => {
        setOptions((prevState) => ({
            ...prevState,
            colors: 
                // ['#03045e', '#023e8a', '#0077b6', '#00b4d8'],
                ['#00b4d8', '#0077b6', '#023e8a', '#03045e'],
            xaxis: {
                categories:
                    playerInfo.map(player => player.season),
                title: {
                    text: 'Season', // X-axis title
                    // margin: 30
                },
                labels: {
                    style: {
                        colors: Array(12).fill(secondary) 
                    }
                },
                axisBorder: {
                    show: true,
                    color: line
                },
                tickAmount: playerInfo.length
            },
            yaxis: {
                labels: {
                    style: {
                        colors: [secondary]
                    }
                }
            },
            grid: {
                borderColor: line
            },
            tooltip: {
                theme: 'light',
                // custom: function({ series, seriesIndex, dataPointIndex, w }) {
                //     return '<div class="tooltip-box">' +
                //            'Value: ' + series[seriesIndex][dataPointIndex] +
                //            '</div>';
                // },
            }
        }));
    }, [primary, secondary, line, theme, playerInfo]);

    const [series, setSeries] = useState([
    ]);

    useEffect(() => {
        setSeries([
            {
                name: 'Average Points',
                data: playerInfo.map(player => player.pts),            
            },
            {
                name: 'Average Assistants',
                data: playerInfo.map(player => player.ast),            
            },
            {
                name: 'Average Rebounds',
                data: playerInfo.map(player => player.trb),            
            },
            {
                name: 'Average Blocks',
                data: playerInfo.map(player => player.blk),            
            },
        ]);
    }, [playerInfo]);

    return <ReactApexChart options={options} series={series} type="area" height={450} />;
};


export default IncomeAreaChart;
