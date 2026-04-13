import { Table, Button, Typography, Modal, Input, App, Empty } from "antd";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { claimsService } from "@/services";
import { ClaimType, ClaimStatus, type Claim } from "@/types";
import {
  ClaimStatusBadge,
  ClaimTypeTag,
  LoadingSpinner,
  ErrorAlert,
} from "@/components/shared";

const { Title } = Typography;

type ActionType = "approve" | "reject" | null;

const VerifiedClaimsPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { notification } = App.useApp();
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [actionType, setActionType] = useState<ActionType>(null);
  const [comment, setComment] = useState("");

  const {
    data: claims = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["verified-claims"],
    queryFn: claimsService.getVerifiedClaims,
  });

  const approveMutation = useMutation({
    mutationFn: ({ id, comment }: { id: string; comment: string }) =>
      claimsService.approveClaim(id, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["verified-claims"] });
      notification.success({ message: "Claim approved successfully!" });
      handleCloseModal();
    },
    onError: () => {
      notification.error({ message: "Failed to approve claim" });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      claimsService.rejectClaim(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["verified-claims"] });
      notification.success({ message: "Claim rejected successfully!" });
      handleCloseModal();
    },
    onError: () => {
      notification.error({ message: "Failed to reject claim" });
    },
  });
  // const handleOpenModal = (claim: Claim, type: ActionType) => {
  //   setSelectedClaim(claim);
  //   setActionType(type);
  //   setComment("");
  // };

  const handleCloseModal = () => {
    setSelectedClaim(null);
    setActionType(null);
    setComment("");
  };

  const handleConfirm = () => {
    if (!selectedClaim) return;
    if (actionType === "reject" && !comment.trim()) {
      notification.warning({ message: "Please provide a rejection reason" });
      return;
    }
    if (actionType === "approve") {
      approveMutation.mutate({ id: selectedClaim.id, comment });
    } else {
      rejectMutation.mutate({ id: selectedClaim.id, reason: comment });
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (isError)
    return (
      <ErrorAlert message="Failed to load verified claims" onRetry={refetch} />
    );

  const columns = [
    {
      title: "Claim No.",
      dataIndex: "claimNumber",
      key: "claimNumber",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Type",
      dataIndex: "claimType",
      key: "claimType",
      render: (type: ClaimType) => <ClaimTypeTag type={type} />,
    },
    {
      title: "Amount",
      dataIndex: "claimAmount",
      key: "claimAmount",
      render: (amount: string) =>
        amount ? `Rp ${parseFloat(amount).toLocaleString("id-ID")}` : "-",
    },
    {
      title: "Submitted By",
      key: "createdBy",
      render: (_: unknown, record: Claim) => record.createdBy?.fullName ?? "-",
    },
    {
      title: "Verified By",
      key: "verifiedBy",
      render: (_: unknown, record: Claim) => record.verifiedBy?.fullName ?? "-",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: ClaimStatus) => <ClaimStatusBadge status={status} />,
    },
    {
      title: "Action",
      key: "action",
      render: (_: unknown, record: Claim) => (
        <Button
          size="small"
          onClick={() => navigate(`/staff/claims/${record.id}`)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>
        Verified Claims
      </Title>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={claims}
        loading={isLoading}
        locale={{
          emptyText: (
            <Empty
              description="No claims found"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          ),
        }}
      />

      <Modal
        title={
          actionType === "approve"
            ? `Approve — ${selectedClaim?.claimNumber}`
            : `Reject — ${selectedClaim?.claimNumber}`
        }
        open={!!selectedClaim}
        onOk={handleConfirm}
        onCancel={handleCloseModal}
        okText={actionType === "approve" ? "Confirm Approve" : "Confirm Reject"}
        okButtonProps={{
          danger: actionType === "reject",
        }}
        confirmLoading={approveMutation.isPending || rejectMutation.isPending}
      >
        <p style={{ marginBottom: 8, color: "#888" }}>
          {actionType === "approve"
            ? "Add an optional comment before approving this claim."
            : "Please provide a reason for rejecting this claim."}
        </p>
        <Input.TextArea
          rows={3}
          placeholder={
            actionType === "approve"
              ? "All documents approved..."
              : "Reason for rejection..."
          }
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default VerifiedClaimsPage;
