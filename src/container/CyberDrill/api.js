import axios from "../../Axios/axios"; // 

function withAuth(headers = {}) {
  const token =
    localStorage.getItem("access") ||
    localStorage.getItem("token") ||
    localStorage.getItem("access_token");

  if (token && !headers.Authorization) {
    return { ...headers, Authorization: `Bearer ${token}` };
  }
  return headers;
}

const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL,
  withCredentials: true,
});

// ✅ category list 
export const getScenarioCategories = () =>
  api.get("/scenario/category/list/", { headers: withAuth() });

// ✅ create scenario 
export const createScenario = async (formData) => {
  try {
    const res = await api.post("/corporate/scenario/create/", formData, {
      headers: withAuth({ "Content-Type": "multipart/form-data" }),
    });
    return res;
  } catch (err) {
    console.error(
      "❌ CREATE SCENARIO API ERROR:",
      err?.response?.data || err?.message
    );
    throw err;
  }
};

// 
export const createPhases = (scenarioId, phases) =>
  api.post(
    "/corporate/scenario/phases/",
    { scenario_id: scenarioId, phases },
    { headers: withAuth() }
  );

//  create flags 
export const createFlags = (scenarioId, items) =>
  api.post(
    "/corporate/scenario/flags/",
    { scenario_id: scenarioId, flags: items },
    { headers: withAuth() }
  );

//  create milestones 
export const createMilestones = (scenarioId, items) =>
  api.post(
    "/corporate/scenario/milestones/",
    { scenario_id: scenarioId, milestones: items },
    { headers: withAuth() }
  );

export const createScenarioInfra = (scenarioId, payload) =>
  api.post(
    `/corporate/scenario/add-infra/?scenario_id=${scenarioId}`,
    payload,
    { headers: withAuth() }
  );
