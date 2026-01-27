import React from "react";
import {
    Box,
    Card,
    CardContent,
    Chip,
    LinearProgress,
    Stack,
    Typography,
    Divider,
    Button,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";

const ExecutionCard = ({ item }) => {
    const attack = item.attack || {};
    const hostnameList = item.hostname || [];
    const navigate = useNavigate();

    const handleReportClick = () => {
        navigate(`/bas/report/${item.id}`);
    };

    return (
        <Card
            sx={{
                backgroundColor: "#1C1F26",
                borderRadius: "12px",
                boxShadow: 3,
                color: "#E0E0E0",
                mb: 3,
            }}
        >
            <CardContent>
                {/* Attack Name */}
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {attack.name || "Unknown Attack"}
                </Typography>

                <Divider sx={{ borderColor: "#2A2D3A", mb: 2 }} />

                {/* Host Info */}
                {hostnameList.length > 0 && (
                    <Stack spacing={1} sx={{ mb: 2 }}>
                        {hostnameList.map((host, i) => (
                            <Stack
                                key={i}
                                direction="row"
                                spacing={1}
                                flexWrap="wrap"
                                alignItems="center"
                            >
                                <Chip label={`Host: ${host.name}`} size="small" color="primary" />
                                <Chip label={`OS: ${host.os}`} size="small" color="secondary" />
                                <Chip
                                    label={`IP: ${host.ipaddr}`}
                                    size="small"
                                    variant="outlined"
                                />
                            </Stack>
                        ))}
                    </Stack>
                )}

                {/* User & Organization */}
                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                    <Chip
                        label={`User: ${item.username || "N/A"}`}
                        variant="outlined"
                        color="info"
                        size="small"
                    />
                    <Chip
                        label={`Org: ${item.org_name || "N/A"}`}
                        variant="outlined"
                        color="info"
                        size="small"
                    />
                </Stack>

                {/* Execution Metadata */}
                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                    <Chip
                        label={`Execution Type: ${item.execution_type || "N/A"}`}
                        size="small"
                        variant="outlined"
                    />
                    <Chip
                        label={item.run_elevated ? "Elevated" : "Standard"}
                        color={item.run_elevated ? "warning" : "default"}
                        size="small"
                        variant="outlined"
                    />
                </Stack>

                {/* Status & Progress */}
                <Stack spacing={1} sx={{ mb: 2 }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Chip
                            label={`Status: ${item.status || "Unknown"}`}
                            color={item.status_state === "FINISHED" ? "success" : "warning"}
                            size="small"
                        />
                        <Typography variant="body2" color={grey[400]}>
                            {`Progress: ${item.progress || 0}%`}
                        </Typography>
                    </Stack>
                    <LinearProgress
                        variant="determinate"
                        value={item.progress || 0}
                        sx={{
                            height: 8,
                            borderRadius: 5,
                        }}
                        color={item.progress === 100 ? "success" : "info"}
                    />
                </Stack>

                {/* Execution Summary */}
                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
                    <Chip
                        label={`Finished: ${item.total_finished || 0}`}
                        color="success"
                        size="small"
                    />
                    <Chip
                        label={`Success: ${item.total_success || 0}`}
                        color="success"
                        size="small"
                    />
                    <Chip
                        label={`Detected: ${item.total_detected || 0}`}
                        color="error"
                        size="small"
                    />
                </Stack>

                {/* Description */}
                {attack.description && (
                    <Typography
                        variant="body2"
                        sx={{
                            color: grey[400],
                            mt: 1,
                            whiteSpace: "pre-line",
                        }}
                    >
                        {attack.description.length > 300
                            ? attack.description.slice(0, 300) + "..."
                            : attack.description}
                    </Typography>
                )}

                {/* Get Report Button */}
                <Box sx={{ mt: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleReportClick}
                        size="small"
                    >
                        Get Report
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default ExecutionCard;
