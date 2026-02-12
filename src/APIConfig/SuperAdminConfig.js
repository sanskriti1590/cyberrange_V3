import APIVERSION2 from "../Axios/version2";
import ApiVersion2 from "./version2Api";
// ===============================
export const getSuperAdminActiveScenarios = async () => {
  const token = localStorage.getItem("access_token");

  return await APIVERSION2.get(
    ApiVersion2.superadmin.activeList,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// ===============================
// OVERVIEW
// ===============================
export const getSuperAdminScenarioOverview = async (id) => {
  const token = localStorage.getItem("access_token");

  return await APIVERSION2.get(
    ApiVersion2.superadmin.overview(id),
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// ===============================
// LEADERBOARD
// ===============================
export const getSuperAdminLeaderboard = async (id) => {
  const token = localStorage.getItem("access_token");

  return await APIVERSION2.get(
    ApiVersion2.superadmin.leaderboard(id),
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// ===============================
// MANUAL SCORING
// ===============================
export const applySuperAdminManualScore = async (payload) => {
  const token = localStorage.getItem("access_token");

  return await APIVERSION2.post(
    ApiVersion2.superadmin.manualScore,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// ===============================
// LOCK CONTROLS
// ===============================
export const toggleSuperAdminFlagLock = async (payload) => {
  const token = localStorage.getItem("access_token");

  return await APIVERSION2.post(
    ApiVersion2.superadmin.toggleFlagLock,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const toggleSuperAdminMilestoneLock = async (payload) => {
  const token = localStorage.getItem("access_token");

  return await APIVERSION2.post(
    ApiVersion2.superadmin.toggleMilestoneLock,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const toggleSuperAdminPhaseLock = async (payload) => {
  const token = localStorage.getItem("access_token");

  return await APIVERSION2.post(
    ApiVersion2.superadmin.togglePhaseLock,
    payload,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};