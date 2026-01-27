import { Stack, Typography, Button } from "@mui/material";

export default function TeamWalkthroughUpload({ team, file, onUpload }) {
  return (
    <Stack
      spacing={2}
      sx={{
        border: "1px dashed #2e7d32",
        borderRadius: 2,
        p: 3,
      }}
    >
      <Typography variant="h6" color="#69f0ae">
        {team.toUpperCase()} Team Walkthrough
      </Typography>

      <Button component="label" variant="outlined">
        {file ? "Replace Walkthrough" : "Upload Walkthrough"}
        <input
          hidden
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => onUpload(e.target.files[0])}
        />
      </Button>

      {file && (
        <Typography variant="caption" color="success.main">
          {file.name}
        </Typography>
      )}
    </Stack>
  );
}
