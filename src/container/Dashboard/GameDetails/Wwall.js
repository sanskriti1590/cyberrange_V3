import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Stack, Typography } from '@mui/material';



export default function Wwall() {
  const heading = [

    { title: 'Rank' ,align:'start'},
    { title: 'Username',align:'center' },
    { title: 'Flags' ,align:'center'},
    { title: 'Score',align:'right' }
  ]
  const rows = [
    {
      img: 'https://st3.depositphotos.com/8950810/17657/v/450/depositphotos_176577870-stock-illustration-cute-smiling-funny-robot-chat.jpg',
      name: 'rishav',
      score: 4537,
      flags: 10
    },
    {
      img: 'https://st3.depositphotos.com/8950810/17657/v/450/depositphotos_176577870-stock-illustration-cute-smiling-funny-robot-chat.jpg',
      name: 'shresth',
      score: 4536,
      flags: 20
    },
    {
      img: 'https://st3.depositphotos.com/8950810/17657/v/450/depositphotos_176577870-stock-illustration-cute-smiling-funny-robot-chat.jpg',
      name: 'vikas',
      score: 4535,
      flags: 30
    },
    {
      img: 'https://st3.depositphotos.com/8950810/17657/v/450/depositphotos_176577870-stock-illustration-cute-smiling-funny-robot-chat.jpg',
      name: 'ayush',
      score: 4534,
      flags: 40
    },
    {
      img: 'https://st3.depositphotos.com/8950810/17657/v/450/depositphotos_176577870-stock-illustration-cute-smiling-funny-robot-chat.jpg',
      name: 'yash',
      score: 4533,
      flags: 50
    },
    {
      img: 'https://st3.depositphotos.com/8950810/17657/v/450/depositphotos_176577870-stock-illustration-cute-smiling-funny-robot-chat.jpg',
      name: 'sanskrity',
      score: 4532,
      flags: 60
    },
    {
      img: 'https://st3.depositphotos.com/8950810/17657/v/450/depositphotos_176577870-stock-illustration-cute-smiling-funny-robot-chat.jpg',
      name: 'ankita',
      score: 4531,
      flags: 70
    },
    {
      img: 'https://st3.depositphotos.com/8950810/17657/v/450/depositphotos_176577870-stock-illustration-cute-smiling-funny-robot-chat.jpg',
      name: 'sumit',
      score: 4530,
      flags: 80
    },
    {
      img: 'https://st3.depositphotos.com/8950810/17657/v/450/depositphotos_176577870-stock-illustration-cute-smiling-funny-robot-chat.jpg',
      name: 'rahul',
      score: 4529,
      flags: 90
    },
    {
      img: 'https://st3.depositphotos.com/8950810/17657/v/450/depositphotos_176577870-stock-illustration-cute-smiling-funny-robot-chat.jpg',
      name: 'mohit',
      score: 4528,
      flags: 10
    },

    
  ]
  return (
    <TableContainer>
      <Table sx={{
        [`& .${tableCellClasses.root}`]: {
          borderBottom: "none"
        },

        backgroundColor: 'custom.main'
      }} >
        <TableHead>
          <TableRow>
            {
              heading.map((item, index) => {
                return (
                  <TableCell align={item.align} style={{fontWeight:400,fontSize:'16px',lineHeight:'24px'}}>{item.title}</TableCell>

                )
              })
            }

          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow
              key={index}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >

              <TableCell align="center">
              <Stack direction='row' justifyContent='left'>
             <Typography variant="body2" style={{marginTop:'10px',marginRight:"10px"}}>{index + 1}.</Typography> 
             <img src={row.img} style={{ width: '40px', height: '40px',borderRadius:'50%' }} />
                </Stack>  </TableCell>
              <TableCell align="center">{row.name}</TableCell>
              <TableCell align="center">{row.flags}</TableCell>
              <TableCell align="right">{row.score}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}