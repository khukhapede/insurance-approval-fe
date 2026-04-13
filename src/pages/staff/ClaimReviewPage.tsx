import { Card, Descriptions, Button, Modal, Input, App } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { claimsService, activityService } from "@/services";
import { ClaimStatus, UserRole } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import {
  ClaimStatusBadge,
  ClaimTypeTag,
  ActivityTimeline,
  LoadingSpinner,
  ErrorAlert,
} from "@/components/shared";

const ClaimReviewPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { notification } = App.useApp();
  const { user } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [actionType, setActionType] = useState<
    "verify" | "approve" | "reject" | null
  >(null);
  const [comment, setComment] = useState("");

  const {
    data: claim,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["staff-claim", id],
    queryFn: () => claimsService.getClaimById(id!),
    enabled: !!id,
  });

  const { data: activityLogs = [] } = useQuery({
    queryKey: ["activity-logs", id],
    queryFn: () => activityService.getLogsByClaimId(id!),
    enabled: !!id,
  });

  const verifyMutation = useMutation({
    mutationFn: ({ id, comment }: { id: string; comment: string }) =>
      claimsService.verifyClaim(id, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff-claim", id] });
      queryClient.invalidateQueries({ queryKey: ["activity-logs", id] });
      queryClient.invalidateQueries({ queryKey: ["submitted-claims"] });
      notification.success({ message: "Claim verified successfully!" });
      handleCloseModal();
    },
    onError: () => notification.error({ message: "Failed to verify claim" }),
  });

  const approveMutation = useMutation({
    mutationFn: ({ id, comment }: { id: string; comment: string }) =>
      claimsService.approveClaim(id, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff-claim", id] });
      queryClient.invalidateQueries({ queryKey: ["activity-logs", id] });
      queryClient.invalidateQueries({ queryKey: ["verified-claims"] });
      notification.success({ message: "Claim approved successfully!" });
      handleCloseModal();
    },
    onError: () => notification.error({ message: "Failed to approve claim" }),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      claimsService.rejectClaim(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["staff-claim", id] });
      queryClient.invalidateQueries({ queryKey: ["activity-logs", id] });
      queryClient.invalidateQueries({ queryKey: ["verified-claims"] });
      notification.success({ message: "Claim rejected successfully!" });
      handleCloseModal();
    },
    onError: () => notification.error({ message: "Failed to reject claim" }),
  });

  const handleOpenModal = (type: "verify" | "approve" | "reject") => {
    setActionType(type);
    setComment("");
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setActionType(null);
    setComment("");
  };

  const handleConfirm = () => {
    if (!claim) return;
    if (actionType === "reject" && !comment.trim()) {
      notification.warning({ message: "Please provide a rejection reason" });
      return;
    }
    if (actionType === "verify")
      verifyMutation.mutate({ id: claim.id, comment });
    if (actionType === "approve")
      approveMutation.mutate({ id: claim.id, comment });
    if (actionType === "reject")
      rejectMutation.mutate({ id: claim.id, reason: comment });
  };

  const isConfirmLoading =
    verifyMutation.isPending ||
    approveMutation.isPending ||
    rejectMutation.isPending;

  const backUrl =
    user?.role === UserRole.VERIFIER ? "/claims/submitted" : "/claims/verified";

  if (isLoading) return <LoadingSpinner />;
  if (isError)
    return <ErrorAlert message="Failed to load claim" onRetry={refetch} />;
  if (!claim) return <ErrorAlert message="Claim not found" />;

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
        <Button onClick={() => navigate(backUrl)}>Back</Button>
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
            <Descriptions.Item label="Submitted By">
              {claim.createdBy?.fullName ?? "-"}
            </Descriptions.Item>
            {claim.verifiedBy && (
              <Descriptions.Item label="Verified By">
                {claim.verifiedBy.fullName}
              </Descriptions.Item>
            )}
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

          {/* Action buttons */}
          <div
            style={{
              display: "flex",
              gap: 8,
              justifyContent: "flex-end",
              marginTop: 16,
            }}
          >
            {user?.role === UserRole.VERIFIER &&
              claim.status === ClaimStatus.SUBMITTED && (
                <Button
                  type="primary"
                  style={{ background: "#854F0B", borderColor: "#854F0B" }}
                  onClick={() => handleOpenModal("verify")}
                >
                  Verify
                </Button>
              )}
            {user?.role === UserRole.APPROVER &&
              claim.status === ClaimStatus.VERIFIED && (
                <>
                  <Button danger onClick={() => handleOpenModal("reject")}>
                    Reject
                  </Button>
                  <Button
                    type="primary"
                    style={{ background: "#3B6D11", borderColor: "#3B6D11" }}
                    onClick={() => handleOpenModal("approve")}
                  >
                    Approve
                  </Button>
                </>
              )}
          </div>
        </Card>

        {/* Activity log */}
        <Card
          title="Activity Log"
          style={{ width: 280 }}
          styles={{ body: { overflowY: "auto", maxHeight: 500 } }}
        >
          <ActivityTimeline logs={activityLogs} />
        </Card>
      </div>

      {/* Action modal */}
      <Modal
        title={
          actionType === "verify"
            ? `Verify — ${claim.claimNumber}`
            : actionType === "approve"
              ? `Approve — ${claim.claimNumber}`
              : `Reject — ${claim.claimNumber}`
        }
        open={modalOpen}
        onOk={handleConfirm}
        onCancel={handleCloseModal}
        okText={
          actionType === "verify"
            ? "Confirm Verify"
            : actionType === "approve"
              ? "Confirm Approve"
              : "Confirm Reject"
        }
        okButtonProps={{ danger: actionType === "reject" }}
        confirmLoading={isConfirmLoading}
      >
        <p style={{ marginBottom: 8, color: "#888" }}>
          {actionType === "verify" &&
            "Add an optional comment before verifying."}
          {actionType === "approve" &&
            "Add an optional comment before approving."}
          {actionType === "reject" && "Please provide a reason for rejecting."}
        </p>
        <Input.TextArea
          rows={3}
          placeholder={
            actionType === "reject"
              ? "Reason for rejection..."
              : "Add a comment..."
          }
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default ClaimReviewPage;
