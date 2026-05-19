import { apiClient } from "./client";
import type { CardInput, ReadingDetail, ReadingListResponse } from "@/types";

export const readingsApi = {
  create: (concern: string, cards: CardInput[]) =>
    apiClient.post<ReadingDetail>("/readings", { concern, cards }),

  list: (page = 1, limit = 20) =>
    apiClient.get<ReadingListResponse>("/readings", { params: { page, limit } }),

  get: (id: number) => apiClient.get<ReadingDetail>(`/readings/${id}`),
};
