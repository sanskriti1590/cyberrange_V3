// API base URL imported
import API from '../Axios/axios';
import AxiosNoToken from '../Axios/axiosNoToken';
import APIVERSION2 from '../Axios/version2';

import ApiConfig from './ApiConfig';


export const createSenarios = async (data, value, sol1, sol2, sol3, multipleFile, text, toolsAndTechnologies, prerequisites) => {
  const token = localStorage.getItem('access_token');
  const formData = new FormData();
  multipleFile.forEach(file => {
    formData.append("scenario_documents", file);
  });
  formData.append('scenario_thumbnail', data.scenario_thumbnail)
  formData.append('scenario_red_team_flags', sol3)
  formData.append('scenario_purple_team_flags', sol2)
  formData.append('scenario_blue_team_flags', sol1)
  formData.append('scenario_members_requirement', JSON.stringify(value))
  formData.append('scenario_name', data.scenario_name)
  formData.append('scenario_assigned_severity', data.scenario_assigned_severity)
  formData.append('scenario_category_id', data.scenario_category_id)
  formData.append('scenario_description', text)
  formData.append('scenario_tools_technologies', toolsAndTechnologies)
  formData.append('scenario_prerequisites', prerequisites)
  formData.append('scenario_name', data.scenario_name)
  formData.append('scenario_score', data.scenario_score)
  formData.append('scenario_time', data.scenario_time)
  return await API.post(ApiConfig.scenario.createScenario,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
}

//  GET CATEGORY LIST
export const getCategorList = async () => {
  return await AxiosNoToken.get(ApiConfig.scenario.categoryList);
}


export const createInfra = async (scenarioId, myJSON) => {
  const token = localStorage.getItem('access_token');
  return await API.post(ApiConfig.scenario.infra, {
    scenario_id: scenarioId,
    scenario_infra: myJSON
  }, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });
}

//  GET IMAGE AND FLAVOUR LIST
export const getImageAndFlavourList = async () => {
  // return await AxiosNoToken.get(ApiVersion2.scenario.ImageAndFal);
  return await APIVERSION2.get(ApiConfig.scenario.ImageAndFal)

}

// scenario-listing
export const scenariolisting = async () => {
  return await AxiosNoToken.get(ApiConfig.scenario.scenarioList);
}


// scenario details
export const scenarioDetails = async (id) => {
  const token = localStorage.getItem('access_token');
  return await API.get(`${ApiConfig.scenario.scenarioDetails}${id}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// start game api
export const scenarioStartGame = async (scenarioId, myJSON) => {
  const token = localStorage.getItem('access_token');
  return await API.post(ApiConfig.scenario.scenarioStartGame, {
    scenario_id: scenarioId,
    scenario_players_info: myJSON
  }, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });
}

// active scenario list
export const activeScenarioList = async () => {
  const token = localStorage.getItem('access_token');
  return await API.get(ApiConfig.scenario.activeScenarioList, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });
}


//get console Scenario game
export const getConsoleDetailsSenario = async (id) => {
  const token = localStorage.getItem('access_token');
  return await API.get(`${ApiConfig.scenario.scenarioConsole}${id}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}


export const endGame = async (id) => {
  const token = localStorage.getItem('access_token');
  return await API.delete(`${ApiConfig.scenario.scenarioDelete}${id}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}


// active game list scenario 
export const activeGameList = async () => {
  const token = localStorage.getItem('access_token');
  return await API.get(ApiConfig.scenario.activeMachine, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });
}


// submit the flag 
export const submitFlag = async (gameId, inputValue) => {
  const token = localStorage.getItem('access_token');
  return await API.post(ApiConfig.scenario.submitFlag, {
    scenario_game_id: gameId,
    scenario_flag: inputValue
  }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

// detail according to the scenario category id
export const scenarioCategoryDetail = async (id) => {
  const token = localStorage.getItem('access_token');
  return await AxiosNoToken.get(`${ApiConfig.scenario.scenarioCategoryDetails}${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}


//  GET topology details
export const topologyDetails = async (id) => {
  return await AxiosNoToken.get(`${ApiConfig.scenario.topology}/${id}`);
}

//  GET topology details for corporate
export const topologyCorporateDetails = async (id) => {
  return await AxiosNoToken.get(`${ApiConfig.scenario.corporateTopology}/${id}`);
}


// get user target ip
export const getScenarioIpAddress = async (id) => {
  const token = localStorage.getItem('access_token');
  return await API.get(`${ApiConfig.scenario.getScenarioIp}${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}
// winning wall
export const getScenarioWinningWall = async (id) => {
  return await AxiosNoToken.get(`${ApiConfig.scenario.scenarioWinningWall}`);
};

// get all scenario
// all scenario update get api
export const scenarioUpdateGetApi = async (data) => {
  const token = localStorage.getItem('access_token');
  return await API.get(ApiConfig.admin.gameList, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

//  scenario get api
export const scenarioSingleGet = async (data) => {
  const token = localStorage.getItem('access_token');
  return await API.get(`${ApiConfig.admin.gameDetails}${data}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

//  scenario document delete
export const scenarioDelete = async (data) => {
  const token = localStorage.getItem('access_token');
  return await API.put(`${ApiConfig.admin.gameDelete}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

//   scenario update
export const senariosUpdate = async (userId, data, multipleFile, text, textObj, textPre) => {
  const token = localStorage.getItem('access_token');
  const formData = new FormData();
  if (multipleFile) {
    multipleFile.forEach(file => {
      formData.append("scenario_documents", file);
    });
  } else {
    formData.append("scenario_documents", '')
  }

  if (data.scenario_thumbnail) {
    formData.append('scenario_thumbnail', data.scenario_thumbnail)
  } else {
    formData.append('scenario_thumbnail', '')
  }
  formData.append('scenario_name', data.scenario_name)
  formData.append('scenario_assigned_severity', data.scenario_assigned_severity)
  formData.append('scenario_category_id', data.scenario_category_id)
  formData.append('scenario_description', text)
  formData.append('scenario_tools_technologies', textObj)
  formData.append('scenario_prerequisites', textPre)
  formData.append('scenario_name', data.scenario_name)
  formData.append('scenario_score', data.scenario_score)
  formData.append('scenario_time', data.scenario_time)
  formData.append('scenario_for_premium_user', data.scenario_for_premium_user)
  return await API.post(`${ApiConfig.admin.gameUpdate}${userId}/`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
}