// components/FileUploadCard.jsx
import React from "react";
import { Stack, Typography } from "@mui/material";
import { Icons } from "../components/icons"; // adjust path if needed
import uploadImage from "../assests/icons/upload.svg";
import pdfImage from "../assests/icons/pdf.svg";
import formatFileSize from "../utilities/formatFileSize";
import truncateString from "../utilities/truncateString";

const FileUploadCard = ({
    file,
    fileUrl,
    onClickUpload,
    inputRef,
    inputProps,
    onDelete,
    type = "pdf", // 'pdf' or 'image'
    error,
}) => {
    const isPdf = type === "pdf";
    return (
        <Stack direction="column" spacing={1.5}>
            <Typography color="#acacac !important">{isPdf ? "Walkthrough" : "Thumbnail"}</Typography>
            <Stack direction="row" spacing={2.5}>
                <Stack
                    justifyContent="center"
                    alignItems="center"
                    sx={{
                        width: "340px",
                        height: "170px",
                        borderRadius: "16px",
                        border: error ? "1px dashed #f44336" : "1px dashed #535660",
                        cursor: "pointer",
                    }}
                    onClick={onClickUpload}
                >
                    {file ? (
                        <Stack
                            justifyContent="center"
                            alignItems="center"
                            gap={1}
                            sx={{
                                width: "132px",
                                height: "132px",
                                borderRadius: "16px",
                                border: "1px solid #242833",
                                position: "relative",
                            }}
                        >
                            <Icons.crossCircle
                                style={{
                                    position: "absolute",
                                    top: "8px",
                                    right: "8px",
                                    cursor: "pointer",
                                    color: "#535660",
                                }}
                                onClick={onDelete}
                            />
                            {isPdf ? (
                                <>
                                    <img src={pdfImage} alt="upload" style={{ width: "40px", height: "40px" }} />
                                </>
                            ) : (
                                <img
                                    src={URL.createObjectURL(file)}
                                    alt="thumbnail"
                                    style={{ width: "40px", height: "40px", objectFit: "cover" }}
                                />
                            )}
                            <Typography variant="body2" sx={{ color: "#9C9EA3 !important" }}>
                                {truncateString(file.name, 15)}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#9C9EA3 !important", fontSize: "10px !important" }}>
                                Size - {formatFileSize(file.size)}
                            </Typography>
                        </Stack>
                    ) : (
                        <Stack justifyContent="center" alignItems="center">
                            <img src={uploadImage} alt="upload" style={{ width: "40px", height: "40px" }} />
                            <Typography variant="body1" sx={{ textDecoration: "underline", color: "#00FFFF !important" }}>
                                Click to Upload
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#6F727A !important" }}>
                                Maximum file size {isPdf ? "50 MB" : "5 MB"}
                            </Typography>
                        </Stack>
                    )}
                    <input {...inputProps} ref={inputRef} style={{ display: "none" }} />
                </Stack>
            </Stack>

            {fileUrl && (
                <a href={fileUrl} target="_blank" rel="noreferrer">
                    Open File
                </a>
            )}
        </Stack>
    );
};

export default FileUploadCard;
