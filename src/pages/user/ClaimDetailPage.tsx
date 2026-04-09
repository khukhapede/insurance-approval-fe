import { Card, Descriptions, Button, App } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { claimsService, activityService } from "@/services";
import { ClaimStatus } from "@/types";
import {
  LoadingSpinner,
  ActivityTimeline,
  ClaimStatusBadge,
  ClaimTypeTag,
  ErrorAlert,
} from "@/components/shared";

const ClaimDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { notification } = App.useApp();

  const {
    data: claim,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["claim", id],
    queryFn: () => claimsService.getClaimById(id!),
    enabled: !!id,
  });

  const submitMutation = useMutation({
    mutationFn: () => claimsService.submitClaim(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["claim", id] });
      queryClient.invalidateQueries({ queryKey: ["my-claims"] });
      notification.success({ message: "Claim submitted successfully!" });
    },
    onError: () => {
      notification.error({ message: "Failed to submit claim" });
    },
  });

  const { data: activityLogs = [] } = useQuery({
    queryKey: ["activity-logs", id],
    queryFn: () => activityService.getLogsByClaimId(id!),
    enabled: !!id,
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError)
    return <ErrorAlert message="Failed to load claim" onRetry={refetch} />;
  if (!claim) return <div>Claim not found</div>;

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16, fontWeight: 500 }}>
            {claim.claimNumber}
          </span>
          <ClaimStatusBadge status={claim.status} />
        </div>
        <Button onClick={() => navigate("/claims")}>Back</Button>
      </div>

      <div style={{ display: "flex", gap: 16 }}>
        {/* Claim details */}
        <Card style={{ flex: 1 }}>
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Claim No.">
              {claim.claimNumber}
            </Descriptions.Item>
            <Descriptions.Item label="Title">{claim.title}</Descriptions.Item>
            <Descriptions.Item label="Type">
              <ClaimTypeTag type={claim.claimType} />
            </Descriptions.Item>
            <Descriptions.Item label="Amount">
              {claim.claimAmount
                ? `Rp ${parseFloat(claim.claimAmount).toLocaleString("id-ID")}`
                : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Description">
              {claim.description}
            </Descriptions.Item>
            {claim.rejectionReason && (
              <Descriptions.Item label="Rejection Reason">
                <span style={{ color: "#f5222d" }}>
                  {claim.rejectionReason}
                </span>
              </Descriptions.Item>
            )}
            <Descriptions.Item label="Submitted At">
              {claim.submittedAt
                ? new Date(claim.submittedAt).toLocaleString("id-ID")
                : "-"}
            </Descriptions.Item>
            <Descriptions.Item label="Created At">
              {new Date(claim.createdAt).toLocaleString("id-ID")}
            </Descriptions.Item>
          </Descriptions>

          {claim.status === ClaimStatus.DRAFT && (
            <Button
              type="primary"
              style={{ marginTop: 16 }}
              loading={submitMutation.isPending}
              onClick={() => submitMutation.mutate()}
            >
              Submit for Review
            </Button>
          )}
        </Card>

        {/* Activity log */}
        {/* <Card title="Activity Log" style={{ width: 280 }}>
          {claim.activityLogs && claim.activityLogs.length > 0 ? (
            <Timeline
              items={claim.activityLogs.map((log) => ({
                color: "blue",
                children: (
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 500 }}>
                      {log.action}
                    </div>
                    {log.note && (
                      <div style={{ fontSize: 11, color: "#888" }}>
                        {log.note}
                      </div>
                    )}
                    <div style={{ fontSize: 11, color: "#aaa" }}>
                      {new Date(log.createdAt).toLocaleString("id-ID")}
                    </div>
                  </div>
                ),
              }))}
            />
          ) : (
            <div style={{ color: "#aaa", fontSize: 12 }}>No activity yet</div>
          )}
        </Card> */}
        <Card title="Activity Log" style={{ width: 280 }}>
          <ActivityTimeline logs={activityLogs} />
        </Card>
      </div>
    </div>
  );
};

export default ClaimDetailPage;
