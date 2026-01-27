import React from 'react'
import { Button, Stack, Typography } from '@mui/material'
import serverErrorImage from '../../assests/errorImages/serverErrorImage.svg'
import { useNavigate } from 'react-router-dom'

const ServerError = (props) => {
    const navigate = useNavigate()
    window.onbeforeunload = function () {
        // Your function logic here

        navigate('/')
        // Perform your function here
    };
    return (
        <Stack height={props.pageHeight ? props.pageHeight : '100dvh'} direction={{ xs: 'column-reverse', md: 'row' }} justifyContent="center"
            alignItems="center">
            <Stack width={{ xs: '100%', md: '50%' }} justifyContent="flex-end" alignItems="center" pt={{ xs: 5, md: 0 }}
            >
                <Stack width="fit-content" p={4}>
                    <Typography
                        mb={1}
                        sx={{ fontSize: '36px', fontWeight: '600', color: '#EAEAEB !important', lineHeight: 'normal' }}
                        variant="h1"
                    >
                        Uh Oh !
                    </Typography>
                    <Typography
                        sx={{ fontSize: 16, fontWeight: '500', color: '#9C9EA3 !important', lineHeight: 'normal' }}
                        variant="h2"
                    >
                        something went wrong on our end. We've alerted the engineers, <br /> and they are working on a solution.<br />
                    </Typography>
                    <Stack direction="row" sx={{ marginTop: '24px' }}>
                        <Button variant="contained"
                            onClick={() => navigate('/')}
                        >
                            Home
                        </Button>
                        <Button variant="outlined" sx={{ marginLeft: '8px' }}
                        // onClick={() => navigate('/')}
                        >
                            Contact Us
                        </Button>
                    </Stack>
                </Stack>
            </Stack>
            <Stack width={{ xs: '100%', md: '50%' }} alignItems="center" justifyContent="center">
                <img src={serverErrorImage} alt="internal_serverError" style={{ maxWidth: '726px' }} height="100%" width="100%" />
            </Stack>
        </Stack>)
}

export default ServerError