import React, { useEffect, useState } from "react";
import { Stack, CircularProgress } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import StepHeader from "../../../CyberDrill/components/StepHeader";
import ScenarioSetupPanel from "../../../CyberDrill/components/ScenarioSetupPanel";
import PhasePanel from "../../../CyberDrill/components/PhasePanel";
import FlagMilestonePanel from "../../../CyberDrill/components/FlagMilestonePanel";
import PreviewPanel from "../../../CyberDrill/components/PreviewPanel";
import { toast } from "react-toastify";


import {
  updateCorporateScenarioBasic,
  updateCorporateScenarioPhases,
  updateCorporateScenarioFlags,
  updateCorporateScenarioMilestones,
  getScenarioCategories
} from "../../../../APIConfig/adminConfig";
import { getCorporateScenarioDetail } from "../../../../APIConfig/version2Scenario";


export default function CyberDrillUpdate() {
  const { scenarioId } = useParams(); // ✅ corporate_scenario.id ONLY
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState(null);
  const [previewDraft, setPreviewDraft] = useState(null);
  const [categories, setCategories] = useState([]);

useEffect(() => {
  getScenarioCategories().then(res => {
    setCategories(res.data || []);
  });
}, []);

  useEffect(() => {
    (async () => {
      const res = await getCorporateScenarioDetail(scenarioId);
      const s = res.data;

      setDraft({
        scenario_name: s.name,
        scenario_category_id: s.category_id,
        scenario_assigned_severity: s.severity,
        scenario_description: s.description,
        scenario_tools_technologies: s.objective,
        scenario_prerequisites: s.prerequisite,
        scenario_thumbnail: null,
        scenario_documents: [],

        scoring_type: s.scoring_config?.type?.toUpperCase() || "STANDARD",
        scoring_decay: s.scoring_config?.decay || {},

        mode: s.type,
        phases: s.phases || [],
         items: s.items || [],
      });

      setLoading(false);
    })();
  }, [scenarioId]);

  if (loading || !draft) return <CircularProgress sx={{ m: 4 }} />;

  return (
    <Stack sx={{ p: 3 }}>
      <StepHeader activeIndex={step} isEdit />

      {step === 0 && (
        <ScenarioSetupPanel
          draft={draft}
          setDraft={setDraft}
          categories={categories}  
          onNext={() => setStep(1)}
          isEdit
        />
      )}

      {step === 1 && (
        <PhasePanel
          draft={draft}
          setDraft={setDraft}
          onBack={() => setStep(0)}
          onNext={() => setStep(2)}
          isEdit
        />
      )}

      {step === 2 && (
        <FlagMilestonePanel
          draft={draft}
          setDraft={setDraft}
          onBack={() => setStep(1)}
          onNext={(items) => {
            setPreviewDraft({ ...draft, items });
            setStep(3);
          }}
          isEdit
        />
      )}

      {step === 3 && (
        <PreviewPanel
          draft={previewDraft || draft}
          onBack={() => setStep(2)}
            // 1️⃣ Update basic scenario
        onConfirmCreate={async () => {
        try {
            await updateCorporateScenarioBasic(
            scenarioId,
            {
                ...draft,
                scoring_type: draft.scoring_type?.toLowerCase(),
            }
            );

            await updateCorporateScenarioPhases(scenarioId, draft.phases);

            if (draft.mode === "FLAG") {
            await updateCorporateScenarioFlags(
                scenarioId,
                previewDraft.items
            );
            } else {
            await updateCorporateScenarioMilestones(
                scenarioId,
                previewDraft.items
            );
            }

            // ✅ SUCCESS TOAST
            toast.success("CyberDrill scenario updated successfully");

            // ✅ redirect after toast
            navigate("/admin/corporateRequests");

        } catch (err) {
            console.error(err?.response?.data || err);
            toast.error(
            err?.response?.data?.message ||
            "Failed to update CyberDrill scenario"
            );
        }
        }}
          isEdit
        />
      )}
    </Stack>
  );
}
