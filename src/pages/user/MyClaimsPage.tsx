import { Table, Button, Typography, Space, Empty } from "antd";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { claimsService } from "@/services";
import { ClaimStatus, type Claim, ClaimType } from "@/types";
import { ClaimStatusBadge, ClaimTypeTag } from "@/components/shared";
const { Title } = Typography;

// const statusColor: Record<ClaimStatus, string> = {
//   [ClaimStatus.DRAFT]: "default",
//   [ClaimStatus.SUBMITTED]: "blue",
//   [ClaimStatus.VERIFIED]: "orange",
//   [ClaimStatus.APPROVED]: "green",
//   [ClaimStatus.REJECTED]: "red",
// };

const MyClaimsPage = () => {
  const navigate = useNavigate();
  const { data: claims = [], isLoading } = useQuery({
    queryKey: ["my-claims"],
    queryFn: claimsService.getMyClaims,
  });

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Claim No.",
      dataIndex: "claimNumber",
      key: "claimNumber",
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
        <Space>
          <Button size="small" onClick={() => navigate(`/claims/${record.id}`)}>
            View
          </Button>
          {record.status === ClaimStatus.DRAFT && (
            <Button
              size="small"
              onClick={() => navigate(`/claims/${record.id}/edit`)}
            >
              Edit
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 16,
        }}
      >
        <Title level={4} style={{ margin: 0 }}>
          My Claims
        </Title>
        <Button type="primary" onClick={() => navigate("/claims/submit")}>
          Submit New Claim
        </Button>
      </div>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={claims}
        loading={isLoading}
        locale={{
          emptyText: (
            <Empty
              description="You haven't submitted any claims yet"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Button type="primary" onClick={() => navigate("/claims/submit")}>
                Submit your first claim
              </Button>
            </Empty>
          ),
        }}
      />
    </div>
  );
};

export default MyClaimsPage;
