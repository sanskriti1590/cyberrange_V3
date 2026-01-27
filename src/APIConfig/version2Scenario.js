import AxiosNoToken from "../Axios/axiosNoToken";
import APIVERSION2 from "../Axios/version2";
import ErrorHandler from "../ErrorHandler";
import ApiConfig from "./ApiConfig";
import ApiVersion2 from "./version2Api";
import jwtDecode from "jwt-decode";
const token = localStorage.getItem("access_token");

export const createScenario = async (modifiedFormData) => {
  const token = localStorage.getItem("access_token");
  try {
    return await APIVERSION2.post(
      `${ApiVersion2.scenario.detail}`,
      modifiedFormData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    ErrorHandler(error);
  }
};

export const createInfraVersion2 = async (scenarioId, dataValue) => {
  const token = localStorage.getItem("access_token");
  return await APIVERSION2.post(
    `${ApiVersion2.scenario.submitInfra}?scenario_id=${scenarioId}`,
    { scenario_infra: dataValue },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const scenarioList = async () => {
  const token = localStorage.getItem("access_token");
  //live-game
  return await APIVERSION2.get(`${ApiVersion2.scenario.scenarioList}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

//scenario walkthrough
export const getScenarioWalkthroughs = async ({
  scenario_id,
  team,
  phase_ids,
}) => {
  const token = localStorage.getItem("access_token");

  return await APIVERSION2.get(
    `${ApiVersion2.scenario.walkthroughList}`,
    {
      params: {
        scenario_id,
        team,
        phase_ids, // axios sends as ?phase_ids=a&phase_ids=b
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// scenario details
export const scenarioDetailsVersion2 = async (id) => {
  const token = localStorage.getItem("access_token");
  return await APIVERSION2.get(
    `${ApiVersion2.scenario.scenarioDetials}${id}/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const getCorporateScenarioInfra = async (infraId) => {
  const token = localStorage.getItem("access_token");

  return await APIVERSION2.get(
    `${ApiVersion2.scenario.corporateScenarioInfra}${infraId}/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
// Scenario Phases (Kill Chain)
// ===============================
export const scenarioPhasesVersion2 = async (scenarioId) => {
  const token = localStorage.getItem("access_token");

  return await APIVERSION2.post(
    ApiVersion2.scenario.phases,
    {
      scenario_id: scenarioId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};


//Achievers winning wall corporate
export const getWinningWallDataCorporate = async (id) => {
  return await AxiosNoToken.get(
    `${ApiVersion2.scenario.achievers}${id}/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// start game api
export const scenarioStartGameVersion2 = async (payload) => {
  const token = localStorage.getItem("access_token");

  return await APIVERSION2.post(
    ApiVersion2.scenario.scenarioStart,
    payload,   
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};


export const getConsoleId = async (scenarioId, id) => {
  return await APIVERSION2.post(
    `${ApiVersion2.scenario.getConsole}?scenario_id=${scenarioId}&participant_id=${id}`
  );
};

// active game
// scenario details
export const activeGameVersion2 = async () => {
  const token = localStorage.getItem("access_token");
  const user = token && jwtDecode(token);
  return await APIVERSION2.get(`${ApiVersion2.scenario.activegame}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// get console details
// scenario details for players
export const getConsoleVersion2 = async (id) => {
  const token = localStorage.getItem("access_token");
  const user = token && jwtDecode(token);
  return await APIVERSION2.get(`${ApiVersion2.scenario.getconsole}${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// scenario details for white team of players
export const getConsoleForWhiteVersion2 = async (scenairoId, userId) => {
  const token = localStorage.getItem("access_token");
  return await APIVERSION2.post(
    `${ApiVersion2.scenario.white_team_player_other}`,
    {
      active_scenario_id: scenairoId,
      participant_id: userId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};


export const milestoneSubmitVersion2 = async (
  scenario_id,
  milestone_id,
  selectedFile
) => {
  const token = localStorage.getItem("access_token");
  console.warn("File is here", selectedFile);

  const formData = new FormData();
  formData.append("active_scenario_id", scenario_id);
  formData.append("milestone_id", milestone_id);
  formData.append("screenshot_url", selectedFile);

  return await APIVERSION2.post(
    `${ApiVersion2.scenario.submitmilestone}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

// /white team active game

export const whiteTeamVersion2 = async () => {
  const token = localStorage.getItem("access_token");
  const user = token && jwtDecode(token);

  return await APIVERSION2.get(`${ApiVersion2.scenario.whiteTeam}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// console team
// participant machine switch
export const switchMachineVersion2 = async (payload) => {
  // payload: { active_scenario_id, instance_id }
  const token = localStorage.getItem("access_token");
  return await APIVERSION2.post(ApiVersion2.scenario.switchMachine, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ✅ NEW: admin flag lock/unlock
export const toggleFlagLockAdminV2 = async (payload) => {
  // payload: { active_scenario_id, participant_id, flag_id, locked: true/false }
  const token = localStorage.getItem("access_token");
  return await APIVERSION2.post(ApiVersion2.scenario.toggleFlagLockAdmin, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ✅ NEW: admin milestone lock/unlock
export const toggleMilestoneLockAdminV2 = async (payload) => {
  // payload: { active_scenario_id, participant_id, milestone_id, locked: true/false }
  const token = localStorage.getItem("access_token");
  return await APIVERSION2.post(ApiVersion2.scenario.toggleMilestoneLockAdmin, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ✅ NEW: admin phase lock/unlock
export const togglePhaseLockAdminV2 = async (payload) => {
  // payload: { active_scenario_id, participant_id, phase_id, locked: true/false }
  const token = localStorage.getItem("access_token");
  return await APIVERSION2.post(ApiVersion2.scenario.togglePhaseLockAdmin, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// scenario details
export const getConsoleTeamVersion2 = async () => {
  const token = localStorage.getItem("access_token");
  const user = token && jwtDecode(token);
  return await APIVERSION2.get(`${ApiVersion2.scenario.console_team}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// approved milestone
export const milestoneApprovedVersion2 = async (
  scenario_id,
  milestone_id,
  userId
) => {
  const token = localStorage.getItem("access_token");
  const user = token && jwtDecode(token);
  return await APIVERSION2.post(
    `${ApiVersion2.scenario.approved}`,
    {
      active_scenario_id: scenario_id,
      milestone_id: milestone_id,
      participant_id: userId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// un-approved milestone
export const milestoneUnApprovedVersion2 = async (
  scenario_id,
  milestone_id,
  userId
) => {
  const token = localStorage.getItem("access_token");
  const user = token && jwtDecode(token);
  return await APIVERSION2.post(
    `${ApiVersion2.scenario.unApproved}`,
    {
      active_scenario_id: scenario_id,
      milestone_id: milestone_id,
      participant_id: userId,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// flag submit
export const flagSubmitApi = async (modifiedFormData) => {
  const token = localStorage.getItem("access_token");

  const res = await APIVERSION2.post(
    `${ApiVersion2.scenario.flag}`,
    modifiedFormData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data; 
};

//hint
export const milestoneHintVersion2 = async (scenario_id, id, scenario_type) => {
  const token = localStorage.getItem("access_token");

  if (scenario_type === "FLAG") {
    return await APIVERSION2.post(
      `${ApiVersion2.scenario.hint}`,
      {
        active_scenario_id: scenario_id,
        flag_id: id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } else {
    return await APIVERSION2.post(
      `${ApiVersion2.scenario.hint}`,
      {
        active_scenario_id: scenario_id,
        milestone_id: id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
};

// end game api delete
export const endGameV2 = async (id) => {
  const token = localStorage.getItem("access_token");
  //end-game
  return await APIVERSION2.get(`${ApiVersion2.scenario.endGame}${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// get report data list
export const getReportList = async (userId) => {
  const token = localStorage.getItem("access_token");
  return await APIVERSION2.get(
    `${ApiVersion2.scenario.getReportList}${userId}/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// download Report
export const downloadReport = async (activeScenarioId, userId) => {
  const token = localStorage.getItem("access_token");
  return await APIVERSION2.get(
    `${ApiVersion2.scenario.downloadReport}${activeScenarioId}/${userId}/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// getCategoryCorporate

export const getCategoryCorporate = async (categoryId) => {
  const token = localStorage.getItem("access_token");
  return await AxiosNoToken.get(
    `${ApiVersion2.scenario.getCategoryCorporate}${categoryId}/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const liveScoreList = async (group) => {
  const token = localStorage.getItem("access_token");
  //live-game
  return await APIVERSION2.get(`${ApiVersion2.scenario.liveScore}${group}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

//winning wall for corporate
export const getCorporateWinningWall = async (id) => {
  return await APIVERSION2.get(`${ApiVersion2.scenario.scenarioWinningWall}`);
};

//winning wall for webscenario
export const getWebScenarioWinningWall = async (id) => {
  return await APIVERSION2.get(`${ApiConfig?.webScenario?.webscenarioWinningWall}`);
};


export const userReportApi = async (id, user_id) => {
  const token = localStorage.getItem("access_token");
  //live-game
  return await APIVERSION2.get(`${ApiVersion2.scenario.report_api}${id}/${user_id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};




export const achieveCorporateScenarioMilestone = async (payload) => {
  /**
   * payload = {
   *   active_scenario_id: string,
   *   milestone_id: string,
   *   submitted_text?: string,
   *   evidence_files?: File[],   // optional (multiple)
   *   screenshot_url?: File      // legacy (optional)
   * }
   */

  const token = localStorage.getItem("access_token");

  const formData = new FormData();
  formData.append("active_scenario_id", payload.active_scenario_id);
  formData.append("milestone_id", payload.milestone_id);

  if (payload.submitted_text) {
    formData.append("submitted_text", payload.submitted_text);
  }

  // NEW multiple evidence files
  if (Array.isArray(payload.evidence_files)) {
    payload.evidence_files.forEach((file) => {
      if (file) {
        formData.append("evidence_files", file);
      }
    });
  }

  // legacy single screenshot support
  if (payload.screenshot_url) {
    formData.append("screenshot_url", payload.screenshot_url);
  }

  return await APIVERSION2.post(
    ApiVersion2.scenario.submitmilestone,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

