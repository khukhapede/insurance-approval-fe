import { Row, Col, Typography } from "antd";
import { useQuery } from "@tanstack/react-query";
import { claimsService } from "@/services";
import { ClaimStatus } from "@/types";
import { StatCard } from "@/components/shared";

const { Title } = Typography;

const UserDashboardPage = () => {
  const { data: claims = [], isLoading } = useQuery({
    queryKey: ["my-claims"],
    queryFn: claimsService.getMyClaims,
  });

  const total = claims.length;
  const draft = claims.filter((c) => c.status === ClaimStatus.DRAFT).length;
  const pending = claims.filter((c) =>
    [ClaimStatus.SUBMITTED, ClaimStatus.VERIFIED].includes(c.status),
  ).length;
  const approved = claims.filter(
    (c) => c.status === ClaimStatus.APPROVED,
  ).length;
  const rejected = claims.filter(
    (c) => c.status === ClaimStatus.REJECTED,
  ).length;

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>
        Dashboard
      </Title>
      <Row gutter={[16, 16]}>
        <Col span={4}>
          <StatCard title="Total" value={total} loading={isLoading} />
        </Col>
        <Col span={4}>
          <StatCard
            title="Draft"
            value={draft}
            color="#8c8c8c"
            loading={isLoading}
          />
        </Col>
        <Col span={4}>
          <StatCard
            title="Pending"
            value={pending}
            color="#1890ff"
            loading={isLoading}
          />
        </Col>
        <Col span={4}>
          <StatCard
            title="Approved"
            value={approved}
            color="#52c41a"
            loading={isLoading}
          />
        </Col>
        <Col span={4}>
          <StatCard
            title="Rejected"
            value={rejected}
            color="#f5222d"
            loading={isLoading}
          />
        </Col>
      </Row>
    </div>
  );
};

export default UserDashboardPage;
