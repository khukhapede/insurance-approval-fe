import { Typography } from "antd";
import type { ActivityLog } from "@/types";

const { Text } = Typography;

interface Props {
  logs: ActivityLog[];
}

const dotColor: Record<string, string> = {
  created: "#B4B2A9",
  submitted: "#378ADD",
  verified: "#EF9F27",
  approved: "#639922",
  rejected: "#E24B4A",
};

const dotBg: Record<string, string> = {
  created: "#F1EFE8",
  submitted: "#E6F1FB",
  verified: "#FAEEDA",
  approved: "#EAF3DE",
  rejected: "#FCEBEB",
};

const statusTagStyle: Record<string, React.CSSProperties> = {
  draft: { background: "#F1EFE8", color: "#5F5E5A" },
  submitted: { background: "#E6F1FB", color: "#185FA5" },
  verified: { background: "#FAEEDA", color: "#854F0B" },
  approved: { background: "#EAF3DE", color: "#3B6D11" },
  rejected: { background: "#FCEBEB", color: "#A32D2D" },
};

const roleTagStyle: Record<string, React.CSSProperties> = {
  user: { background: "#E6F1FB", color: "#185FA5" },
  verifier: { background: "#FAEEDA", color: "#854F0B" },
  approver: { background: "#EAF3DE", color: "#3B6D11" },
};

const StatusTag = ({ status }: { status: string }) => (
  <span
    style={{
      ...(statusTagStyle[status] ?? {
        background: "#F1EFE8",
        color: "#5F5E5A",
      }),
      fontSize: 9,
      fontWeight: 500,
      padding: "1px 5px",
      borderRadius: 8,
      textTransform: "uppercase" as const,
    }}
  >
    {status}
  </span>
);

const ActivityTimeline = ({ logs }: Props) => {
  if (!logs || logs.length === 0) {
    return (
      <Text type="secondary" style={{ fontSize: 12 }}>
        No activity yet
      </Text>
    );
  }

  return (
    <div style={{ position: "relative", paddingLeft: 18 }}>
      {logs.map((log, index) => {
        const action = log.action?.toLowerCase() ?? "created";
        const isLast = index === logs.length - 1;

        return (
          <div
            key={log.id}
            style={{ position: "relative", paddingBottom: isLast ? 0 : 16 }}
          >
            {/* Vertical line */}
            {!isLast && (
              <div
                style={{
                  position: "absolute",
                  left: -12,
                  top: 16,
                  bottom: 0,
                  width: 1,
                  background: "#e0e0e0",
                }}
              />
            )}

            {/* Dot */}
            <div
              style={{
                position: "absolute",
                left: -18,
                top: 3,
                width: 12,
                height: 12,
                borderRadius: "50%",
                background: dotBg[action] ?? "#F1EFE8",
                border: `2px solid ${dotColor[action] ?? "#B4B2A9"}`,
              }}
            />

            {/* Top row — action + timestamp */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 2,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 500,
                  textTransform: "capitalize",
                }}
              >
                {log.action}
              </span>
              <span style={{ fontSize: 10, color: "#aaa" }}>
                {new Date(log.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                })}{" "}
                ·{" "}
                {new Date(log.createdAt).toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            {/* Status flow */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                marginBottom: 3,
              }}
            >
              {log.previousStatus && (
                <>
                  <StatusTag status={log.previousStatus} />
                  <span style={{ fontSize: 9, color: "#aaa" }}>→</span>
                </>
              )}
              <StatusTag status={log.newStatus} />
            </div>

            {/* Performer */}
            <div style={{ fontSize: 10, color: "#888", marginBottom: 2 }}>
              By{" "}
              <span style={{ fontWeight: 500, color: "inherit" }}>
                {log.performedBy?.fullName ?? "Unknown"}
              </span>
              {log.performedBy?.role && (
                <span
                  style={{
                    ...(roleTagStyle[log.performedBy.role] ?? {}),
                    fontSize: 9,
                    padding: "1px 4px",
                    borderRadius: 6,
                    fontWeight: 500,
                    marginLeft: 3,
                  }}
                >
                  {log.performedBy.role}
                </span>
              )}
            </div>

            {/* Comment */}
            {log.comment && (
              <div
                style={{
                  fontSize: 10,
                  color: "#888",
                  fontStyle: "italic",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: 220,
                }}
              >
                "{log.comment}"
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ActivityTimeline;
