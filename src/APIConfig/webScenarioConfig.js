import API from "../Axios/axios";
import handleApiError from "../ErrorHandler/newErrorHandle";
import ApiConfig from "./ApiConfig";

export const getWebScenarioUserCategories = async () => {
  const token = localStorage.getItem("access_token");
  return await API.get(ApiConfig.webScenario.categories, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};
export const getWebScenariosByCategoryId = async (categoryId) => {
  const token = localStorage.getItem("access_token");
  return await API.get(ApiConfig.webScenario.games, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
    params: {
      category: categoryId,
    },
  });
};

export const getWebScenarioDetail = async (gameId) => {
  const token = localStorage.getItem("access_token");
  return await API.get(`${ApiConfig.webScenario.gameDetail}/${gameId}`, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};

// start webscenario game
export const startGame_webScenario = async (game_id) => {
  try {
    const token = localStorage.getItem("access_token");
    return await API.post(
      `${ApiConfig.webScenario.start}/${game_id}/start`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    handleApiError(error);
  }
};

// end game API for web Scenario
export const endGameWebScenario = async (gameid, uniqeId) => {
  try {
    const token = localStorage.getItem("access_token");
    const data = { _id: uniqeId };
    return await API.post(`${ApiConfig.webScenario.end}${gameid}/end`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    handleApiError(error);
  }
};

//Achievers winning wall webScenario
export const getWinningWallDataWebScenario = async (gameId) => {
  const token = localStorage.getItem("access_token");
  return await API.get(`${ApiConfig.webScenario.achivers}${gameId}/players`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// get API for active web scenario list
export const activeGameListwebScenario = async () => {
  try {
    const token = localStorage.getItem("access_token");
    return await API.get(`${ApiConfig.webScenario.active}?types=active`, {
      headers: {
        // "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    handleApiError(error);
  }
};

//get console webscenario game
export const getConsoleDetailsWebScenario = async (id) => {
  const token = localStorage.getItem("access_token");
  return await API.get(`${ApiConfig.webScenario.console}${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// submit flag API web scenario
export const submitFlagWebScenario = async (gameId, _id, inputValue) => {
  try {
    const token = localStorage.getItem("access_token");
    return await API.post(
      `${ApiConfig.webScenario.flagSubmit}${gameId}/flags_submit`,
      { payed_game_id: _id, flag: inputValue },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    handleApiError(error);
  }
};

// rating machine Web Scenario
export const ratingMachineWebScenario = async (playerId, data) => {
  try {
    const token = localStorage.getItem("access_token");
    return await API.post(
      `${ApiConfig.webScenario.rating}${playerId}/ratings`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    handleApiError(error);
  }
};
