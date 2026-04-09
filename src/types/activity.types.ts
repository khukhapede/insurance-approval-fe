import type { User } from "./user.types";

export interface ActivityLog {
  id: string;
  action: string;
  previousStatus: string | null;
  newStatus: string;
  comment: string | null;
  performedBy: User;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}
