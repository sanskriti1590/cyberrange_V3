import { Stack } from '@mui/material';
import React from 'react';


const Dropdown = ({name, value, options, onChange }) => {
  return (
    <Stack style={{gap:4}}>
        <label>User Role</label>
    <select 
    value={value} 
    onChange={onChange} 
    name={name} 
    style={{width:'100%',
    height:'54px',
    padding:'8px',
    backgroundColor:"#161616",
    borderRadius:'8px',
    color:"#acacac",
    border:'1px solid #acacac'
    }}>
      {options.map((option) => (
        <option key={option.value} value={option.value} >
          {option.label}
        </option>
      ))}
    </select>
    </Stack>
  );
};

export default Dropdown;