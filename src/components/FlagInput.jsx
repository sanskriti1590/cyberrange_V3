// components/FlagInput.jsx
import React from "react";
import { Box, Chip, Stack, TextField, Typography } from "@mui/material";
import PlusButton from "./PlusButton"; // keep your existing plus button

const FlagInput = ({ value, chips, onChange, onAdd, onDelete, error, touched }) => {
    return (
        <>
            <Stack direction="row" justifyContent="space-between" width="100%" spacing={2}>
                <TextField
                    label="Enter Flags"
                    variant="outlined"
                    fullWidth
                    name={value.name}
                    value={value.value}
                    onChange={onChange}
                    onBlur={value.onBlur}
                    error={Boolean(touched && error)}
                    helperText={touched && error}
                />
                <PlusButton onClick={onAdd} />
                <Box>
                    {touched && error && (
                        <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                            {error}
                        </Typography>
                    )}
                </Box>
            </Stack>

            {chips.length > 0 && (
                <Stack direction="row" justifyContent="start" alignItems="center" spacing={1.5} width="100%">
                    {chips.map((chip, i) => (
                        <Chip key={i} label={chip} variant="outlined" onDelete={() => onDelete(chip)} />
                    ))}
                </Stack>
            )}
        </>
    );
};

export default FlagInput;
