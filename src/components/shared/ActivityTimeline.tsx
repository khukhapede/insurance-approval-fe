import { Timeline, Typography } from "antd";
import type { ActivityLog } from "@/types";

const { Text } = Typography;

interface Props {
  logs: ActivityLog[];
}

const activityColor: Record<string, string> = {
  created: "gray",
  submitted: "blue",
  verified: "orange",
  approved: "green",
  rejected: "red",
};

const ActivityTimeline = ({ logs }: Props) => {
  if (!logs || logs.length === 0) {
    return (
      <Text type="secondary" style={{ fontSize: 12 }}>
        No activity yet
      </Text>
    );
  }

  return (
    <Timeline
      items={logs.map((log) => ({
        color: activityColor[log.action?.toLowerCase()] ?? "blue",
        children: (
          <div>
            <div style={{ fontSize: 12, fontWeight: 500 }}>{log.action}</div>
            {log.note && (
              <div style={{ fontSize: 11, color: "#888" }}>{log.note}</div>
            )}
            <div style={{ fontSize: 11, color: "#aaa" }}>
              {log.user?.fullName && <span>{log.user.fullName} · </span>}
              {new Date(log.createdAt).toLocaleString("id-ID")}
            </div>
          </div>
        ),
      }))}
    />
  );
};

export default ActivityTimeline;
