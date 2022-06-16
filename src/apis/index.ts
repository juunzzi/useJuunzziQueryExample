import axios from "axios";

export const BASE_URL = "http://localhost:4000";

export const client = axios.create({
  baseURL: BASE_URL,
});
