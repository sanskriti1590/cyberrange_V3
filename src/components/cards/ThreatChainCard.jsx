import React, { useState } from "react";
import PropTypes from "prop-types";
import { Box, Button, Chip, CircularProgress, Divider, Stack, Tooltip, Typography, } from "@mui/material";
import { ExpandLess, ExpandMore, Lock, Security } from "@mui/icons-material";
import dayjs from "dayjs";
import HTMLRenderer from "../HtmlRendering";
import AssetSelectionModal from "../modals/AssetSelectionModal";
import { APP_CONFIG } from "../../lib/config";

const ThreatChainCard = ({ item }) => {
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [loadingModel, setLoadingModel] = useState(false);
    const [assetModel, setAssetModel] = useState(null);

    const {
        name = "Unknown",
        id,
        description = "No description available",
        platforms = [],
        tags = {},
        elevated = false,
        display = {},
        stages = [],
        techniques = [],
        release_date
    } = item || {};

    const parsedDate = release_date
        ? dayjs(release_date).format("DD MMM YYYY")
        : "Unknown";

    const plainTextDescription = description.replace(/(<([^>]+)>)/gi, "");

    const summaryDescription =
        plainTextDescription.split(" ").slice(0, 40).join(" ") + "...";

    const handleCardClick = async () => {
        setLoadingModel(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_API_PATH}/bas/assets`);
            const data = await response.json();
            if (data) {
                // Optional: if you want to use this later
                setAssetModel(data || []);

            }

            //  Always show modal after fetch
            setModalOpen(true);
        } catch (error) {
            console.error("Failed to fetch asset data:", error);
        } finally {
            setLoadingModel(false);
        }
    };

    return (
        <>
            <Box
                onClick={handleCardClick}
                sx={{
                    borderRadius: "12px",
                    backgroundColor: "#16181F",
                    color: "#EAEAEB",
                    padding: 3,
                    boxShadow: 3,
                    cursor: "pointer",
                    transition: "0.3s",
                    "&:hover": {
                        transform: "scale(1.01)",
                    },
                    position: "relative",
                }}
            >
                <Stack spacing={2}>
                    {/* Header */}
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="h5" fontWeight="bold">
                            {name}
                        </Typography>
                        <Chip
                            label={tags?.category || "Uncategorized"}
                            sx={{
                                backgroundColor: "#242833",
                                color: "#BCBEC1",
                            }}
                        />
                    </Stack>

                    {/* Meta Info */}
                    <Stack direction="row" spacing={2} flexWrap="wrap">
                        {platforms.length > 0 && (
                            <Chip label={`Platform: ${platforms.join(", ")}`} size="small" />
                        )}
                        <Chip label={`Stages: ${stages?.length || 0}`} size="small" />
                        <Chip
                            label={`Techniques: ${techniques?.length || 0}`}
                            size="small"
                            color="primary"
                        />
                        <Chip
                            icon={<Security />}
                            label={elevated ? "Elevated" : "Standard"}
                            size="small"
                            color={elevated ? "error" : "default"}
                        />
                        <Chip label={`Release: ${parsedDate}`} size="small" />
                        {!display?.endpoint && (
                            <Tooltip title="Restricted content">
                                <Chip icon={<Lock />} label="Locked" size="small" color="warning" />
                            </Tooltip>
                        )}
                    </Stack>

                    <Divider sx={{ borderColor: "#2A2D3A" }} />

                    {/* Description */}
                    <Stack>
                        {showFullDescription ? (
                            <Box sx={{ wordBreak: "break-word" }}>
                                <HTMLRenderer htmlContent={description} />
                            </Box>
                        ) : (
                            <Typography variant="body2" color="#BCBEC1">
                                {summaryDescription}
                            </Typography>
                        )}

                        <Box textAlign="right">
                            <Button
                                size="small"
                                color="info"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setShowFullDescription((prev) => !prev);
                                }}
                                endIcon={showFullDescription ? <ExpandLess /> : <ExpandMore />}
                            >
                                {showFullDescription ? "Read Less" : "Read More"}
                            </Button>
                        </Box>
                    </Stack>

                    {/* Loader Overlay */}
                    {loadingModel && (
                        <Box
                            sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                bgcolor: "rgba(0,0,0,0.5)",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                zIndex: 10,
                                borderRadius: "12px",
                            }}
                        >
                            <CircularProgress color="info" />
                        </Box>
                    )}
                </Stack>
            </Box>

            {/* Asset Modal */}
            {assetModel && (
                <AssetSelectionModal
                    open={modalOpen}
                    assets={assetModel}
                    elevated={elevated}
                    platforms={platforms}
                    onClose={() => setModalOpen(false)}
                    onSubmit={() => setModalOpen(false)}
                    chainId={item.id}
                />
            )}
        </>
    );
};

ThreatChainCard.propTypes = {
    item: PropTypes.shape({
        name: PropTypes.string,
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        description: PropTypes.string,
        platforms: PropTypes.arrayOf(PropTypes.string),
        tags: PropTypes.object,
        elevated: PropTypes.bool,
        display: PropTypes.object,
        stages: PropTypes.array,
        techniques: PropTypes.array,
        release_date: PropTypes.string,
    }).isRequired,
};

export default ThreatChainCard;
