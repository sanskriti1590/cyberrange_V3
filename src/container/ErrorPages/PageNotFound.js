import React from 'react'
import { Button, Stack, Typography } from '@mui/material'
import pageNotFoundImage from '../../assests/errorImages/pageNotFoundImage.svg'
import { useNavigate } from 'react-router-dom'

const PageNotFound = (props) => {
    const navigate = useNavigate()
    return (
        <Stack height={props.pageHeight ? props.pageHeight : '100dvh'} direction={{ xs: 'column-reverse', md: 'row' }} justifyContent="center"
            alignItems="center">
            <Stack width={{ xs: '100%', md: '50%' }} justifyContent="center" alignItems="center" pt={{ xs: 5, md: 0 }}
            >
                <Stack width="fit-content" p={4}>
                    <Typography
                        mb={1}
                        sx={{ fontSize: '36px', fontWeight: '600', color: '#EAEAEB !important', lineHeight: 'normal' }}
                        variant="h1"
                    >
                        Ooops...
                    </Typography>
                    <Typography
                        sx={{ fontSize: 16, fontWeight: '500', color: '#9C9EA3 !important', lineHeight: 'normal' }}
                        variant="h2"
                    >
                        Looks like this page doesn’t exist, but don’t <br />let that stop you. </Typography>
                    <Stack direction="row" sx={{ marginTop: '24px' }}>
                        <Button variant="contained"
                            onClick={() => navigate('/')}
                        >
                            Home
                        </Button>
                    </Stack>
                </Stack>
            </Stack>
            <Stack width={{ xs: '100%', md: '50%' }} alignItems="center" justifyContent="center">
                <img src={pageNotFoundImage} alt="internal_serverError" style={{ maxWidth: '726px' }} height="100%" width="100%" />
            </Stack>
        </Stack>)

}

export default PageNotFound