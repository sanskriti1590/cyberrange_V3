// components/EditorsSection.jsx
import React from "react";
import { Stack, Typography } from "@mui/material";
import TextEditor from "./TextEditor"; // your existing editor

const EditorsSection = ({
    label,
    value,
    setValue,
    error,
}) => {
    return (
        <Stack width="100%" spacing={1.5} marginBottom={5.5}>
            <Typography color="#acacac !important">{label}</Typography>
            <TextEditor setText={setValue} text={value} />
            {error && (
                <Typography variant="caption" color="error">
                    {error}
                </Typography>
            )}
        </Stack>
    );
};

export default EditorsSection;
