import React, { useEffect, useState } from "react";
import { Stack } from "@mui/material";
import CreateCorporate from "../CorporateScenarioCreation/CreateCorporate";
import ScenarioFlags from "./ScenarioFlags";
import { createScenario } from "../../APIConfig/version2Scenario";
import MileStone from "./Milestone";
import ErrorHandler from "../../ErrorHandler";

const initialFlag = [
  {
    title: "Blue Team Flags",
    walkthrough: [],
    active: true,
    color: "#7A5AF8",
    questionInformation: [
      {
        question: "",
        answer: "",
        hint: "",
        score: 1,
        index: 0
      }
    ]
  },
  {
    title: "Red Team Flags",
    walkthrough: [],
    active: false,
    color: "#CC2E28",
    questionInformation: [
      {
        question: "",
        answer: "",
        hint: "",
        score: 1,
        index: 0
      }
    ]
  },
  {
    title: "Purple Team Flags",
    walkthrough: [],
    active: false,
    color: "#9747FF",
    questionInformation: [
      {
        question: "",
        answer: "",
        hint: "",
        score: 1,
        index: 0
      }
    ]
  },
  {
    title: "Yellow Team Flags",
    walkthrough: [],
    active: false,
    color: "#F79D28",
    questionInformation: [
      {
        question: "",
        answer: "",
        hint: "",
        score: 1,
        index: 0
      }
    ]
  }
]

const getFreshFlagState = () => (
  initialFlag.map(team => ({
    ...team,
    walkthrough: [],
    questionInformation: team.questionInformation
      ? team.questionInformation.map(question => ({ ...question }))
      : [{
        question: "",
        answer: "",
        hint: "",
        score: 1,
        index: 0
      }]
  }))
);

const getFreshMileState = () => ({
  red_team: [],
  blue_team: [],
  yellow_team: [],
  purple_team: [],
});

const ScenarioCreation = () => {
  const [toggle, setToggle] = useState(0);
  const [form, setForm] = useState({});
  const [flag, setFlag] = useState(getFreshFlagState());
  const [mile, setMile] = useState(getFreshMileState());
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState([]);
  const [inputs, setInputs] = useState({
    scenario_name: "",
    scenario_category_id: "",
    scenario_assigned_severity: "",
    scenario_score: "",
    scenario_time: "",
    scenario_description: "",
    scenario_members_requirement: "",
    type: "",
  });
  const [multipleFile, setMutipleFile] = React.useState([]);
  const [text, setText] = useState("");
  const [toolsAndTechnologies, setToolsAndTechnologies] = useState("");
  const [prerequisites, setPrerequisites] = useState("");
  const [file, setFile] = useState({ pdf: "", jpeg: "" });
  const [selectedValue, setSelectedValue] = useState(0);

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('scenarioCreationData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);

        // console.log('Parsed data from localStorage:', parsedData);

        // Restore all states from localStorage
        if (parsedData.inputs) {
          setInputs(parsedData.inputs);
          // console.log('Restored inputs:', parsedData.inputs);
        }
        if (parsedData.toggle !== undefined) setToggle(parsedData.toggle);
        if (parsedData.form) setForm(parsedData.form);

        // Handle flag data properly - it should be the team data array
        if (parsedData.flag) {
          // If flag has flagData property, use that, otherwise use flag directly
          const flagData = parsedData.flag.flagData || parsedData.flag;
          if (flagData && Array.isArray(flagData)) {
            setFlag(flagData);
            // console.log('Restored flag data:', flagData);
          }
        }

        if (parsedData.mile) setMile(parsedData.mile);
        if (parsedData.text) setText(parsedData.text);
        if (parsedData.toolsAndTechnologies) setToolsAndTechnologies(parsedData.toolsAndTechnologies);
        if (parsedData.prerequisites) setPrerequisites(parsedData.prerequisites);
        if (parsedData.selectedValue !== undefined) {
          setSelectedValue(parsedData.selectedValue);
          // console.log(' Restored selectedValue:', parsedData.selectedValue);
        }
        if (parsedData.image) setImage(parsedData.image);
        if (parsedData.file) setFile(parsedData.file);

        // console.log('Loaded saved data from localStorage');
      } catch (error) {
        console.error('Error parsing saved data:', error);
      }
    }
  }, []);

  // Sync form.inputs with main inputs state
  useEffect(() => {
    if (Object.keys(inputs).length > 0 && inputs.scenario_name) {
      setForm(prevForm => ({
        ...prevForm,
        inputs: inputs
      }));
    }
  }, [inputs]);

  // Save data to localStorage whenever relevant states change
  useEffect(() => {
    const dataToSave = {
      toggle,
      form,
      // Clean flag data to remove PDF walkthroughs before saving
      flag: flag && Array.isArray(flag)
        ? flag.map(team => ({
          ...team,
          walkthrough: [] // Clear PDFs here before saving to localStorage
        }))
        : flag,
      mile,
      inputs,
      text,
      // type,
      toolsAndTechnologies,
      prerequisites,
      selectedValue,
      image,
      file,
      lastSaved: new Date().toISOString()
    };

    // console.log('Saving to localStorage - flag data (PDFs cleared):', dataToSave.flag);

    localStorage.setItem('scenarioCreationData', JSON.stringify(dataToSave));
  }, [toggle, form, flag, mile, inputs, text, toolsAndTechnologies, prerequisites, selectedValue, image, file]);

  // Enhanced setToggle that also saves step progress
  const handleSetToggle = (newToggle) => {
    setToggle(newToggle);
  };

  // Enhanced setForm that ensures data is saved and syncs with inputs
  // Enhanced setForm that ensures data is saved and syncs with inputs
  // 🧠 Accept FormData from Formik and store as plain object
  const handleSetForm = (newForm) => {
    if (!(newForm instanceof FormData)) return;

    const plainForm = {};
    newForm.forEach((value, key) => {
      // If multiple files for same key, accumulate in array
      if (plainForm[key]) {
        if (Array.isArray(plainForm[key])) plainForm[key].push(value);
        else plainForm[key] = [plainForm[key], value];
      } else {
        plainForm[key] = value;
      }
    });

    setForm(plainForm);

    // Optional: keep in localStorage for restore
    // localStorage.setItem("scenarioFormData", JSON.stringify(plainForm));


    // Update toggle type
    setInputs((prev) => ({
      ...prev,
      type: plainForm.type,
    }));
  };

  // Enhanced setFlag that ensures data is saved - should receive team data array
  const handleSetFlag = (flagData) => {
    // console.log('Setting flag data in parent:', flagData);
    // If flagData has flagData property, extract it, otherwise use it directly
    const teamData = flagData.flagData || flagData;
    setFlag(teamData);
  };

  // Enhanced setImage that ensures data is saved
  const handleSetImage = (newImage) => {
    setImage(newImage);
  };

  // Enhanced setFile that ensures data is saved
  const handleSetFile = (newFile) => {
    setFile(newFile);
  };

  // Enhanced setInputs that ensures data is saved and syncs with form
  const handleSetInputs = (newInputs) => {
    setInputs(newInputs);
    setForm(prevForm => ({
      ...prevForm,
      inputs: newInputs
    }));
  };

  // Enhanced setSelectedValue that ensures data is saved and updates type in inputs
  const handleSetSelectedValue = (newValue) => {
    setSelectedValue(newValue);
    const scenarioType = newValue != 1 ? "FLAG" : "MILESTONE";
    setInputs(prevInputs => ({
      ...prevInputs,
      type: scenarioType
    }));
  };

  // Enhanced setMile that ensures data is saved
  const handleSetMileData = (redTeam, blueTeam, yellowTeam, purpleTeam) => {
    const newMile = {
      red_team: redTeam,
      blue_team: blueTeam,
      yellow_team: yellowTeam,
      purple_team: purpleTeam,
    };
    setMile(newMile);
  };

  // Clear all saved data (useful when scenario is successfully created)
  const clearSavedData = () => {
    localStorage.removeItem('scenarioCreationData');
    localStorage.removeItem('scenarioCurrentStep');
    // console.log('Cleared all saved scenario data');
  };


  const handleClear = (formik, setPreviewImage) => {
    formik.resetForm();
    setFlag(getFreshFlagState())
    setMile(getFreshMileState())
    localStorage.removeItem("createScenarioForm");
    localStorage.removeItem("scenarioThumbnail");
    localStorage.removeItem("scenarioDocuments");
    localStorage.removeItem("milestoneFormDraft_v1");

    // Completely wipe flag & milestone data
    const saved = localStorage.getItem("scenarioCreationData");
    if (saved) {
      const parsed = JSON.parse(saved);
      parsed.toggle = 0;
      parsed.flag = getFreshFlagState();
      parsed.mile = getFreshMileState();
      localStorage.setItem("scenarioCreationData", JSON.stringify(parsed));
    }

    setPreviewImage(null);
  };


  // 🚀 Build FormData properly for API submission
  const handleApi = async (
    milestoneObj,
    blueWalkthrough,
    redWalkthrough,
    purpleWalkthrough,
    yellowWalkthrough
  ) => {
    try {
      const modifiedFormData = new FormData();

      // 🧩 Map fields to backend naming
      modifiedFormData.append("name", form?.scenario_name || "");
      modifiedFormData.append("category_id", form?.scenario_category_id || "");
      modifiedFormData.append("severity", form?.scenario_assigned_severity || "");
      modifiedFormData.append("description", form?.scenario_description || "");
      modifiedFormData.append("objective", form?.scenario_tools_and_technologies || "");
      modifiedFormData.append("prerequisite", form?.scenario_prerequisites || "");
      modifiedFormData.append("thumbnail", form?.scenario_thumbnail || "");
      // modifiedFormData.append("type", form?.type || "");

      if (form?.type === '1') {
        modifiedFormData.append("type", "MILESTONE")
      } else modifiedFormData.append("type", "FLAG")

      // 🧠 Documents (PDFs)
      if (Array.isArray(form?.["scenario_documents[]"])) {
        form["scenario_documents[]"].forEach((doc) =>
          modifiedFormData.append("walkthrough_files", doc)
        );
      }

      // 🧱 Add milestone/flag data
      if (form?.type === "2") {
        modifiedFormData.append("flag_data", milestoneObj);
      } else {
        modifiedFormData.append("milestone_data", milestoneObj);
      }

      // 🧩 Walkthrough files by team
      const walkthroughSets = {
        red_team_files: redWalkthrough,
        blue_team_files: blueWalkthrough,
        yellow_team_files: yellowWalkthrough,
        purple_team_files: purpleWalkthrough,
      };
      Object.entries(walkthroughSets).forEach(([key, files]) => {
        if (files?.length) files.forEach((file) => modifiedFormData.append(key, file));
      });

      console.log(
        "📦 Final FormData sent to backend:",
        Array.from(modifiedFormData.entries())
      );

      const response = await createScenario(modifiedFormData);

      if (response?.data?.id) {
        clearSavedData();
      }

      return response;
    } catch (error) {
      console.error("❌ API call failed:", error);
      ErrorHandler(error);
    }
  };

  function logFormData(formData) {
    formData.forEach(function (value, key) {
    });
  }

  const components = {
    0: (
      <CreateCorporate
        setToggle={handleSetToggle}
        setForm={handleSetForm}
        image={image}
        setImage={handleSetImage}
        category={category}
        setCategory={setCategory}
        inputs={inputs}
        setInputs={handleSetInputs}
        selectedValue={selectedValue}
        setSelectedValue={handleSetSelectedValue}
        multipleFile={multipleFile}
        setMutipleFile={setMutipleFile}
        text={text}
        setText={setText}
        toolsAndTechnologies={toolsAndTechnologies}
        setToolsAndTechnologies={setToolsAndTechnologies}
        prerequisites={prerequisites}
        setPrerequisites={setPrerequisites}
        file={file}
        setFile={handleSetFile}
        toggle={toggle}
        handleClear={handleClear}
      />
    ),
    1: (
      <MileStone
        setToggle={handleSetToggle}
        setMileData={handleSetMileData}
        handleApi={handleApi}
        mile={mile}
      />
    ),
    2: (
      <ScenarioFlags
        setToggle={handleSetToggle}
        setFlag={handleSetFlag}
        handleApi={handleApi}
        initialData={flag} // Pass the flag data as initialData prop
      />
    ),
  };

  return <Stack>{components[toggle]}</Stack>;
};

export default ScenarioCreation;