import React, { useRef } from "react";
import { Stack, Typography } from "@mui/material";
import { toast } from "react-toastify";

import uploadImage from "../../../assests/icons/upload.svg";
import pdfImage from "../../../assests/icons/pdf.svg";
import { Icons } from "../../../components/icons";
import truncateString from "../../../utilities/truncateString";
import formatFileSize from "../../../utilities/formatFileSize";

const MAX_FILES = 4;
const MAX_TOTAL_SIZE = 1000 * 1024; // 1000 KB

const ScenarioWalkthrough = ({
  walkthrough = [],
  onFileUpload,
  deleteFileHandler,
}) => {
  const fileInputRef = useRef(null);

  /* ---------- FILE INPUT ---------- */
  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (walkthrough.length + files.length > MAX_FILES) {
      toast.error(
        `You can upload only ${MAX_FILES - walkthrough.length} more file(s).`
      );
      e.target.value = null;
      return;
    }

    // current total size (ONLY count File objects)
    const currentTotalSize = walkthrough.reduce(
      (total, f) => (typeof f === "object" ? total + f.size : total),
      0
    );

    let newFilesTotalSize = 0;

    for (const file of files) {
      if (file.type !== "application/pdf") {
        toast.error("Only PDF files are allowed.");
        e.target.value = null;
        return;
      }
      newFilesTotalSize += file.size;
    }

    if (currentTotalSize + newFilesTotalSize > MAX_TOTAL_SIZE) {
      toast.error("Total size of all PDFs should not exceed 1000 KB.");
      e.target.value = null;
      return;
    }

    onFileUpload(files);
    e.target.value = null;
  };

  const handleStackClick = () => {
    fileInputRef.current?.click();
  };

  /* ---------- EMPTY STATE ---------- */
  const renderEmptyState = () => (
    <Stack
      onClick={handleStackClick}
      justifyContent="center"
      alignItems="center"
      sx={{
        width: "336px",
        height: "132px",
        borderRadius: "16px",
        border: "1px dashed #535660",
        cursor: "pointer",
      }}
    >
      <img src={uploadImage} alt="upload" width={40} height={40} />
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        style={{ display: "none" }}
        multiple
        onChange={handleFileInputChange}
      />
      <Stack alignItems="center">
        <Typography
          variant="body1"
          sx={{ textDecoration: "underline", color: "#00FFFF !important" }}
        >
          Click to Upload
        </Typography>
        <Typography variant="body2" sx={{ color: "#6F727A !important" }}>
          Maximum total size 1000 KB
        </Typography>
      </Stack>
    </Stack>
  );

  /* ---------- FILE LIST ---------- */
  const renderFileStack = () => (
    <Stack direction="row" gap={1.5} alignItems="center">
      <Stack direction="row" spacing={1}>
        {walkthrough.map((file, index) => {
          const fileName =
            typeof file === "string"
              ? file.split("/").pop()
              : file.name;

          return (
            <Stack
              key={index}
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
                onClick={() => deleteFileHandler(index)}
              />

              <img src={pdfImage} alt="pdf" width={40} height={40} />

              <Typography variant="body2" sx={{ color: "#9C9EA3 !important" }}>
                {truncateString(fileName, 15)}
              </Typography>

              {typeof file === "object" && (
                <Typography
                  variant="body2"
                  sx={{
                    color: "#9C9EA3 !important",
                    fontSize: "10px !important",
                  }}
                >
                  Size - {formatFileSize(file.size)}
                </Typography>
              )}
            </Stack>
          );
        })}
      </Stack>

      {walkthrough.length < MAX_FILES && renderUploadMoreStack()}
    </Stack>
  );

  /* ---------- UPLOAD MORE ---------- */
  const renderUploadMoreStack = () => (
    <Stack
      onClick={handleStackClick}
      justifyContent="center"
      alignItems="center"
      gap={1}
      sx={{
        width: "132px",
        height: "132px",
        borderRadius: "16px",
        border: "1px dashed #535660",
        cursor: "pointer",
      }}
    >
      <img src={uploadImage} alt="upload" width={40} height={40} />
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        style={{ display: "none" }}
        multiple
        onChange={handleFileInputChange}
      />
      <Stack alignItems="center" gap={0.5}>
        <Typography
          variant="body1"
          sx={{ textDecoration: "underline", color: "#00FFFF !important" }}
        >
          Upload more
        </Typography>
        <Typography variant="body2" sx={{ color: "#6F727A !important" }}>
          Max total size 1000 KB
        </Typography>
      </Stack>
    </Stack>
  );

  return (
    <>
      {walkthrough.length === 0
        ? renderEmptyState()
        : renderFileStack()}
    </>
  );
};

export default ScenarioWalkthrough;
