import axios from "axios";
import { publicRoutes } from "../utils/routes";

export const api = axios.create({
  baseURL: "http://localhost:3001",
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response.status === 401 &&
      !publicRoutes.includes(window.location.href)
    ) {
      window.location.href = "/login";
      return;
    }

    return Promise.reject(error);
  }
);
