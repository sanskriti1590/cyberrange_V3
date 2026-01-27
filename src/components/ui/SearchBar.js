import React from 'react';
import {InputAdornment, TextField} from '@mui/material';
import {Icons} from '../icons';

const SearchBar = ({value, placeholder, onChange}) => {
  return (
    <TextField
      value={value}
      placeholder={placeholder ? placeholder : 'Search'}
      sx={{borderRadius: 2}}
      InputProps={{
        startAdornment: <InputAdornment position='start'>
          <Icons.search style={{color: '#6F727A', height: '20px', width: '20px'}}/>
        </InputAdornment>
      }}
      onChange={onChange}
    />
  );
};

export default SearchBar;