import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Button, IconButton } from '@mui/material';

export default function PlusButton({onClick}){
    return(
        <IconButton aria-label="add" size="large" sx={{border:'1px solid white'}}>
        <AddCircleOutlineIcon  fontSize="inherit" sx={{color:"#0fffff"}} onClick={onClick}/>
      </IconButton>

        
    )
}