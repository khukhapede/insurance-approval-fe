export interface ActivityLog {
  id: string;
  action: string;
  fromStatus: string | null;
  toStatus: string;
  note: string | null;
  userId: string;
  claimId: string;
  user?: import("./user.types").User;
  createdAt: string;
}
