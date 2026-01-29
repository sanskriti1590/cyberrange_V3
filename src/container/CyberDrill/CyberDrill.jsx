import React, { useEffect, useMemo, useState } from "react";
import { Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

import StepHeader from "./components/StepHeader";
import ScenarioSetupPanel from "./components/ScenarioSetupPanel";
import PhasePanel from "./components/PhasePanel";
import FlagMilestonePanel from "./components/FlagMilestonePanel";
import PreviewPanel from "./components/PreviewPanel";

import {
  getScenarioCategories,
  createScenario,
  createPhases, // keep commented until endpoint is correct
  createFlags,
  createMilestones,
} from "./api";

const DEFAULT_DRAFT = {
  scenario_name: "",
  scenario_category_id: "",
  scenario_assigned_severity: "Medium",
  scenario_description: "",
  scenario_tools_technologies: "",
  scenario_prerequisites: "",
  scenario_thumbnail: null,
  scenario_documents: [],

  scoring_type: "STANDARD", // STANDARD | DECAY

  scoring_decay: {
    mode: "time",              // time | attempt
    start_after_minutes: 15,
    penalty_per_interval: 10,
    interval_minutes: 10,
    min_score: 20,
  },

  mode: "FLAG",
  phases: [],
  items: [],
};

export default function CyberDrill() {
  const navigate = useNavigate();

  // 0 scenario, 1 phases, 2 flags/milestones, 3 preview
  const [step, setStep] = useState(0);

  const [draft, setDraft] = useState(DEFAULT_DRAFT);
  const [previewDraft, setPreviewDraft] = useState(null); // ✅ FIX
  const [categories, setCategories] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  

  useEffect(() => {
    (async () => {
      try {
        const res = await getScenarioCategories();
        setCategories(Array.isArray(res?.data) ? res.data : []);
      } catch {
        setCategories([]);
      }
    })();
  }, []);

  // Step2 -> Step3 (Preview)
  const handleItemsToPreview = (items) => {
    const nextDraft = {
      ...draft,
      items: Array.isArray(items) ? items : [],
    };
    setDraft(nextDraft);
    setPreviewDraft(nextDraft); // ✅ FIX
    setStep(3);
  };

  const handleFinalCreate = async () => {
    setSubmitting(true);
    try {
      const d = previewDraft || draft; // ✅ now exists

      const name = (d.scenario_name || "").trim();
      const categoryId = d.scenario_category_id;
      const severity = d.scenario_assigned_severity;
      const description = (d.scenario_description || "").trim();

      if (!name || !categoryId || !severity || !description) {
        alert("Please fill all required scenario fields");
        return;
      }
      if (description.length < 10) {
        alert("Description must be at least 10 characters.");
        return;
      }

      const objective = (d.scenario_tools_technologies || "").trim();
      const prerequisite = (d.scenario_prerequisites || "").trim();

      if (objective && objective.length < 10) {
        alert("Objective must be at least 10 characters (or leave it blank).");
        return;
      }
      if (prerequisite && prerequisite.length < 10) {
        alert("Prerequisite must be at least 10 characters (or leave it blank).");
        return;
      }

      // 1) create scenario
      const fd = new FormData();
      fd.append("name", name);
      fd.append("category_id", String(categoryId));
      fd.append("severity", String(severity));
      fd.append("description", description);
      fd.append("objective", objective);
      fd.append("prerequisite", prerequisite);
      fd.append("type", d.mode);
      fd.append("scoring_type", d.scoring_type.toLowerCase());


      // only send decay config if selected
      if (d.scoring_type === "DECAY") {
        fd.append("scoring_decay_mode", d.scoring_decay.mode);
        fd.append("scoring_decay_start_after_minutes", String(d.scoring_decay.start_after_minutes));
        fd.append("scoring_decay_penalty_per_interval", String(d.scoring_decay.penalty_per_interval));
        fd.append("scoring_decay_interval_minutes", String(d.scoring_decay.interval_minutes));
        fd.append("scoring_decay_min_score", String(d.scoring_decay.min_score));
      }

      if (d.scenario_thumbnail instanceof File) {
        fd.append("thumbnail", d.scenario_thumbnail);
      }

      (d.scenario_documents || [])
        .filter((f) => f instanceof File)
        .forEach((file, idx) => {
          fd.append(`red_team_files[${idx}]`, file);
        });

      const res = await createScenario(fd);
      const scenarioId = res?.data?.id;
      if (!scenarioId) throw new Error("scenario_id not returned from backend");

      if (Array.isArray(d.phases) && d.phases.length) {
        await createPhases(scenarioId, d.phases);
      }

      // 3) flags or milestones
      const items = Array.isArray(d.items) ? d.items : [];
      if (items.length) {
        if (d.mode === "FLAG") await createFlags(scenarioId, items);
        else await createMilestones(scenarioId, items);
      }

      // 4) infra
      navigate(`/infra/${scenarioId}`);
    } catch (err) {
      console.error(err?.response?.data || err?.message);
      alert(err?.response?.data ? JSON.stringify(err.response.data, null, 2) : "Failed");
    } finally {
      setSubmitting(false);
    }
  };

  const activeStepIndex = useMemo(() => step, [step]);

  return (
    <Stack sx={{ p: 3 }}>
      <StepHeader activeIndex={activeStepIndex} />

      {step === 0 && (
        <ScenarioSetupPanel
          draft={draft}
          setDraft={setDraft}
          categories={categories}
          onNext={() => setStep(1)}
        />
      )}

      {step === 1 && (
        <PhasePanel
          draft={draft}
          setDraft={setDraft}
          onBack={() => setStep(0)}
          onNext={() => setStep(2)}
        />
      )}

      {step === 2 && (
        <FlagMilestonePanel
          draft={draft}
          setDraft={setDraft}
          submitting={submitting}
          onBack={() => setStep(1)}
          onNext={handleItemsToPreview} 
        />
      )}

      {step === 3 && (
        <PreviewPanel
          draft={previewDraft || draft}
          categories={categories}
          submitting={submitting}
          onBack={() => setStep(2)}
          onConfirmCreate={handleFinalCreate}
        />
      )}
    </Stack>
  );
}
