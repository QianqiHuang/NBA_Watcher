import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import { Card, InputAdornment, OutlinedInput, 
  SvgIcon, MenuItem, Menu } from '@mui/material';
import React, { useState, useRef } from 'react';
import axios from 'axios';
import { REACT_APP_BASE_URL } from '../const';

export const PlayerSearch = ({onSearchPlayer}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const inputRef = useRef(null);  // Create a ref

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
        sx={{ width: '100%' }} // Adjust the maxWidth to leave space for the Select
      />

      {showDropdown && (
        <Menu 
        sx={{ width: '100%' }} 
        open={showDropdown}
        anchorEl={anchorEl}
        onClose={handleClose}
        >
            {searchResults.map((player, index) => (
              <MenuItem
              sx={{ width: '100%' }} 
              key={index} value={player}
              onClick={(event) => handleMenuClick(event, index)}>{player.player_name}</MenuItem>
            ))}
        </Menu>
      )}

    </Card>
);
  
}


