import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TopPlayerStats({ season }) {
  const [playerStats, setPlayerStats] = useState({
    score: [],
    rebound: [],
    assist: [],
    steal: [],
    fgPercent: [],
    threePtPercent: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get(`/api/stats/${season}`);
        setPlayerStats(response.data);
      } catch (error) {
        console.error('Error fetching player stats', error);
      }
    };

    fetchStats();
  }, [season]);

  return (
    <div>
      <h1>Top Players - Season {season}</h1>
      <div className="stat-category">
        <h2>Scoring Leaders</h2>
        {/* Map through playerStats.score and display */}
      </div>
      {/* Repeat for other stat categories */}
    </div>
  );
}

export default TopPlayerStats;