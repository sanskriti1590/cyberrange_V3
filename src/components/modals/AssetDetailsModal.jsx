import React, { useEffect, useState } from "react";
import {
    Box,
    Modal,
    Typography,
    CircularProgress,
    Stack,
    Divider,
} from "@mui/material";
import axios from "axios";

const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "#1C1F26",
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
    maxHeight: "80vh",
    overflowY: "auto",
    color: "#fff",
    width: { xs: "90%", sm: 600 },
};

const AssetDetailsModal = ({ open, handleClose, model }) => {
    const [loading, setLoading] = useState(false);
    const [systemInfo, setSystemInfo] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!open || !model) return;

        setLoading(true);
        setSystemInfo(null);
        setError(null);

        axios
            .get("http://127.0.0.1:8000/api/bash/v1/assets")
            .then((res) => {
                const matched = res.data.find(
                    (asset) => asset.systeminfo?.model === model
                );
                if (matched) setSystemInfo(matched.systeminfo);
                else setError("No matching asset found.");
            })
            .catch((err) => setError("Failed to fetch data."))
            .finally(() => setLoading(false));
    }, [open, model]);


    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={modalStyle}>
                {loading ? (
                    <CircularProgress />
                ) : error ? (
                    <Typography color="error">{error}</Typography>
                ) : systemInfo ? (
                    <Stack spacing={2}>
                        <Typography variant="h6" gutterBottom>
                            Host: {systemInfo.hostname}
                        </Typography>
                        <Divider />
                        {Object.entries(systemInfo).map(([key, value]) => (
                            <Stack key={key} direction="row" spacing={1}>
                                <Typography sx={{ width: 160, fontWeight: "bold" }}>
                                    {key}
                                </Typography>
                                <Typography>
                                    {typeof value === "object"
                                        ? JSON.stringify(value)
                                        : String(value)}
                                </Typography>
                            </Stack>
                        ))}
                    </Stack>
                ) : (
                    <Typography>No system info found.</Typography>
                )}
            </Box>
        </Modal>
    );
};

export default AssetDetailsModal;
