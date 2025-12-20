import axios from "axios";

const API_URL = "http://localhost:8888"; // URL pour gateway

export const api = axios.create({
  baseURL: API_URL,
});

// Fonction pour définir les credentials Basic Auth
export const setAuth = (username: string, password: string) => {
  api.defaults.auth = { username, password };
};
