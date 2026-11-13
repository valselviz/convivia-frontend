import { apiRequest } from "../api/client";
import type { SeatingResult, SeatingWeights } from "./types";

export const seatingService = {
  async autoAssign(
    eventId: number,
    weights: SeatingWeights,
    seed?: number,
  ): Promise<SeatingResult> {
    return apiRequest<SeatingResult>(`/events/${eventId}/seating/auto-assign`, {
      method: "POST",
      body: JSON.stringify({ weights, ...(seed !== undefined ? { seed } : {}) }),
    });
  },
};
