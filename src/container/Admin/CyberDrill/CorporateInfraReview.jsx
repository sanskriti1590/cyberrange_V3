import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Chip,
  Divider,
  Stack,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import SecurityIcon from "@mui/icons-material/Security";
import SaveIcon from "@mui/icons-material/Save";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { toast } from "react-toastify";

import {
  getCorporateInfraForReview,
  saveCorporateInfraReview,
  approvedCorporateRequestsFromDB,
} from "../../../APIConfig/adminConfig";

export default function CorporateInfraReview() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [infraText, setInfraText] = useState("");
  const [reviewDone, setReviewDone] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInfra = async () => {
      try {
        const res = await getCorporateInfraForReview(id);
        const data = res?.data;

        const infra =
          data?.infra_reviewed ?? data?.infra_original ?? {};

        setInfraText(JSON.stringify(infra, null, 2));
        setReviewDone(Boolean(data?.review_done));
      } catch (err) {
        toast.error("Failed to load infra for review");
      } finally {
        setLoading(false);
      }
    };
    loadInfra();
  }, [id]);

  const handleSaveReview = async () => {
    try {
      const parsed = JSON.parse(infraText);
      await saveCorporateInfraReview({
        corporate_id: id,
        reviewed_infra: parsed,
      });
      setReviewDone(true);
      toast.success("Infra review saved");
    } catch (err) {
      toast.error("Invalid JSON or save failed");
    }
  };

  const handleApprove = async () => {
    try {
      await approvedCorporateRequestsFromDB({ corporate_id: id });
      toast.success("Corporate approved successfully");
      navigate("/admin/corporateRequests");
    } catch (err) {
      toast.error(
        err?.response?.data?.detail ||
          "Please save infra review before approving"
      );
    }
  };

  if (loading) {
    return <Typography sx={{ p: 4 }}>Loading infra…</Typography>;
  }

  return (
    <Stack spacing={3} sx={{ p: 4 }}>
      {/* HEADER */}
      <Stack direction="row" justifyContent="space-between">
        <Stack>
          <Typography variant="h2">Infra Security Review</Typography>
          <Typography color="text.secondary">
            Review and approve corporate network topology
          </Typography>
        </Stack>

        <Chip
          icon={<SecurityIcon />}
          label={reviewDone ? "Reviewed" : "Pending Review"}
          color={reviewDone ? "success" : "warning"}
          variant="outlined"
        />
      </Stack>

      <Divider />

      {/* JSON EDITOR */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          background: "linear-gradient(135deg, #0f172a, #020617)",
          border: "1px solid #1e293b",
        }}
      >
        <Typography variant="h4" mb={1}>
          Network Topology (JSON)
        </Typography>

        <TextField
          fullWidth
          multiline
          minRows={18}
          value={infraText}
          onChange={(e) => setInfraText(e.target.value)}
          sx={{
            fontFamily: "monospace",
            "& textarea": { fontSize: "14px" },
          }}
        />
      </Paper>

      {/* ACTIONS */}
      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSaveReview}
        >
          Save Review
        </Button>

        <Button
          variant="contained"
          color="success"
          startIcon={<CheckCircleIcon />}
          disabled={!reviewDone}
          onClick={handleApprove}
        >
          Approve
        </Button>

        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/admin/corporateRequests")}
        >
          Back
        </Button>
      </Stack>

      {!reviewDone && (
        <Typography color="warning.main">
          ⚠️ Please save the infra review before approving
        </Typography>
      )}
    </Stack>
  );
}
