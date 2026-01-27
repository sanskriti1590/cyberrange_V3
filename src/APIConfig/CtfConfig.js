// API base URL imported
import API from '../Axios/axios';
import AxiosNoToken from '../Axios/axiosNoToken';

import ApiConfig from './ApiConfig';


export const getCtfList = async () => {
  const token = localStorage.getItem('access_token');
  return await API.get(ApiConfig.machines.list, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getCtfListWithoutAuth = async () => {
  const token = localStorage.getItem('access_token');
  return await AxiosNoToken.get(ApiConfig.machines.list);
};

export const createCtf = async (data) => {
  const token = localStorage.getItem('access_token');
  return await API.post(ApiConfig.machines.create, data, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};

// active game list
export const activeGameList = async () => {
  const token = localStorage.getItem('access_token');
  return await API.get(ApiConfig.machines.activeMachine, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};
//ctf machine upload
export const uploadCtfFile = async (file, id) => {
  const token = localStorage.getItem('access_token');
  return await API.post(
    ApiConfig.machines.upload,
    {
      ctf_id: id,
      target_machine: file,
    },
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const loginUser = async (data) => {

  return await AxiosNoToken.post(ApiConfig.auth.login, data, {
    headers: {
      // "Content-Type": "multipart/form-data",
      "Content-Type": "application/json",
    }
  });
};

export const registerUser = async (data) => {
  return await AxiosNoToken.post(ApiConfig.auth.register, data);
};

// refresh token
export const refreshToken = async (data) => {

  try {
    const refreshToken = localStorage.getItem('refresh_token');
    const response = await AxiosNoToken.post(ApiConfig.auth.refresh, { refresh_token: refreshToken })
    localStorage.setItem("access_token", response.data.access_token);
    localStorage.setItem("refresh_token", response.data.refresh_token);
    window.location.href = data
  } catch (Error) {
    window.location.href = `/auth/login`
  }

}
// start ctf game
export const startGame = async (id) => {
  const token = localStorage.getItem('access_token');
  return await API.post(
    ApiConfig.user.startCtf,
    { ctf_id: id },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

//get console ctf game
export const getConsoleDetails = async (id) => {
  const token = localStorage.getItem('access_token');
  return await API.get(`${ApiConfig.user.getConsole}${id}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// end game
export const endGame = async (id) => {
  const token = localStorage.getItem('access_token');
  return await API.delete(`${ApiConfig.user.endCtf}${id}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const delGame = async (id) => {
  const token = localStorage.getItem('access_token');
  return await API.delete(
    `${ApiConfig.user.liveGame}/${id}/delete/`,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const extendTime = async (id) => {
  const token = localStorage.getItem('access_token');
  return await API.post(
    ApiConfig.user.extendTime,
    { ctf_game_id: id },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const loadGame = async (gameId) => {
  const token = localStorage.getItem('access_token');
  //live-game
  return await API.get(`${ApiConfig.user.liveGame}/${gameId}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// submit the flag
export const submitFlag = async (gameId, inputValue) => {
  const token = localStorage.getItem('access_token');
  //submitFlag
  return await API.post(
    ApiConfig.user.submitFlag,
    { ctf_game_id: gameId, ctf_flag: inputValue },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// user profile details
export const UserProfileApi = async (Id) => {
  const token = localStorage.getItem('access_token');
  try {
    //userProfile
    return await API.get(`${ApiConfig.user.userProfile}${Id}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    //console.log("error is here", error.response);
  }
};

export const submitMapCtf = async (data) => {
  const token = localStorage.getItem('access_token');
  return await API.post(
    ApiConfig.admin.mapCtf,
    {
      ctf_id: data.ctf,
      attacker_flavor_id: data.attacker_flavor,
      attacker_image_id: data.attacker_machine,
      ctf_time: data.time,
      target_flavor_id: data.target_flavor,
      target_image_id: data.target_machine,
      for_premium_user: data.for_premium_user,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// export const UserProfileApi = async (userId) => {
//     
//     const response = await API.get(`http://127.0.0.1:8000/api/users/1bz5wGBZzb/${userId}/`, {
//         headers: {
//             Authorization: `Bearer ${token}`
//         }
//     });
//     return response;
// }

export const getMapCtfOptions = async () => {
  const token = localStorage.getItem('access_token');
  return await API.get(ApiConfig.admin.mapCtf, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getUsers = async () => {
  const token = localStorage.getItem('access_token');
  return await API.get(ApiConfig.admin.user, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getUserDetails = async (id) => {
  const token = localStorage.getItem('access_token');
  return await API.get(`${ApiConfig.admin.user}${id}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateUser = async (data, id) => {
  const token = localStorage.getItem('access_token');
  return await API.put(`${ApiConfig.admin.user}${id}/`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const ctfMachineProfile = async (game_id) => {
  const token = localStorage.getItem('access_token');
  return await API.get(`${ApiConfig.machines.machine}/${game_id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const submitRating = async (id, rating) => {
  const token = localStorage.getItem('access_token');
  return await API.post(
    ApiConfig.machines.rate,
    {
      archive_id: id,
      rating: rating,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const getPendingMachines = async () => {
  const token = localStorage.getItem('access_token');
  //upload
  return await API.get(ApiConfig.machines.upload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getAllAvatars = async () => {
  const token = localStorage.getItem('access_token');
  return AxiosNoToken.get(ApiConfig.user.avatar);
};

export const getLeaderBoard = async () => {
  const token = localStorage.getItem('access_token');
  return await AxiosNoToken.get(ApiConfig.game.leaderboard);
};

export const getChallenges = async () => {
  return await AxiosNoToken.get(ApiConfig.game.challenge);
};

export const getChallengeCreate = async (ctf_id) => {
  const token = localStorage.getItem('access_token');
  return await API.post(
    ApiConfig.game.challengeCreate,
    {
      ctf_id: ctf_id,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// get all category
export const getCategory = async () => {

  try {
    return await AxiosNoToken.get(ApiConfig.category.list, {
      headers: {
        "Access-Control-Request-Headers": "*",
      },
    });
  } catch (error) {
    //console.log("error", error);
  }
};

//create machine
export const createMachine = async (data, sol) => {
  const token = localStorage.getItem('access_token');
  return await API.post(
    ApiConfig.machines.createMachine,
    {
      ctf_flags: sol,
      ctf_name: data.ctf_name,
      ctf_description: data.ctf_description,
      ctf_severity: data.ctf_severity,
      ctf_category_id: data.ctf_category_id,
      ctf_time: data.ctf_time,
      ctf_thumbnail: data.ctf_thumbnail,
      ctf_walkthrough: data.ctf_walkthrough,
      ctf_score: data.ctf_score,
      ctf_flags_information: data.ctf_flags_information,
      ctf_rules_regulations: data.ctf_rules
    },
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// otp send
export const optSend = async (id) => {
  const token = localStorage.getItem('access_token');
  return await API.post(
    ApiConfig.auth.sendOtp,
    { otp: id },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// otp verification
export const optVerification = async (id) => {
  const token = localStorage.getItem('access_token');
  return await API.post(
    ApiConfig.auth.otp,
    { otp: id },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// unverified user details
export const unverified = async () => {
  const token = localStorage.getItem('access_token');
  return await API.get(ApiConfig.auth.userDetails, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// rating machine
export const ratingMachine = async (data) => {
  const token = localStorage.getItem('access_token');
  return await API.post(ApiConfig.machines.rate, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// game details
export const gameDetailsApi = async (id) => {
  const token = localStorage.getItem('access_token');
  return await API.get(`${ApiConfig.machines.machine}${id}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// game draft
export const DraftApi = async (id) => {
  const token = localStorage.getItem('access_token');
  return await API.get(`${ApiConfig.machines.draft}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// member walls

export const MemberWallApi = async () => {
  return await AxiosNoToken.get(`${ApiConfig.user.memberWall}`);
};

// mail listing
export const mailListing = async (data) => {
  return await AxiosNoToken.post(ApiConfig.user.mailingList, data);
};

// api is dashboardMembers
export const dashboardList = async () => {

  try {
    return await AxiosNoToken.get(ApiConfig.user.dashboardMembers);
  } catch (error) {
    //console.log("error", error);
  }
};

export const adminCreateCategory = async (formData) => {
  const { categoryName, description } = formData;

  const token = localStorage.getItem('access_token');

  const modifiedFormData = new FormData();
  modifiedFormData.append('ctf_category_name', categoryName);
  modifiedFormData.append('ctf_category_description', description);

  return await API.post(
    ApiConfig.admin.CreateCategory,
    modifiedFormData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const getCategoryList = async (id) => {
  const token = localStorage.getItem('access_token');
  return await API.get(`${ApiConfig.admin.GetCategoryCtf}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// get data of the machine by category id
export const getCategoryItem = async (id) => {
  const token = localStorage.getItem('access_token');
  return await API.get(`${ApiConfig.machines.CategoryMachine}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// top performer
export const topPerformerApi = async (id) => {
  return await AxiosNoToken.get(`${ApiConfig.user.topPerformer}`);
};

// challenges
export const challengesApi = async (id) => {
  return await AxiosNoToken.get(`${ApiConfig.user.challenges}`);
};


// register user to the platform
export const userRegister = async (data) => {
  return await AxiosNoToken.post(ApiConfig.auth.formDetails, data);
}

// get user target ip
export const getCtfIpAddress = async (id) => {
  const token = localStorage.getItem('access_token');
  return await API.get(`${ApiConfig.machines.getCtfIp}${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}


export const submitctf = async (formData) => {

  const {
    CTFId,
    targetFlavorId,
    targetImage,
    timeDuration,
    score,
    flavorId,
    selectImage,
    userName,
    password
  } = formData;

  const token = localStorage.getItem('access_token');

  const modifiedFormData = new FormData();
  modifiedFormData.append('ctf_id', CTFId);
  modifiedFormData.append('ctf_target_image_id', targetImage);
  modifiedFormData.append('ctf_target_flavor_id', targetFlavorId);
  modifiedFormData.append('ctf_time', timeDuration);
  modifiedFormData.append('ctf_attacker_image_id', selectImage);
  modifiedFormData.append('ctf_attacker_flavor_id', flavorId);
  modifiedFormData.append('ctf_score', score);
  modifiedFormData.append('ctf_attacker_username', userName);
  modifiedFormData.append('ctf_attacker_password', password);
  modifiedFormData.append('ctf_for_premium_user', false);

  return await API.post(
    ApiConfig.admin.submitCtf,
    modifiedFormData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const getctfId = async (id) => {
  const token = localStorage.getItem('access_token');
  return await API.get(`${ApiConfig.admin.upMapCtf}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// To get the winning wall data of CTF
export const getCTFWinningWall = async (id) => {
  return await AxiosNoToken.get(`${ApiConfig.machines.ctfWinningWall}`);
};


// on count down end
export const onCountDownEndFun = async (id) => {
  const token = localStorage.getItem('access_token');
  return await API.post(
    ApiConfig.machines.onCountEnd,
    { ctf_game_id: id },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};