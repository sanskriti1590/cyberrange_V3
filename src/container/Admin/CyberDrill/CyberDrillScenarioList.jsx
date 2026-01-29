import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Stack,
  Typography,
  Chip,
  TextField,
  CircularProgress,
  Button,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { getScenarioCategories } from "../../../APIConfig/adminConfig";
import { getCategoryCorporate } from "../../../APIConfig/version2Scenario";
import { getScenarioDetail } from "../../../APIConfig/version2Scenario";

const BORDER = "#1e293b";

export default function CyberDrillScenarioList() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  /* ================= LOAD CATEGORIES ================= */
  useEffect(() => {
    (async () => {
      try {
        const res = await getScenarioCategories();
        const cats = Array.isArray(res?.data) ? res.data : [];
        setCategories(cats);
        if (cats.length) {
          setActiveCategory(cats[0].scenario_category_id);
        }
      } catch {
        toast.error("Failed to load scenario categories");
      }
    })();
  }, []);

  /* ================= LOAD SCENARIOS ================= */
  useEffect(() => {
    if (!activeCategory) return;

    (async () => {
      setLoading(true);
      try {
        const res = await getCategoryCorporate(activeCategory);
        setScenarios(Array.isArray(res?.data) ? res.data : []);
      } catch {
        toast.error("Failed to load CyberDrill scenarios");
        setScenarios([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [activeCategory]);

  /* ================= SEARCH ================= */
  const filtered = useMemo(() => {
    if (!search) return scenarios;
    const q = search.toLowerCase();
    return scenarios.filter(
      (s) =>
        s.name?.toLowerCase().includes(q) ||
        s.creator_name?.toLowerCase().includes(q)
    );
  }, [search, scenarios]);

  return (
    <Box sx={{ display: "flex", height: "100%", p: 3 }}>
      {/* LEFT CATEGORY BAR */}
      <Box sx={{ width: 220, pr: 3 }}>
        <Typography sx={{ mb: 2, fontWeight: 700 }}>
          All Categories
        </Typography>

        <Stack spacing={1}>
          {categories.map((c) => (
            <Typography
              key={c.scenario_category_id}
              onClick={() =>
                setActiveCategory(c.scenario_category_id)
              }
              sx={{
                cursor: "pointer",
                fontSize: 14,
                color:
                  activeCategory === c.scenario_category_id
                    ? "#22d3ee"
                    : "#94a3b8",
                borderBottom:
                  activeCategory === c.scenario_category_id
                    ? "1px solid #22d3ee"
                    : "1px solid transparent",
                pb: 0.5,
              }}
            >
              {c.scenario_category_name}
            </Typography>
          ))}
        </Stack>
      </Box>

      {/* RIGHT CONTENT */}
      <Box sx={{ flex: 1 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h5" fontWeight={800}>
            CyberDrill Scenarios
          </Typography>

          <TextField
            size="small"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ mr: 1, color: "#94a3b8" }} />
              ),
            }}
            sx={{ width: 260 }}
          />
        </Stack>

        <Divider sx={{ mb: 2, borderColor: BORDER }} />

        {loading && (
          <Box sx={{ textAlign: "center", py: 6 }}>
            <CircularProgress />
          </Box>
        )}

        <Stack spacing={2}>
          {!loading &&
            filtered.map((s) => (
              <Box
                key={s.id}
                sx={{
                  display: "flex",
                  gap: 2,
                  p: 2,
                  borderRadius: 2,
                  border: `1px solid ${BORDER}`,
                  background:
                    "linear-gradient(180deg, rgba(15,23,42,0.9), rgba(2,6,23,0.95))",
                  alignItems: "center",
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography fontWeight={700}>
                    {s.name}
                  </Typography>

                  <Stack direction="row" spacing={1} mt={0.5}>
                    <Chip size="small" label={s.severity} />
                    <Chip
                      size="small"
                      label={`${s.points || 0} pts`}
                      color="info"
                    />
                    <Chip
                      size="small"
                      label={s.type}
                      color="secondary"
                    />
                  </Stack>

                  <Typography
                    sx={{
                      fontSize: 12,
                      color: "#94a3b8",
                      mt: 0.5,
                    }}
                  >
                    Created by {s.creator_name || "—"}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={() =>
                    navigate(`/admin/cyberdrill/${s.id}/edit`)
                  }
                >
                  Edit
                </Button>
              </Box>
            ))}

          {!loading && !filtered.length && (
            <Typography sx={{ color: "#94a3b8", mt: 3 }}>
              No CyberDrill scenarios found.
            </Typography>
          )}
        </Stack>
      </Box>
    </Box>
  );
}
