import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
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
  const [infraObj, setInfraObj] = useState(null);
  const [reviewDone, setReviewDone] = useState(false);
  const [loading, setLoading] = useState(true);

  /* ---------------- SOURCE OF TRUTH ---------------- */
  const computeReviewDone = (infra) => {
    if (!infra) return false;
    return (
      infra.status === "REVIEWED" ||
      infra.review?.review_done === true
    );
  };

  const loadInfra = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getCorporateInfraForReview(id);
      const data = res?.data || {};

      // backend may return: { infra } OR legacy keys
      const infra =
        data.infra ??
        data.infra_reviewed ??
        data.infra_original ??
        {};

      setInfraObj(infra);
      setInfraText(JSON.stringify(infra, null, 2));

      // 🔥 ONLY PLACE reviewDone IS SET
      setReviewDone(computeReviewDone(infra));
    } catch (err) {
      console.error("loadInfra error:", err);
      toast.error("Failed to load infra for review");
      setInfraObj(null);
      setInfraText("{}");
      setReviewDone(false);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadInfra();
  }, [loadInfra]);

  /* ---------------- SAVE REVIEW ---------------- */
  const handleSaveReview = async () => {
    try {
      const parsed = JSON.parse(infraText);

      await saveCorporateInfraReview({
        corporate_id: id,
        reviewed_infra: parsed,
      });

      toast.success("Infra review saved");

      // 🔥 CRITICAL: reload from backend
      await loadInfra();
    } catch (err) {
      console.error("save review error:", err);
      toast.error("Invalid JSON or save failed");
    }
  };

  /* ---------------- APPROVE ---------------- */
  const handleApprove = async () => {
    try {
      await approvedCorporateRequestsFromDB({ corporate_id: id });
      toast.success("Corporate approved successfully");
      navigate("/admin/corporateRequests");
    } catch (err) {
      const msg =
        err?.response?.data?.errors?.non_field_errors?.[0] ||
        err?.response?.data?.detail ||
        "Please review infra before approving";
      toast.error(msg);

      // optional: re-sync state
      await loadInfra();
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
