import { apiClient } from "./client";
import type { CardSummary } from "@/types";

export const cardsApi = {
  list: () => apiClient.get<CardSummary[]>("/api/cards"),
  get: (id: number) => apiClient.get<CardSummary>(`/api/cards/${id}`),
};
