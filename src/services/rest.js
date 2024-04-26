import axios from "axios";
import { HEADERS, TOKEN_KEY } from "../utils/constant";

export const login = async (reqBody) => {
  console.log("restfile");
  const response = await axios.post("/api/callback", { ...reqBody });
  if (response.status === 200) {
    const csrf = response.headers.get("x-csrf-token");
    localStorage.setItem(TOKEN_KEY, csrf);
  }
};

export const rest = axios.create({
  baseURL: "/api/ws",
  headers: HEADERS,
});

// export default rest;
rest.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      await login({
        username: "admin",
        password: "admin",
      });
    }
    return {
      ...config,
      headers: {
        ...config?.headers,
        "X-CSRF-Token": localStorage.getItem(TOKEN_KEY),
      },
    };
  },
  (error) => {
    return Promise.reject(error);
  }
);
