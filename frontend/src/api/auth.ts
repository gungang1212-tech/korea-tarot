import { apiClient } from "./client";
import type { TokenResponse, User } from "@/types";

export const authApi = {
  register: (email: string, password: string, nickname: string) =>
    apiClient.post<User>("/auth/register", { email, password, nickname }),

  login: (email: string, password: string) =>
    apiClient.post<TokenResponse>("/auth/login", { email, password }),

  logout: () => apiClient.post("/auth/logout"),

  refresh: () => apiClient.post<{ access_token: string }>("/auth/refresh"),
};
