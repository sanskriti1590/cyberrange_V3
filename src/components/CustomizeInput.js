import { Stack } from '@mui/material'
import React from 'react'

const CustomizeInput = ({ label, type, name, value, onChange, placeholder, data }) => {
  return (<Stack style={{ gap: 4 }}>
    <label
      style={{
        color: '#F4F4F4', fontSize: '12px', fontWeight: '400', letterSpacing: '0.12px',
      }}
    >{label}</label>
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      name={name}
      style={{
        width: '100%',
        backgroundColor: (data === 'form') ? '#010A1A' : '#161616',
        borderRadius: '8px',
        height: '48px',
        color: '#acacac',
        border: '1px solid #12464C',
        padding: '12px 16px',
      }} />
  </Stack>)
}

export default CustomizeInput