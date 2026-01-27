import { Button, Stack, Typography } from "@mui/material"
import uploadImg from '../../../components/assests/uploadIcon.png'

import { Link } from "react-router-dom"


const SenariosUploadEnding = () => {
    return (
        <Stack sx={{ justifyContent: 'center', alignItems: 'center', height: "100vh" }}>

            <Stack backgroundColor="custom.main" style={{ border: '1px dashed #12464C', height: '356px', width: '858px', justifyContent: 'center', alignItems: 'center', gap: 24, padding: 4 }}>
                <Typography variant="h1" style={{ textAlign: 'center' }}>Check out our other Scenario challenges while we prepare your requested machine</Typography>
                <Typography variant='h4' style={{ textAlign: 'center' }}>Thanks for your interest in our Scenario machines! While we prepare your request, check out our other challenges with a wide variety to choose from. Your requested machine will be ready in a few days!</Typography>
                <Link to="/"><Button variant='contained' color="secondary" sx={{ width: '200px', p: 4, fontSize: "30px" }}>Explore</Button></Link>
            </Stack>


        </Stack>
    )
}

export default SenariosUploadEnding