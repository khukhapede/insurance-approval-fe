import { Tag } from "antd";
import { ClaimStatus } from "@/types";

const statusConfig: Record<ClaimStatus, { color: string; label: string }> = {
  [ClaimStatus.DRAFT]: { color: "default", label: "Draft" },
  [ClaimStatus.SUBMITTED]: { color: "blue", label: "Submitted" },
  [ClaimStatus.VERIFIED]: { color: "orange", label: "Verified" },
  [ClaimStatus.APPROVED]: { color: "green", label: "Approved" },
  [ClaimStatus.REJECTED]: { color: "red", label: "Rejected" },
};

interface Props {
  status: ClaimStatus;
}

const ClaimStatusBadge = ({ status }: Props) => {
  const config = statusConfig[status] ?? { color: "default", label: status };
  return <Tag color={config.color}>{config.label.toUpperCase()}</Tag>;
};

export default ClaimStatusBadge;
