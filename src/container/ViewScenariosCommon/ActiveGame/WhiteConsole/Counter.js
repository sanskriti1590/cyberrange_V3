import React, { useState } from 'react';
import {
    Stack,
    Typography
    } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule';
import "./index.css"

const CounterComponent = () => {
  const [count, setCount] = useState(0);

  const handleCountChange = (event) => {
    const newValue = Math.max(0,Math.min(parseInt(event.target.value, 10), 100))
      setCount(newValue);
    
  };
  const increment = ()=>{
    const newValue = Math.min(parseInt(count+1, 10),100)
    setCount(newValue)
  }

  const decrement = ()=>{
    const newValue = Math.max(count-1,0)
    setCount(newValue)
  }
  return (
    <div>
        <Stack direction='row' alignItems='center' justifyContent="space-around">
        <Typography>Marks</Typography>
     <Stack direction="row" justifyContent='center' alignItems='center' sx={{backgroundColor:"#1C1F28",padding:1,borderRadius:"12px"}}>
     <HorizontalRuleIcon onClick={decrement} />
        <input
          type="number"
          className="remove-arrows"
          style={{width:'60px',textAlign:'center',backgroundColor:"#1C1F28",border:'none',color:'#18985E'}}
          value={count}
          onChange={handleCountChange}
        />
       <AddIcon onClick={increment} sx={{cursor:'pointer'}}/>
      </Stack>
      </Stack>
    </div>
  );
};

export default CounterComponent;
