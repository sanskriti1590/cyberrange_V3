import { Box, Typography, Button, Stack } from "@mui/material";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import Carousel from "./Carousel";
import { useNavigate } from "react-router-dom";


const ChallengeCard = () => {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate('/categories')
    }
    return (
        <Box sx={{ bgcolor: 'background.secondary', width: "95%", height: '464px', display: 'flex', gap: 3 }}>
            {/* left side of the card */}
            <Stack width="40%" height="100%"  sx={{marginTop:5}} gap={2} paddingLeft={3}>
            <Typography variant="h2">CTF Challenges</Typography>
          <Carousel/>
            </Stack>
            {/* right side of the card */}
            <Stack width="56%" height='100%' sx={{marginTop:5}} gap={2}>
                <Typography variant="h2">Scores</Typography>
                <Box sx={{ bgcolor: 'background.light', width: "100%", height: '240px', border: '1px solid secondary', padding: 3 ,borderRadius:2}}>

                    <Typography variant="display1" color='secondary'>0</Typography>
                    <Typography variant="h4">We can't wait to see what you'll do. Start by creating a private game and challenging your friends, or join a public game and show the world what you're made of.</Typography>
                </Box>
                <Stack direction='row' gap={1}>
                    <Button variant='contained' color="secondary" width="187px" height='56px'>Join Public CTF</Button>
                    <Button variant='outlined' color="secondary" endIcon={<ArrowForwardIosIcon />} onClick={handleClick}>Create Private Game</Button>
                </Stack>

            </Stack>
        </Box>
    )
}

export default ChallengeCard;