import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { Card, InputAdornment, OutlinedInput, 
  SvgIcon, MenuItem, FormControl, Select, Menu } from '@mui/material';
import React, { useState, useRef } from 'react';
import axios from 'axios';
import { REACT_APP_BASE_URL } from '../const';

export const PlayerSearch = ({onSeasonUpdate, onSearchPlayer}) => {
  const [filter, setFilter] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const inputRef = useRef(null);  // Create a ref


  const getSeasonOptions = () => {
    const currentYear = 2023
    const seasons = [];
    for (let i = 0; i < 10; i++) {
      seasons.push(`${currentYear - i - 1}-${currentYear - i-2000}`);
    }
    return seasons;
  };
  
  const seasons = getSeasonOptions(); 

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    onSeasonUpdate(event.target.value);
  };

  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleEnterPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      console.log('Search for:', inputValue);
      if (inputValue){
      axios.get(REACT_APP_BASE_URL + `/search/${inputValue}`)
      .then((response) => {
        if (response.data.length > 1){
          setSearchResults(response.data);
          setShowDropdown(true);
          setAnchorEl(inputRef.current);
        } else if (response.data.length == 1) 
        {
          onSearchPlayer(response.data[0])
          setShowDropdown(false);
        }
        // console.log(response.data)
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });} else {
        onSearchPlayer('')
      }
    }
  };
  const handleClose = () => {
    setAnchorEl(null);
    setShowDropdown(false);
  };

  const handleMenuClick = (event, index) => {
    onSearchPlayer(searchResults[index]);
    setAnchorEl(null);
    setShowDropdown(false);
  };


  return (

  <Card sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

      <OutlinedInput
        ref={inputRef}
        defaultValue=""
        onChange={handleInputChange}
        placeholder="Search player name.."
        startAdornment={(
          <InputAdornment position="start">
            <SvgIcon color="action" fontSize="small">
              <MagnifyingGlassIcon />
            </SvgIcon>
          </InputAdornment>
        )}
        inputProps={{
          onKeyPress: handleEnterPress
        }}
        sx={{ width: '100%', maxWidth: 'calc(100% - 300px)' }} // Adjust the maxWidth to leave space for the Select
      />
      <FormControl sx={{ minWidth: 200 }}>
        <Select
          value={filter}
          onChange={handleFilterChange}
          displayEmpty
          inputProps={{ 'aria-label': 'Without label' }}
        >
          <MenuItem disabled value="">
            <em>Season 2023-2024</em>
          </MenuItem>
          {seasons.map((season) => (
        <MenuItem key={season} value={season}>{'Season ' + season}</MenuItem>
      ))}
        </Select>
      </FormControl>

      {showDropdown && (
        <Menu 
        open={showDropdown}
        anchorEl={anchorEl}
        onClose={handleClose}
        >
            {searchResults.map((player, index) => (
              <MenuItem
              key={index} value={player}
              onClick={(event) => handleMenuClick(event, index)}>{player.player_name}</MenuItem>
            ))}
        </Menu>
      )}

    </Card>
);
  
}


