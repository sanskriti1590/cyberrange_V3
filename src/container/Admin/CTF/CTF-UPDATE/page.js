import { Stack, Typography } from "@mui/material"
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { singleCtfUpdateGetApi } from "../../../../APIConfig/adminConfig";

const CtfEditPage = () => {
    const { userId } = useParams()

    useEffect(() => {
        const getApi = async () => {
            const value = await singleCtfUpdateGetApi(userId)
            //console.log(value)
        }
        getApi()
    }, [])
    return (
        <Stack padding={5}>
            <Typography variant="h1">Update Ctf</Typography>
            <Stack alignItems='center' padding={5} sx={{ backgroundColor: "custom.main" }}>
                <Stack width="70%">

                </Stack>
            </Stack>
        </Stack>
    )
}

export default CtfEditPage;