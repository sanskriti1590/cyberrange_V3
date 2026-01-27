import axios from "axios";

const AxiosNoToken = axios.create({
    baseURL: process.env.REACT_APP_API_PATH
  });

  export default AxiosNoToken;