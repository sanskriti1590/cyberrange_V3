import { Button, Divider, Stack, Typography } from "@mui/material";
import axios from "axios";
import { useEffect } from "react";
import { ctfUpdateGetApi } from "../../../../APIConfig/adminConfig";
import { useState } from "react";
import EditIcon from '@mui/icons-material/Edit';
import { Navigate, useNavigate } from "react-router-dom";
import './index.css'
import { scenarioUpdateGetApi } from "../../../../APIConfig/scenarioConfig";

const CtfUpdate = () => {
    const navigate = useNavigate()
    const [data, setData] = useState([])
    const [senData, setSenData] = useState([])
    useEffect(() => {
        const getApi = async () => {
            const value = await ctfUpdateGetApi()
            const value2 = await scenarioUpdateGetApi()
            //console.log('value is hrer',value2)
            value?.data && setData(value?.data)
            value2?.data && setSenData(value2?.data)
        }
        getApi()
    }, [])
    return (
        <Stack direction='row' >
            {/* ctf update */}
            <Stack padding={1} width="50%">
                <Typography variant="h1">Solo Update</Typography>
                <Stack alignItems='center' padding={2} sx={{ backgroundColor: "custom.main" }}>
                    <Stack width="70%">
                        <Stack direction='row' justifyContent='space-between' alignItems='center' sx={{ my: 2 }}>
                            <Typography variant="h2">Solo-Name</Typography>
                            <Typography variant='h2'>Edit</Typography>
                        </Stack>
                        <Stack gap={2} height="500px" overflow='scroll' className="example">
                            {
                                data?.map((item, index) => {
                                    return (
                                        <Stack key={index}>
                                            <Divider color="#acacac" />
                                            <Stack direction='row' alignItems='center' justifyContent='space-between' >
                                                <Typography variant="h3">{item?.ctf_name}</Typography>
                                                <Button variant="contained" color="secondary" startIcon={<EditIcon />} onClick={() => navigate(`/admin/editSolo/${item?.ctf_id}`)} sx={{ width: "100px" }}>Edit</Button>
                                            </Stack>
                                        </Stack>
                                    )
                                })
                            }
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>

            {/* scenario update */}
            <Stack padding={1} width="50%">
                <Typography variant="h1">Squad Update</Typography>
                <Stack alignItems='center' padding={2} sx={{ backgroundColor: "custom.main" }}>
                    <Stack width="70%">
                        <Stack direction='row' justifyContent='space-between' alignItems='center' sx={{ my: 2 }}>
                            <Typography variant="h2">Squad-Name</Typography>
                            <Typography variant='h2'>Edit</Typography>
                        </Stack>
                        <Stack gap={2} height="500px" overflow='scroll' className="example">
                            {
                                senData?.map((item, index) => {
                                    return (
                                        <Stack key={index}>
                                            <Divider color="#acacac" />
                                            <Stack direction='row' alignItems='center' justifyContent='space-between' >
                                                <Divider />
                                                <Typography variant="h3" width="60%">{item?.scenario_name}</Typography>
                                                <Button variant="contained" color="secondary" startIcon={<EditIcon />} onClick={() => navigate(`/admin/updateSquad/${item?.scenario_id}`)} sx={{ width: "100px" }}>Edit</Button>
                                            </Stack>
                                        </Stack>
                                    )
                                })
                            }
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>
        </Stack>
    )
}

export default CtfUpdate;