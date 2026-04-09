import { Tag } from "antd";
import { ClaimType } from "@/types";

const typeConfig: Record<ClaimType, { color: string; label: string }> = {
  [ClaimType.MEDICAL]: { color: "cyan", label: "Medical" },
  [ClaimType.ACCIDENT]: { color: "volcano", label: "Accident" },
  [ClaimType.PROPERTY]: { color: "purple", label: "Property" },
  [ClaimType.LIFE]: { color: "green", label: "Life" },
  [ClaimType.OTHER]: { color: "default", label: "Other" },
};

interface Props {
  type: ClaimType;
}

const ClaimTypeTag = ({ type }: Props) => {
  const config = typeConfig[type] ?? { color: "default", label: type };
  return <Tag color={config.color}>{config.label}</Tag>;
};

export default ClaimTypeTag;
