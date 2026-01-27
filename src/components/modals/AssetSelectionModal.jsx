import React, { useState } from "react";
import {
    Modal,
    Box,
    Typography,
    Stack,
    Checkbox,
    Button,
    Divider,
    Avatar,
    Tooltip,
} from "@mui/material";
import { Window, Security } from "@mui/icons-material";
import LinuxIcon from "@mui/icons-material/Terminal";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { APP_CONFIG } from "../../lib/config";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "#1a1a1a",
    color: "#fff",
    border: "2px solid #444",
    boxShadow: 24,
    p: 4,
    borderRadius: "12px",
};

const AssetSelectionModal = ({
    open,
    assets = [],
    platforms = [],
    elevated,
    onClose,
    onSubmit,
    chainId,
}) => {
    const [selected, setSelected] = useState([]);
    const navigate = useNavigate();

    const toggleSelect = (id) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const handleSubmit = async () => {
        if (!chainId || selected.length === 0) return;

        const requestBody = {
            asset_ids: selected,
            run_elevated: elevated,
        };

        try {
            const res = await fetch(
                `${process.env.REACT_APP_API_PATH}/bas/chains/${chainId}/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(requestBody),
                }
            );

            const isJson = res.headers
                .get("content-type")
                ?.includes("application/json");

            if (!res.ok) {
                const errorData = isJson ? await res.json() : await res.text();
                throw new Error(
                    errorData?.message || errorData || "Failed to execute chain"
                );
            }

            const data = await res.json();

            toast.success("Attack chain executed successfully!");

            if (typeof onSubmit === "function") {
                onSubmit(data);
            }
            if (onClose) onClose();

            navigate(`/bas/report/${data.id}`);
        } catch (err) {
            console.error("Error executing chain:", err);
            toast.error("Error executing chain.");
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <Typography variant="h3" gutterBottom>
                    Select Assets
                </Typography>

                <Divider sx={{ borderColor: "#333", mb: 2 }} />

                <Stack spacing={1} sx={{ maxHeight: 300, overflowY: "auto" }}>
                    {assets.map((asset) => {
                        const os = asset.systeminfo?.os || "unknown";
                        const isWindows = os.toLowerCase().includes("win");
                        const hostname = asset.systeminfo?.hostname || "Unknown";
                        const ip = asset.systeminfo?.ipaddr || "0.0.0.0";

                        const platformKey = isWindows ? "windows" : "linux";

                        if (platforms.includes(platformKey)) {
                            return (
                                <Stack
                                    key={asset.id}
                                    direction="row"
                                    alignItems="center"
                                    spacing={2}
                                    sx={{
                                        px: 1,
                                        py: 1,
                                        borderRadius: 1,
                                        backgroundColor: "#232323",
                                        "&:hover": { backgroundColor: "#2a2a2a" },
                                    }}
                                >
                                    <Checkbox
                                        checked={selected.includes(asset.id)}
                                        onChange={() => toggleSelect(asset.id)}
                                        color="info"
                                    />
                                    <Avatar sx={{ bgcolor: "transparent" }}>
                                        {isWindows ? (
                                            <Window fontSize="small" />
                                        ) : (
                                            <LinuxIcon fontSize="small" />
                                        )}
                                    </Avatar>
                                    <Box flexGrow={1}>
                                        <Typography>{hostname}</Typography>
                                        <Typography variant="caption" color="gray">
                                            {ip}
                                        </Typography>
                                    </Box>
                                    {asset.elevated && (
                                        <Tooltip title="Elevated Access">
                                            <Security fontSize="small" color="error" />
                                        </Tooltip>
                                    )}
                                </Stack>
                            );
                        }

                        return null;
                    })}
                </Stack>

                <Divider sx={{ borderColor: "#333", mt: 2, mb: 2 }} />

                <Box textAlign="right">
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSubmit}
                        disabled={selected.length === 0}
                        sx={{
                            "&.Mui-disabled": {
                                color: "rgba(0, 0, 0, 0.7)",
                                borderColor: "rgba(0, 0, 0, 0.7)",
                                backgroundColor: "rgba(200, 200, 200, 0.3)",
                            },
                        }}
                    >
                        Submit Now
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default AssetSelectionModal;
