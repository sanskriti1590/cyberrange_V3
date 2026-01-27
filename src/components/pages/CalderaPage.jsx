import * as React from "react";
import { useState } from "react";
import { CircularProgress, Stack } from "@mui/material";
import { useSelector } from "react-redux";
import BreadCrumbs from "../navbar/BreadCrumb";
import { Box } from "@mui/system";

const CalderaPage = () => {
    const { loading: globalLoading } = useSelector((state) => state.user);
    const [iframeLoading, setIframeLoading] = useState(true); // new state to track iframe loading

    return (
        <Stack sx={{ height: '100vh', position: 'relative' }}>
            <BreadCrumbs breadcrumbs={[{ name: "Dashboard", link: "/" }, { name: "MITRE ATT&CK Automation" }]} />
            <Box sx={{ flex: 1, p: 3, position: 'relative' }}>
                <iframe
                    src="https://hackathon.bhumiitech.com/login"
                    title="MITRE ATT&CK Automation"
                    style={{
                        width: "100%",
                        height: "100%",
                        border: "none"
                    }}
                    allow="same-origin"
                    onLoad={() => setIframeLoading(false)}
                ></iframe>

                {iframeLoading && (
                    <Stack
                        alignItems="center"
                        justifyContent="center"
                        sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            zIndex: 10
                        }}
                    >
                        <CircularProgress />
                    </Stack>
                )}
            </Box>
        </Stack>
    );
};

export default CalderaPage;
