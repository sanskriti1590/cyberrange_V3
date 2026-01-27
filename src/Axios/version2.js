import axios from "axios";

import { refreshToken } from "../APIConfig/CtfConfig";
import { startTransition } from "react";
import axiosErrorHandler from "../ErrorHandler/axiosErrHandler";
import jwtDecode from "jwt-decode";

const token = localStorage.getItem("access_token");

const APIVERSION2 = axios.create({
  baseURL: process.env.REACT_APP_API_PATH,
});

// Add a request interceptor
APIVERSION2.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    const currentPath = window.location?.pathname
    if (token) {
      const token = localStorage.getItem("token");
      if (token) {
        const decodedToken = jwtDecode(token);
        const isExpired = decodedToken.exp * 1000 < Date.now();

        if (isExpired) {
          startTransition(() => {
            refreshToken(currentPath)

          });
        }
      }
      // useTokenHandling()
    }

    // You can modify the request configuration here if needed
    return config;
  },
  function (error) {
    // Do something with request error
    // return Promise.reject(error);
    axiosErrorHandler(error)
    return null
  }
);

// Add a response interceptor
APIVERSION2.interceptors.response.use(
  function (response) {
    // Do something with response data 
    // You can modify the response data here if needed
    return response;
  },
  async function (error) {
    // Do something with response error
    const currentPath = window.location?.pathname;

    if (
      error?.response?.data?.exception ===
      "An error of type InvalidUser occurred: Expired Token."
    ) {
      // Wrap the data fetching in startTransition to make it low-priority
      startTransition(() => {
        refreshToken(currentPath);
      });
    }
    // if (error.response && error.response.status === 401) {
    //   // Token expired or not authorized
    //   // Redirect to the login page
    //   useNavigate("/login");
    // }
    // return Promise.reject(error);
    axiosErrorHandler(error)
    return null
  }
);

export default APIVERSION2;
