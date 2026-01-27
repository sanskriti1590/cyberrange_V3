import { Stack } from '@mui/material';
import img from '../../assests/Rangestromrotation.gif'

const LoaderImg = ()=>{
    return(
        <div style={{display:"flex",justifyContent:'center',alignItems:'center'}}>
        <img src={img} style={{justifyContent:'center',alignItems:'center',width:"50%",height:"50%"}}/>
        </div>
    )
}

export default LoaderImg;
