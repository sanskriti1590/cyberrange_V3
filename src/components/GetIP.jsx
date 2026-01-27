import React, { useRef, useState } from "react";
import {
    Button,
    CircularProgress,
    Menu,
    MenuItem,
    Stack,
    Typography,
} from "@mui/material";
import { toast } from "react-toastify";
import API from "../Axios/axios";
import { Icons } from "./icons";
import LanOutlinedIcon from "@mui/icons-material/LanOutlined";


// API call to fetch IPs
export const getIpAddress = async (active_scenario_id) => {
    const token = localStorage.getItem("access_token");
    return await API.get(`corporate/scenario/${active_scenario_id}/get-ips`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const GetIP = ({ active_scenario_id }) => {
    const [scenarioData, setScenarioData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null); // For dropdown menu anchor
    const [selectedIp, setSelectedIp] = useState("");
    const lastFetchedScenarioId = useRef(null);
    const menuTriggerRef = useRef(null); // NEW: to attach anchorEl after fetch

    const open = Boolean(anchorEl);

    const fetchIpData = async () => {
        // Don't fetch again if already fetched for the same scenario
        if (scenarioData && lastFetchedScenarioId.current === active_scenario_id) {
            setAnchorEl(menuTriggerRef.current); // Open menu
            return;
        }

        setLoading(true);
        try {
            const response = await getIpAddress(active_scenario_id);
            response?.data && setScenarioData(response?.data);
            lastFetchedScenarioId.current = active_scenario_id;
            setAnchorEl(menuTriggerRef.current); // Open menu AFTER data is ready
        } catch (error) {
            if (error.response?.data?.errors) {
                const errors = error.response.data.errors;
                for (let key in errors) {
                    const messages = Array.isArray(errors[key]) ? errors[key] : [errors[key]];
                    messages.forEach((msg) => {
                        toast.error(`${key.replace(/_/g, " ").toUpperCase()}: ${msg}`);
                    });
                }
                setScenarioData({ errors });
            } else if (error.response?.data?.detail) {
                toast.error(error.response.data.detail);
            } else {
                toast.error("Failed to load IP addresses. Please try again later.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleClick = () => {
        if (!scenarioData || lastFetchedScenarioId.current !== active_scenario_id) {
            fetchIpData();
        } else {
            setAnchorEl(menuTriggerRef.current);
        }
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleIpSelect = (ip) => {
        setSelectedIp(ip);
        handleClose();
    };

    const generateMenuItems = () => {
        const items = [];

        scenarioData?.instances?.forEach((instance) => {
            instance.ips.forEach((ip, i) => {
                items.push(
                    <MenuItem
                        key={`${instance.id}-${i}`}
                        onClick={() => handleIpSelect(ip.addr)}
                    >
                        {instance.name} ({ip.network}) - {ip.addr}
                    </MenuItem>
                );
            });
        });

        return items.length > 0 ? items : [<MenuItem key="no-data" disabled>No IPs Found</MenuItem>];
    };

    return (
        <Stack spacing={2}>
            <Button
            ref={menuTriggerRef} // anchor ref (unchanged)
            variant="outlined"
            size="small"
            onClick={handleClick}
            startIcon={
                loading ? (
                <CircularProgress size={14} color="inherit" />
                ) : (
                <LanOutlinedIcon />
                )
            }
            endIcon={!loading && <Icons.downArrow />}
            disabled={loading}
            sx={{
                whiteSpace: "nowrap",
                borderColor: "#1e293b",
                color: "#cbd5f5",
                backgroundColor: "rgba(2, 41, 41, 0.6)",
                "&:hover": {
                backgroundColor: "rgba(2, 41, 41, 0.85)",
                borderColor: "#22d3ee",
                },
            }}
            >
            Get IP
            </Button>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            >
                {generateMenuItems()}
            </Menu>

            {selectedIp && (
            <Typography
                variant="caption"
                sx={{
                color: "#94a3b8",
                mt: 0.5,              
                ml: 0.5,
                lineHeight: 1.2,
                whiteSpace: "nowrap",
                }}
            >
                On selected IP: {selectedIp}
            </Typography>
            )}

            {scenarioData?.errors?.non_field_errors?.length > 0 && (
                <Stack mt={2}>
                    <Typography color="error" variant="body2">
                        Errors:
                    </Typography>
                    <ul>
                        {scenarioData.errors.non_field_errors.map((err, idx) => (
                            <li key={idx}>
                                <Typography color="error">{err}</Typography>
                            </li>
                        ))}
                    </ul>
                </Stack>
            )}
        </Stack>
    );
};
