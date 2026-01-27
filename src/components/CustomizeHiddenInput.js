import { IconButton, Stack } from '@mui/material'
import React, { useState } from 'react'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'

const CustomizeHiddenInput = ({ label, type, value, onChange, name, placeholder,onKeyPress}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible)
  }

  return (<Stack style={{ gap: 4 }}>
    <label
      style={{
        color: '#F4F4F4', fontSize: '12px', fontWeight: '400', letterSpacing: '0.12px',
      }}
    >{label}</label>
    <Stack direction="row" style={{ border: '1px solid #12464C', borderRadius: '8px' }}>
      <input
        type={isPasswordVisible ? 'text' : type}
        value={value}
        placeholder={placeholder}
        name={name}
        onChange={onChange}
        style={{
          width: '100%',
          backgroundColor: '#161616',
          height: '48px',
          color: '#acacac',
          border: 'none',
          padding: '12px 16px',
          borderRadius: '8px'
        }}
        onKeyPress={onKeyPress}
      />
      {type === 'password' && (<IconButton onClick={togglePasswordVisibility}>
        {isPasswordVisible ? <VisibilityIcon style={{ color: '#acacac' }} /> :
          <VisibilityOffIcon style={{ color: '#acacac' }} />}
      </IconButton>
        // <button onClick={togglePasswordVisibility}>
        //   {isPasswordVisible ? 'Hide' : 'Show'} Password
        // </button>
      )}
    </Stack>
  </Stack>)
}

export default CustomizeHiddenInput