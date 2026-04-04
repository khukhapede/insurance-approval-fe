import { Card, Row, Col, Statistic, Typography } from "antd";
import { useQuery } from "@tanstack/react-query";
import { claimsService } from "@/services";

const { Title } = Typography;

const ApproverDashboardPage = () => {
  const { data: verifiedClaims = [], isLoading } = useQuery({
    queryKey: ["verified-claims"],
    queryFn: claimsService.getVerifiedClaims,
  });

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>
        Approver Dashboard
      </Title>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card loading={isLoading}>
            <Statistic
              title="Pending Approval"
              value={verifiedClaims.length}
              valueStyle={{ color: "#fa8c16" }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ApproverDashboardPage;
