import API from "../Axios/axios";
import ApiConfig from "./ApiConfig";

export const getCTF_Challenge = async (id) => {
  const token = localStorage.getItem("access_token");
  return await API.get(`${ApiConfig.challenge.ctf}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getScenario_Challenge = async (id) => {
  const token = localStorage.getItem("access_token");
  return await API.get(`${ApiConfig.challenge.scenario}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// create_challenge
export const create_challenge = async (formData) => {
  const { ctf_or_scenario_id, game_type, challenge_thumbnail } = formData;

  const token = localStorage.getItem("access_token");
  const modifiedFormData = new FormData();

  modifiedFormData.append("ctf_or_scenario_id", ctf_or_scenario_id);
  modifiedFormData.append("game_type", game_type);
  modifiedFormData.append("challenge_thumbnail", challenge_thumbnail);
  return await API.post(
    `${ApiConfig.challenge.create_challenge}`,
    modifiedFormData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

//delete_challenge
export const delete_challenge = async (id) => {
  const token = localStorage.getItem("access_token");
  return await API.delete(`${ApiConfig.challenge.delete_challenge}${id}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
