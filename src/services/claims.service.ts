import api from "./api";
import type { Claim, CreateClaimDto, UpdateClaimDto } from "@/types";

export const claimsService = {
  getMyClaims: () => api.get<Claim[]>("/claims/my-claims").then((r) => r.data),

  getClaimById: (id: string) =>
    api.get<Claim>(`/claims/${id}`).then((r) => r.data),

  createClaim: (dto: CreateClaimDto) =>
    api.post<Claim>("/claims", dto).then((r) => r.data),

  updateClaim: (id: string, dto: UpdateClaimDto) =>
    api.patch<Claim>(`/claims/${id}`, dto).then((r) => r.data),

  submitClaim: (id: string) =>
    api.put<Claim>(`/claims/${id}/submit`).then((r) => r.data),

  verifyClaim: (id: string, comment?: string) =>
    api.put<Claim>(`/claims/${id}/verify`, { comment }).then((r) => r.data),

  getSubmittedClaims: () =>
    api.get<Claim[]>("/claims/submitted").then((r) => r.data),

  getVerifiedClaims: () =>
    api.get<Claim[]>("/claims/verified").then((r) => r.data),

  approveClaim: (id: string, comment?: string) =>
    api.put<Claim>(`/claims/${id}/approve`, { comment }).then((r) => r.data),

  rejectClaim: (id: string, reason?: string) =>
    api.put<Claim>(`/claims/${id}/reject`, { reason }).then((r) => r.data),
};
