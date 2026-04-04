import { Table, Button, Typography, Modal, Input, App, Space } from "antd";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { claimsService } from "@/services";
import type { Claim, ClaimStatus, ClaimType } from "@/types";
import {
  ClaimStatusBadge,
  ClaimTypeTag,
  LoadingSpinner,
  ErrorAlert,
} from "@/components/shared";

const { Title } = Typography;

const SubmittedClaimsPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { notification } = App.useApp();
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [comment, setComment] = useState("");

  const {
    data: claims = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["submitted-claims"],
    queryFn: claimsService.getSubmittedClaims,
  });

  const verifyMutation = useMutation({
    mutationFn: ({ id, comment }: { id: string; comment: string }) =>
      claimsService.verifyClaim(id, comment),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["submitted-claims"] });
      notification.success({ message: "Claim verified successfully!" });
      setSelectedClaim(null);
      setComment("");
    },
    onError: () => {
      notification.error({ message: "Failed to verify claim" });
    },
  });

  const handleVerify = () => {
    if (!selectedClaim) return;
    verifyMutation.mutate({ id: selectedClaim.id, comment });
  };

  if (isLoading) return <LoadingSpinner />;
  if (isError)
    return (
      <ErrorAlert message="Failed to load submitted claims" onRetry={refetch} />
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
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: ClaimStatus) => <ClaimStatusBadge status={status} />,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString("id-ID"),
    },
    {
      title: "Action",
      key: "action",
      render: (_: unknown, record: Claim) => (
        <Space.Compact>
          <Button size="small" onClick={() => navigate(`/claims/${record.id}`)}>
            View
          </Button>
          <Button
            size="small"
            type="primary"
            onClick={() => setSelectedClaim(record)}
          >
            Verify
          </Button>
        </Space.Compact>
      ),
    },
  ];

  return (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>
        Submitted Claims
      </Title>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={claims}
        loading={isLoading}
      />

      {/* Verify Modal */}
      <Modal
        title={`Verify — ${selectedClaim?.claimNumber}`}
        open={!!selectedClaim}
        onOk={handleVerify}
        onCancel={() => {
          setSelectedClaim(null);
          setComment("");
        }}
        okText="Confirm Verify"
        confirmLoading={verifyMutation.isPending}
      >
        <p style={{ marginBottom: 8, color: "#888" }}>
          Add an optional comment before verifying this claim.
        </p>
        <Input.TextArea
          rows={3}
          placeholder="All documents verified successfully..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </Modal>
    </div>
  );
};

export default SubmittedClaimsPage;
