import api from "./api";
import type { ActivityLog } from "@/types";

export const activityService = {
  getLogsByClaimId: (claimId: string) =>
    api
      .get<ActivityLog[]>(`/activity-logs/claim/${claimId}`)
      .then((r) => r.data),
};
