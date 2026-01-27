import { Stack, Typography , Box, Button } from "@mui/material";
import { useNavigate } from "react-router";



const RedirectionType = ({item,timeAgo,key}) =>{
    const navigate = useNavigate()
    const handleChanges = ()=>{
      navigate(item.redirection_url)
    }
    return (
        <Stack sx={{backgroundColor:(!item?.is_read)?"#282C38":" #1C1F28",
        padding:1,borderRadius:4,
        cursor:"pointer",marginTop:"8px"}} 
        onClick={handleChanges}
        key={key}>
        <Stack>
         <Stack direction='row' gap={1} sx={{alignItems:'center'}}>
            <div>&bull;</div>
            <Typography variant="h3" style={{color:"#EAEAEB"}}>{item.title}</Typography>
            </Stack>
            <Typography variant="h5" style={{marginLeft:"8px",color:"#9C9EA3"}}>{item.description}</Typography>
            <Typography variant="body3" style={{marginLeft:"8px",color:"#6F727A"}}>{timeAgo}</Typography> 
        </Stack>
        <Stack>
           </Stack>
        </Stack>
    )
}

export default RedirectionType;