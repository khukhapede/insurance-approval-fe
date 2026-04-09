import type { User } from './user.types';
import type { ActivityLog } from './activity.types';

export enum ClaimStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  VERIFIED = 'verified',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export enum ClaimType {
  MEDICAL = 'medical',
  ACCIDENT = 'accident',
  PROPERTY = 'property',
  LIFE = 'life',
  OTHER = 'other',
}

export interface Claim {
  id: string;
  claimNumber: string;
  title: string;
  description: string;
  claimAmount: string;       
  claimType: ClaimType;
  status: ClaimStatus;
  rejectionReason: string | null;
  createdBy: User;
  verifiedBy: User | null;
  approvedBy: User | null;
  submittedAt: string | null;
  verifiedAt: string | null;
  approvedAt: string | null;
  rejectedAt: string | null;
  createdAt: string;
  updatedAt: string;
  activityLogs?: ActivityLog[];
}

export interface CreateClaimDto {
  title: string;
  description: string;
  claimAmount: number;
  claimType: ClaimType;
}

export interface UpdateClaimDto extends Partial<CreateClaimDto> {}