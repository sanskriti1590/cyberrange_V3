import React from 'react';
import { Button } from '@mui/material';

export default function ListItem(props) {
  const { name, player_instance } = props.mail;

  const handleRemove = () => {
    props.remove();
  };

  return (
    <li
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        listStyle: 'none',
        color: '#fff',
      
      }}
    >
      {name.map((n) => (
        <span key={n}>{n}</span>
      ))}-
      {player_instance.map((t) => (
        <span key={t}>{t}</span>
      ))}
      <Button
        color="error"
        variant="contained"
        sx={{ marginLeft: '8px' }}
        onClick={handleRemove}
      >
        Remove
      </Button>
    </li>
  );
}