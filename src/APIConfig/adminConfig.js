// API base URL imported
import API from "../Axios/axios";
import AxiosNoToken from "../Axios/axiosNoToken";

import ApiConfig from "./ApiConfig";

export const createSenarioCategory = async (data) => {
	const token = localStorage.getItem("access_token");
	return await API.post(ApiConfig.admin.createScenarioCategory, data, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
};

// un approved scenario
export const listOfUnApprovedScenario = async (data) => {
	const token = localStorage.getItem("access_token");
	return await API.get(ApiConfig.admin.listOfUnApprovedScenario, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
};
export const listOfUnApprovedCorporateRequests = async (data) => {
	const token = localStorage.getItem("access_token");
	return await API.get(ApiConfig.admin.listOfUnApprovedCorporateRequests, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
};

export const approvedScenariofromDb = async (data) => {
	const token = localStorage.getItem("access_token");
	return await API.post(ApiConfig.admin.approveScenario, data, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
};

export const approvedCorporateRequestsFromDB = async (data) => {
	const token = localStorage.getItem("access_token");
	return await API.post(ApiConfig.admin.approveCorporateRequests, data, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
};

export const approvalSenario = async (data) => {
	const token = localStorage.getItem("access_token");
	return await API.get(ApiConfig.admin.approvalScenario, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
};
export const approvalCorporateRequests = async (data) => {
	const token = localStorage.getItem("access_token");
	return await API.get(ApiConfig.admin.approvalCorporateRequests, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
};

export const UnapprovedScenariofromDB = async (data) => {
	const token = localStorage.getItem("access_token");
	return await API.post(ApiConfig.admin.unApprovalScenario, data, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
};

export const UnApprovedCorporateRequestsFromDB = async (data) => {
	const token = localStorage.getItem("access_token");
	return await API.post(ApiConfig.admin.unApprovalCorporateRequests, data, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
};

//  INFRA REVIEW 

export const getCorporateInfraForReview = async (corporate_id) => {
  const token = localStorage.getItem("access_token");
  return await API.get(
    `${ApiConfig.admin.corporateInfraReview}?corporate_id=${corporate_id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const saveCorporateInfraReview = async (data) => {
  const token = localStorage.getItem("access_token");
  return await API.post(
    ApiConfig.admin.corporateInfraReviewSave,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};


//cyberdrill update


// .approved scenario post request
// user data
export const UserData = async (data) => {
	const token = localStorage.getItem("access_token");
	return await API.get(`${ApiConfig.admin.userDetails}${data}`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
};

// user data
export const UserDataUpdate = async (userId, formData, selectedAvatar) => {
	const {
		name,
		email,
		team,
		mobileNumber,
		password,
		confirmPassword,
		isVerified,
		isPremium,
		isAdmin,
		isActive,
		display_all_ctf,
		display_all_scenario,
		display_all_corporate,
		display_locked_ctf,
		display_locked_scenario,
		display_locked_corporate,
	} = formData;

	const token = localStorage.getItem("access_token");
	const modifiedFormData = new FormData();
	modifiedFormData.append("user_full_name", name);
	modifiedFormData.append("user_avatar", selectedAvatar);
	modifiedFormData.append("email", email);
	modifiedFormData.append("mobile_number", mobileNumber);
	modifiedFormData.append("user_role", team);
	if (password === null || password === "") {
		modifiedFormData.append("password", "");
	} else {
		modifiedFormData.append("password", password);
	}
	if (confirmPassword === null || confirmPassword === "") {
		modifiedFormData.append("confirm_password", "");
	} else {
		modifiedFormData.append("confirm_password", confirmPassword);
	}
	modifiedFormData.append("is_verified", isVerified);
	modifiedFormData.append("is_premium", isPremium);
	modifiedFormData.append("is_admin", isAdmin);
	modifiedFormData.append("is_active", isActive);
	modifiedFormData.append("display_all_ctf", display_all_ctf);
	modifiedFormData.append("display_all_scenario", display_all_scenario);
	modifiedFormData.append("display_all_corporate", display_all_corporate);
	modifiedFormData.append("display_locked_ctf", display_locked_ctf);
	modifiedFormData.append("display_locked_scenario", display_locked_scenario);
	modifiedFormData.append("display_locked_corporate", display_locked_corporate);

	return await API.put(
		`${ApiConfig.admin.userModify}${userId}/`,
		modifiedFormData,
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
	);
};

// map ctf
export const mapCtfId = async (data) => {
	const token = localStorage.getItem("access_token");
	return await API.get(ApiConfig.admin.mappedCtf, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
};

// user data
export const unmappedCtf = async (data) => {
	const token = localStorage.getItem("access_token");
	return await API.delete(`${ApiConfig.admin.unmappedCtf}${data}/`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
};

// all ctf update get api
export const ctfUpdateGetApi = async (data) => {
	const token = localStorage.getItem("access_token");
	return await API.get(ApiConfig.admin.ctfList, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
};


// single ctf details
export const singleCtfUpdateGetApi = async (userId) => {
	const token = localStorage.getItem("access_token");
	return await API.get(`${ApiConfig.admin.ctfUpdateGet}${userId}`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
};

// single ctf update post request
export const ctfUpdatePost = async (
	data,
	sol,
	userId,
	text,
	textObj,
	textPre
) => {
	const token = localStorage.getItem("access_token");
	return await API.post(
		`${ApiConfig.admin.ctfUpdatePost}${userId}/`,
		{
			ctf_flags: sol,
			ctf_name: data.ctf_name,
			ctf_description: text,
			ctf_severity: data.ctf_severity,
			ctf_category_id: data.ctf_category_id,
			ctf_time: data.ctf_time,
			ctf_thumbnail: data.ctf_thumbnail,
			ctf_walkthrough: data.ctf_walkthrough,
			ctf_score: data.ctf_score,
			ctf_flags_information: textObj,
			ctf_rules_regulations: textPre,
		},
		{
			headers: {
				"Content-Type": "multipart/form-data",
				Authorization: `Bearer ${token}`,
			},
		}
	);
};



// news api
export const getNewsApi = async () => {
	return await AxiosNoToken.get(ApiConfig.admin.news);
};

export const getCTFCategories = async () => {
	const token = localStorage.getItem("access_token");
	return await API.get(`${ApiConfig.admin.getCTFCategories}`, {
		headers: {
			"Content-Type": "multipart/form-data",
			Authorization: `Bearer ${token}`,
		},
	});
};
export const getCTFCategory = async (categoryId) => {
	const token = localStorage.getItem("access_token");
	return await API.get(`${ApiConfig.admin.getCTFCategory}${categoryId}`, {
		headers: {
			"Content-Type": "multipart/form-data",
			Authorization: `Bearer ${token}`,
		},
	});
};

// add CTF category
export const addCTFCategory = async (formData) => {
	const { categoryName, description, imgFile } = formData;
	const token = localStorage.getItem("access_token");
	const modifiedFormData = new FormData();
	modifiedFormData.append("ctf_category_name", categoryName);
	modifiedFormData.append("ctf_category_description", description);
	modifiedFormData.append("ctf_category_thumbnail", imgFile);

	return await API.post(ApiConfig.admin.addCTFCategory, modifiedFormData, {
		headers: {
			"Content-Type": "multipart/form-data",
			Authorization: `Bearer ${token}`,
		},
	});
};
export const updateCTFCategory = async (formData, categoryId) => {
	const { categoryName, description, imgFile } = formData;

	const token = localStorage.getItem("access_token");

	const modifiedFormData = new FormData();

	modifiedFormData.append("ctf_category_name", categoryName);
	modifiedFormData.append("ctf_category_description", description);
	if (imgFile !== null) {
		modifiedFormData.append("ctf_category_thumbnail", imgFile);
	}
	return await API.post(
		`${ApiConfig.admin.updateCTFCategory}${categoryId}/`,
		modifiedFormData,
		{
			headers: {
				"Content-Type": "multipart/form-data",
				Authorization: `Bearer ${token}`,
			},
		}
	);
};

export const getScenarioCategories = async () => {
	const token = localStorage.getItem("access_token");
	return await API.get(`${ApiConfig.admin.getScenarioCategories}`, {
		headers: {
			"Content-Type": "multipart/form-data",
			Authorization: `Bearer ${token}`,
		},
	});
};
export const getScenarioCategory = async (categoryId) => {
	const token = localStorage.getItem("access_token");
	return await API.get(`${ApiConfig.admin.getScenarioCategory}${categoryId}`, {
		headers: {
			"Content-Type": "multipart/form-data",
			Authorization: `Bearer ${token}`,
		},
	});
};

// add CTF category
export const addScenarioCategory = async (formData) => {
	const { categoryName, description, imgFile } = formData;

	const token = localStorage.getItem("access_token");

	const modifiedFormData = new FormData();
	modifiedFormData.append("scenario_category_name", categoryName);
	modifiedFormData.append("scenario_category_description", description);
	modifiedFormData.append("scenario_category_thumbnail", imgFile);

	return await API.post(ApiConfig.admin.addScenarioCategory, modifiedFormData, {
		headers: {
			"Content-Type": "multipart/form-data",
			Authorization: `Bearer ${token}`,
		},
	});
};

export const updateScenarioCategory = async (formData, categoryId) => {
	const { categoryName, description, imgFile } = formData;

	const token = localStorage.getItem("access_token");

	const modifiedFormData = new FormData();
	modifiedFormData.append("scenario_category_name", categoryName);
	modifiedFormData.append("scenario_category_description", description);
	if (imgFile !== null) {
		modifiedFormData.append("scenario_category_thumbnail", imgFile);
	}
	return await API.post(
		`${ApiConfig.admin.updateScenarioCategory}${categoryId}/`,
		modifiedFormData,
		{
			headers: {
				"Content-Type": "multipart/form-data",
				Authorization: `Bearer ${token}`,
			},
		}
	);
};

// to get the users list
export const getAllUsers = async () => {
	const token = localStorage.getItem("access_token");
	return await API.get(`${ApiConfig.admin.getAllUsers}`, {
		headers: {
			"Content-Type": "multipart/form-data",
			Authorization: `Bearer ${token}`,
		},
	});
};
export const addUser = async (formData, selectedAvatar) => {
	const {
		name,
		email,
		team,
		mobileNumber,
		password,
		confirmPassword,
		isVerified,
		isPremium,
	} = formData;

	const token = localStorage.getItem("access_token");

	const modifiedFormData = new FormData();
	modifiedFormData.append("user_avatar", selectedAvatar);
	modifiedFormData.append("user_full_name", name);
	modifiedFormData.append("email", email);
	modifiedFormData.append("mobile_number", mobileNumber);
	modifiedFormData.append("user_role", team);
	modifiedFormData.append("password", password);
	modifiedFormData.append("confirm_password", confirmPassword);
	modifiedFormData.append("is_verified", isVerified);
	modifiedFormData.append("is_premium", isPremium);

	return await API.post(`${ApiConfig.admin.addUser}`, modifiedFormData, {
		headers: {
			"Content-Type": "multipart/form-data",
			Authorization: `Bearer ${token}`,
		},
	});
};

// Bulk User Upload
export const bulkUserUpload = async (file) => {
  const token = localStorage.getItem("access_token");

  const formData = new FormData();
  formData.append("file", file); // Excel (.xlsx / .xls)

  return await API.post(
    `${ApiConfig.admin.bulkUserUpload}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const deleteUser = async (userId) => {
  const token = localStorage.getItem("access_token");

  return await API.delete(
    `${ApiConfig.admin.deleteUser}${userId}/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// to get the notification list
export const NotificationList = async () => {
	const token = localStorage.getItem("access_token");
	return await API.get(`${ApiConfig.admin.notification}`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
};

// user specific CTF and scenarios data //

// get api for user specific CTF
export const getUserCTF = async (userID) => {
	const token = localStorage.getItem("access_token");
	return await API.get(`${ApiConfig.admin.getUserCTF}${userID}`, {
		headers: {
			"Content-Type": "multipart/form-data",
			Authorization: `Bearer ${token}`,
		},
	});
};

// add CTF data for user
export const addUserCTF = async (userId, ctfId) => {
	const token = localStorage.getItem("access_token");
	return await API.post(
		`${ApiConfig.admin.addUserCTF}${userId}/`,
		{
			ctf_id: ctfId,
		},
		{
			headers: {
				"Content-Type": "multipart/form-data",
				Authorization: `Bearer ${token}`,
			},
		}
	);
};

// remove CTF for user
export const removeUserCTF = async (userID, gameID) => {
	const token = localStorage.getItem("access_token");
	return await API.delete(
		`${ApiConfig.admin.removeUserCTF}${userID}/${gameID}`,
		{
			headers: {
				"Content-Type": "multipart/form-data",
				Authorization: `Bearer ${token}`,
			},
		}
	);
};

//get user category details
// get data of the machine by category id
export const getUserCategoryItem = async (id, userId) => {
	const token = localStorage.getItem("access_token");
	return await API.get(`${ApiConfig.admin.userCtfCat}${id}/${userId}/`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
};

// scenaio add remove and get api for admin so that he can change data for specific user
export const getUserScenario = async (userID) => {
	const token = localStorage.getItem("access_token");
	return await API.get(`${ApiConfig.admin.getUserScenario}${userID}`, {
		headers: {
			"Content-Type": "multipart/form-data",
			Authorization: `Bearer ${token}`,
		},
	});
};

// remove scenario for user
export const removeUserScenario = async (userID, gameID) => {
	const token = localStorage.getItem("access_token");
	return await API.delete(
		`${ApiConfig.admin.removeUserScenario}${userID}/${gameID}`,
		{
			headers: {
				"Content-Type": "multipart/form-data",
				Authorization: `Bearer ${token}`,
			},
		}
	);
};

// add scenario data for user
export const addUserScenario = async (userId, scenario_id) => {
	const token = localStorage.getItem("access_token");
	return await API.post(
		`${ApiConfig.admin.addUserScenario}${userId}/`,
		{
			scenario_id: scenario_id,
		},
		{
			headers: {
				"Content-Type": "multipart/form-data",
				Authorization: `Bearer ${token}`,
			},
		}
	);
};

// get user scenario category details
export const getUserCategoryScenario = async (id, userId) => {
	const token = localStorage.getItem("access_token");
	return await API.get(`${ApiConfig.admin.userScenarioCat}${id}/${userId}/`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
};

/////////////////////////////

// get corporate data api
export const getUserCorporate = async (userID) => {
	const token = localStorage.getItem("access_token");
	return await API.get(`${ApiConfig.admin.getUserCorporate}${userID}`, {
		headers: {
			"Content-Type": "multipart/form-data",
			Authorization: `Bearer ${token}`,
		},
	});
};

// get user corporate category details
export const getUserCategoryCorporate = async (id, userId) => {
	const token = localStorage.getItem("access_token");
	return await API.get(`${ApiConfig.admin.userCorporateCat}${id}/${userId}/`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
};

// add corporate data for user
export const addUserCorporate = async (userId, scenario_id) => {
	const token = localStorage.getItem("access_token");
	return await API.post(
		`${ApiConfig.admin.addUserCorporate}${userId}/`,
		{
			corporateId: scenario_id,
		},
		{
			headers: {
				"Content-Type": "multipart/form-data",
				Authorization: `Bearer ${token}`,
			},
		}
	);
};

// remove corporate for user
export const removeUserCorporate = async (userID, gameID) => {
	const token = localStorage.getItem("access_token");
	return await API.delete(
		`${ApiConfig.admin.removeUserCorporate}${userID}/${gameID}`,
		{
			headers: {
				"Content-Type": "multipart/form-data",
				Authorization: `Bearer ${token}`,
			},
		}
	);
};

export const getWebScenariosCategories = async () => {
	const token = localStorage.getItem("access_token");
	return await API.get(`${ApiConfig.admin.webScenarioCategories}`, {
		headers: {
			"Content-Type": "multipart/form-data",
			Authorization: `Bearer ${token}`,
		},
	});
};

export const getWebScenarioCategory = async (categoryId) => {
	const token = localStorage.getItem("access_token");
	return await API.get(`${ApiConfig.admin.webScenarioCategories}${categoryId}`, {
		headers: {
			"Content-Type": "multipart/form-data",
			Authorization: `Bearer ${token}`,
		},
	});
};

export const updateWebScenarioCategory = async (formData, categoryId) => {
	const { categoryName, description, imgFile } = formData;

	const token = localStorage.getItem("access_token");

	const modifiedFormData = new FormData();
	modifiedFormData.append("name", categoryName);
	modifiedFormData.append("description", description);
	if (imgFile !== null) {
		modifiedFormData.append("thumbnail", imgFile);
	}
	return await API.patch(
		`${ApiConfig.admin.webScenarioCategories}${categoryId}/`,
		modifiedFormData,
		{
			headers: {
				"Content-Type": "multipart/form-data",
				Authorization: `Bearer ${token}`,
			},
		}
	);
};


export const addWebScenarioCategory = async (formData) => {
	const { categoryName, description, imgFile } = formData;
	const token = localStorage.getItem("access_token");
	const modifiedFormData = new FormData();
	modifiedFormData.append("name", categoryName);
	modifiedFormData.append("description", description);
	modifiedFormData.append("thumbnail", imgFile);

	return await API.post(ApiConfig.admin.webScenarioCategories, modifiedFormData, {
		headers: {
			"Content-Type": "multipart/form-data",
			Authorization: `Bearer ${token}`,
		},
	});
};

export const createWebScenario = async (formData) => {
	const token = localStorage.getItem("access_token");

	return await API.post(ApiConfig.admin.webScenarioGames, formData, {
		headers: {
			"Content-Type": "multipart/form-data",
			Authorization: `Bearer ${token}`,
		},
	});
};

export const getApprovedUnapprovedWebScenarios = async (id) => {
	const token = localStorage.getItem("access_token");
	return await API.get(ApiConfig.admin.webScenarioGames, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
		params: {
			approved: id,
		},
	});
};

export const approvedUnapprovedWebScenarios = async (id) => {
	const token = localStorage.getItem("access_token");
	return await API.post(
		`${ApiConfig.admin.webScenarioGames}${id}/toggle-approval/`, {}, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	}
	);
};

export const fetchWebScenario = async (id) => {
	const token = localStorage.getItem("access_token");
	return await API.get(`${ApiConfig.admin.webScenarioGames}${id}`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
};

export const updateWebScenario = async (id, formData) => {
	const token = localStorage.getItem("access_token");
	return await API.patch(
		`${ApiConfig.admin.webScenarioGames}${id}`, formData, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	}
	);
};

export const getScenarioDetail = async (id) => {
  const token = localStorage.getItem('access_token');
  return await API.get(`${ApiConfig.scenario.scenarioDetails}${id}/`, {
	headers: {
	  Authorization: `Bearer ${token}`,
	},
  });
}

export const updateCorporateScenarioBasic = async (scenarioId, payload) => {
  const token = localStorage.getItem("access_token");

  return await API.post(
    ApiConfig.admin.updateCorporateScenarioBasic,
    {
      scenario_id: scenarioId,
      ...payload,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const updateCorporateScenarioPhases = async (scenarioId, phases) => {
  const token = localStorage.getItem("access_token");

  return await API.post(
    ApiConfig.admin.updateCorporateScenarioPhases,
    {
      scenario_id: scenarioId,
      phases: phases,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const updateCorporateScenarioFlags = async (scenarioId, flags) => {
  const token = localStorage.getItem("access_token");

  return await API.post(
    ApiConfig.admin.updateCorporateScenarioFlags,
    {
      scenario_id: scenarioId,
      flags: flags,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const updateCorporateScenarioMilestones = async (
  scenarioId,
  milestones
) => {
  const token = localStorage.getItem("access_token");

  return await API.post(
    ApiConfig.admin.updateCorporateScenarioMilestones,
    {
      scenario_id: scenarioId,
      milestones: milestones,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

