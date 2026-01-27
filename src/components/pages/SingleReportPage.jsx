import React, { useEffect, useState } from "react";
import {
    Backdrop,
    CircularProgress,
    Stack,
    Typography,
    Divider,
    Chip,
    Box,
    Grid,
    Paper,
    Tabs,
    Tab,
    Tooltip,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import BreadCrumbs from "../navbar/BreadCrumb";
import {
    PieChart,
    Pie,
    Cell,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    BarChart,
    XAxis,
    YAxis,
    Bar,
    Legend,
} from "recharts";
import { APP_CONFIG } from "../../lib/config";

import WindowsIcon from "@mui/icons-material/Window";
import SecurityIcon from "@mui/icons-material/Security";
import GppMaybeIcon from "@mui/icons-material/GppMaybe";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import ErrorIcon from "@mui/icons-material/Error";
import BarChartIcon from "@mui/icons-material/BarChart";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import StepsModal from "../modals/StepsModal";


const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

const SingleReportPage = () => {
    const [value, setValue] = useState("overview");

    const { reportId } = useParams();
    const { loading: globalLoading } = useSelector((state) => state.user);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const [stepsModalOpen, setStepsModalOpen] = useState(false);

    const openStepsModal = () => setStepsModalOpen(true);
    const closeStepsModal = () => setStepsModalOpen(false);

    const breadcrumbs = [
        { name: "Dashboard", link: "/" },
        { name: "BAS", link: "/bas" },
        { name: "Report" },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(
                    `${process.env.REACT_APP_API_PATH}/bas/executions/${reportId}`
                );
                res.data && setData(res.data);
            } catch (err) {
                console.error("Failed to fetch report data", err);
            } finally {
                setLoading(false);
            }
        };

        if (reportId) fetchData();
    }, [reportId]);

    const handleChange = (e, newValue) => {
        setValue(newValue);
    };

    if (loading || globalLoading) {
        return (
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        );
    }

    if (!data) return null;

    const asset = data?.assets?.[0];

    const severityChartData = asset?.severity_count
        ? Object.entries(asset.severity_count).map(([key, value]) => ({
            name: key,
            value,
        }))
        : [];

    const summaryChartData = [
        { name: "Finished", value: data?.total_finished },
        { name: "Success", value: data?.total_success },
        { name: "Detected", value: data?.total_detected },
    ];

    return (
        <Stack spacing={3} px={3}>
            <BreadCrumbs breadcrumbs={breadcrumbs} />

            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h2">{data?.attack_name}</Typography>
            </Stack>

            <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ mb: 2 }}
            >
                <Tab value="overview" label="Overview" />
                <Tab value="events" label="Events" />
                <Tab value="asset" label="Asset" />
            </Tabs>

            {value === "overview" && (
                <Stack spacing={3}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <Paper
                                sx={{ p: 2, backgroundColor: "#1C1F26", color: "#E0E0E0" }}
                            >
                                <Typography variant="subtitle1" fontWeight="bold">
                                    Execution Info
                                </Typography>
                                <Divider sx={{ my: 1, borderColor: "#2A2D3A" }} />
                                <Stack spacing={1}>
                                    <Typography variant="body2">
                                        Type: {data?.execution_type}
                                    </Typography>
                                    <Typography variant="body2">Status: {data?.status}</Typography>
                                    <Typography variant="body2">
                                        Progress: {data?.progress}%
                                    </Typography>
                                    <Typography variant="body2">
                                        Run as: {data?.run_elevated ? "Elevated" : "Standard"}
                                    </Typography>
                                    <Typography variant="body2">
                                        Created At: {new Date(data?.created_at).toLocaleString()}
                                    </Typography>
                                </Stack>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Paper
                                sx={{ p: 2, backgroundColor: "#1C1F26", color: "#E0E0E0" }}
                            >
                                <Typography variant="subtitle1" fontWeight="bold">
                                    Attack Details
                                </Typography>
                                <Divider sx={{ my: 1, borderColor: "#2A2D3A" }} />
                                <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                                    {data?.attack?.description || "No description available."}
                                </Typography>
                            </Paper>
                        </Grid>
                    </Grid>

                    {asset && (
                        <Paper sx={{ p: 2, backgroundColor: "#1C1F26", color: "#E0E0E0" }}>
                            <Typography variant="subtitle1" fontWeight="bold">
                                Target Asset
                            </Typography>
                            <Divider sx={{ my: 1, borderColor: "#2A2D3A" }} />
                            <Stack direction="row" spacing={2} flexWrap="wrap">
                                <Chip label={`Hostname: ${asset.hostname}`} color="primary" />
                                <Chip label={`IP: ${asset.ipaddr}`} variant="outlined" />
                                <Chip label={`Platform: ${asset.platform}`} color="secondary" />
                                <Chip label={`Architecture: ${asset.arch}`} variant="outlined" />
                                <Chip label={`Status: ${asset.status}`} color="warning" />
                            </Stack>


                        </Paper>
                    )}

                    <Paper sx={{ p: 2, backgroundColor: "#1C1F26", color: "#E0E0E0" }}>
                        <Typography variant="subtitle1" fontWeight="bold">
                            Execution Summary
                        </Typography>
                        <Divider sx={{ my: 1, borderColor: "#2A2D3A" }} />
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={summaryChartData}>
                                        <XAxis dataKey="name" stroke="#ccc" />
                                        <YAxis />
                                        <Bar dataKey="value" fill="#8884d8" />
                                        <RechartsTooltip />
                                        <Legend />
                                    </BarChart>
                                </ResponsiveContainer>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                            data={severityChartData}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            outerRadius={80}
                                            label
                                        >
                                            {severityChartData.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={COLORS[index % COLORS.length]}
                                                />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Grid>
                        </Grid>
                    </Paper>
                </Stack>
            )}

            {value === "events" && data?.events?.length > 0 && (
                <Paper sx={{ p: 2, backgroundColor: "#1C1F26", color: "#E0E0E0" }}>
                    <Typography variant="subtitle1" fontWeight="bold">Events</Typography>
                    <Divider sx={{ my: 1, borderColor: "#2A2D3A" }} />
                    <Stack spacing={1}>
                        {data?.events.map((event) => (
                            <Box key={event.id}>
                                <Typography variant="body2" color="secondary">
                                    {new Date(event.event_time).toLocaleString()}
                                </Typography>
                                <Typography variant="body2">{event.data}</Typography>
                                <Divider sx={{ my: 1, borderColor: grey[800] }} />
                            </Box>
                        ))}
                    </Stack>
                </Paper>
            )}

            {value === "events" && (!data?.events || data?.events.length === 0) && (
                <Typography color="textSecondary">No events available.</Typography>
            )}

            {value === "asset" && asset && (
                <Paper
                    sx={{
                        p: 3,
                        backgroundColor: "#0F0F0F",
                        color: "#fff",
                        borderRadius: 2,
                        boxShadow: "0 0 20px rgba(0,0,0,0.3)",
                    }}
                >
                    <Stack spacing={2}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Box
                                sx={{
                                    width: 48,
                                    height: 48,
                                    backgroundColor: "#1F1F1F",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: 2,
                                }}
                            >
                                <WindowsIcon sx={{ fontSize: 30, color: "#1976d2" }} />
                            </Box>

                            <Stack spacing={0}>
                                <Typography variant="h6" fontWeight="bold">
                                    {asset.hostname}
                                </Typography>
                                <Typography variant="body2" color="gray">
                                    {asset?.execute_user?.username || "N/A"}
                                </Typography>
                            </Stack>

                            {asset.run_elevated && (
                                <Chip
                                    label="Elevated"
                                    color="error"
                                    size="small"
                                    sx={{ ml: 2, fontSize: "0.75rem", fontWeight: "bold" }}
                                />
                            )}

                            <Box sx={{ ml: "auto", display: "flex", alignItems: "center", gap: 1 }}>
                                <Tooltip title="Antivirus (McAfee)">
                                    <SecurityIcon sx={{ fontSize: 22, color: "#64b5f6" }} />
                                </Tooltip>
                                <Tooltip title="Windows Defender">
                                    <GppMaybeIcon sx={{ fontSize: 22, color: "#81c784" }} />
                                </Tooltip>
                                <Tooltip title="Firewall">
                                    <LocalFireDepartmentIcon sx={{ fontSize: 22, color: "#ef5350" }} />
                                </Tooltip>
                            </Box>
                        </Stack>

                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            justifyContent="space-between"
                            alignItems={{ xs: "flex-start", sm: "center" }}
                        >
                            <Typography variant="body2" color="gray">
                                {asset.ipaddr}

                                <Chip
                                    label="View Steps"
                                    color="info"
                                    clickable
                                    onClick={openStepsModal}
                                    sx={{ fontWeight: "bold", ml: 3, color: "#fff" }}
                                />
                            </Typography>
                            {/* Button to open Steps Modal */}


                            <Stack direction="row" spacing={2}>
                                <SeverityStat label="Critical" color="#e53935" value="100%" />
                                <SeverityStat label="Safe" color="#43a047" value="0%" />
                                <SeverityStat label="Warning" color="#fbc02d" value="0%" />
                            </Stack>
                        </Stack>

                        <Divider sx={{ borderColor: "#2A2D3A", my: 1 }} />

                        <Grid container spacing={2}>
                            {[
                                {
                                    label: "Critical",
                                    count: asset.severity_count?.critical || 0,
                                    color: "#f44336",
                                    icon: <ErrorIcon sx={{ fontSize: 16, verticalAlign: "middle" }} />,
                                },
                                {
                                    label: "High",
                                    count: asset.severity_count?.high || 0,
                                    color: "#ef6c00",
                                    icon: <BarChartIcon sx={{ fontSize: 16, verticalAlign: "middle" }} />,
                                },
                                {
                                    label: "Medium",
                                    count: asset.severity_count?.medium || 0,
                                    color: "#fdd835",
                                    icon: <ReportProblemIcon sx={{ fontSize: 16, verticalAlign: "middle" }} />,
                                },
                                {
                                    label: "Low",
                                    count: asset.severity_count?.low || 0,
                                    color: "#64b5f6",
                                    icon: <ReportProblemIcon sx={{ fontSize: 16, verticalAlign: "middle" }} />,
                                },
                            ].map(({ label, count, color, icon }) => (
                                <Grid item xs={6} sm={3} key={label}>
                                    <Typography variant="body2" sx={{ color }}>
                                        {count} <strong>{label}</strong> Actions Successful {icon}
                                    </Typography>
                                </Grid>
                            ))}
                        </Grid>
                    </Stack>
                </Paper>
            )}

            {/* Steps Modal */}
            <StepsModal
                open={stepsModalOpen}
                onClose={closeStepsModal}
                steps={asset?.steps || []}
                hostname={asset?.hostname}
            />
        </Stack>
    );
};

const SeverityStat = ({ label, color, value }) => (
    <Stack direction="row" alignItems="center" spacing={0.5}>
        <Box
            sx={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: color,
            }}
        />
        <Typography variant="caption" color="textSecondary" sx={{ fontWeight: "bold" }}>
            {label}: {value}
        </Typography>
    </Stack>
);

export default SingleReportPage;
