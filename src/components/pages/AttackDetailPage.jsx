import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    Typography,
    Box,
    Divider,
    Chip,
    Stack,
    CircularProgress,
    Tooltip,
} from "@mui/material";
import { Security } from "@mui/icons-material";
import { APP_CONFIG } from "../../lib/config";

const AttackDetailPage = () => {
    const { libraryId } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_PATH}/bas/chains/${libraryId}`)
            .then((res) => res.json())
            .then(setData)
            .catch(() => console.error("Failed to load attack data"))
            .finally(() => setLoading(false));
    }, [libraryId]);

    if (loading) {
        return <CircularProgress />;
    }

    if (!data) {
        return <Typography variant="h6">Attack data not found.</Typography>;
    }

    return (
        <Box p={4}>
            <Typography variant="h4" gutterBottom>
                {data.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" paragraph>
                {data.description}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                <Chip label={data.platform} color="primary" />
                <Chip label={data.tags?.category} color="secondary" />
                {data.elevated && (
                    <Tooltip title="Elevated Access Required">
                        <Security color="error" />
                    </Tooltip>
                )}
            </Stack>

            <Typography variant="h6" gutterBottom>Stages</Typography>
            <Stack spacing={1}>
                {data.stages.map((stage, index) => (
                    <Box key={index} sx={{ p: 2, bgcolor: "#1e1e1e", borderRadius: 2 }}>
                        <Typography variant="subtitle1">{stage.name}</Typography>
                        <Typography variant="caption" color="gray">Actions: {stage.actions.join(", ")}</Typography>
                    </Box>
                ))}
            </Stack>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>MITRE Techniques</Typography>
            <Stack spacing={1}>
                {data.techniques.map((tech, i) => (
                    <Chip
                        key={i}
                        label={`${tech.absolute_id}`}
                        variant="outlined"
                        color="info"
                    />
                ))}
            </Stack>

            <Divider sx={{ my: 3 }} />

            <Typography variant="body2" color="gray">
                Last Run: {new Date(data.last_run_at).toLocaleString()}
            </Typography>
            <Typography variant="body2" color="gray">
                Success: {data.success_count} / {data.total_count}
            </Typography>
        </Box>
    );
};

export default AttackDetailPage;
