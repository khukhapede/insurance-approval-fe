import { Tag } from "antd";
import { ClaimType } from "@/types";

const typeConfig: Record<ClaimType, { color: string; label: string }> = {
  [ClaimType.ACCIDENT]: { color: "volcano", label: "Accident" },
  [ClaimType.HEALTH]: { color: "cyan", label: "Health" },
  [ClaimType.PROPERTY]: { color: "purple", label: "Property" },
};

interface Props {
  type: ClaimType;
}

const ClaimTypeTag = ({ type }: Props) => {
  const config = typeConfig[type] ?? { color: "default", label: type };
  return <Tag color={config.color}>{config.label}</Tag>;
};

export default ClaimTypeTag;
