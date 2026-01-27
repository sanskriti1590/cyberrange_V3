import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Box,
    Button,
    Divider,
    useTheme,
} from "@mui/material";

const StepsModal = ({ open, onClose, steps = [], hostname }) => {
    const theme = useTheme();

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    backgroundColor: "#1a1a1a",
                    color: "#ffffff",
                    border: "2px solid #444",
                    borderRadius: "12px",
                },
            }}
        >
            <DialogTitle sx={{ borderBottom: "1px solid #333", fontWeight: "bold" }}>
                Steps for {hostname}
            </DialogTitle>

            <DialogContent dividers sx={{ borderColor: "#333" }}>
                {steps.length === 0 ? (
                    <Typography color="gray">No steps available.</Typography>
                ) : (
                    steps.map((step) => (
                        <Box
                            key={step.id}
                            mb={2}
                            pb={1}
                            sx={{ borderBottom: "1px solid #333" }}
                        >
                            <Typography variant="subtitle1" fontWeight="bold" color="white">
                                {step.name}
                            </Typography>

                            <Typography
                                variant="body2"
                                sx={{ whiteSpace: "pre-line", mb: 1 }}
                                color="#ccc"
                            >
                                {step.description}
                            </Typography>

                            <Typography variant="body2">
                                Severity: <strong>{step.severity}</strong> | Status:{" "}
                                <strong>{step.done ? "Done" : "Pending"}</strong>
                            </Typography>

                            <Typography variant="caption" color="gray">
                                Created: {new Date(step.created_at).toLocaleString()}
                            </Typography>
                            <br />
                            <Typography variant="caption" color="gray">
                                Updated: {new Date(step.updated_at).toLocaleString()}
                            </Typography>
                        </Box>
                    ))
                )}
            </DialogContent>

            <DialogActions sx={{ borderTop: "1px solid #333", px: 3, py: 2 }}>
                <Button
                    onClick={onClose}
                    variant="contained"
                    color="primary"
                    sx={{
                        fontWeight: "bold",
                        textTransform: "none",
                        bgcolor: "#1976d2",
                        "&:hover": {
                            bgcolor: "#1565c0",
                        },
                    }}
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default StepsModal;
