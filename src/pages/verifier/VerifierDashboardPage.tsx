import { Card, Row, Col, Statistic, Typography } from "antd";
import { useQuery } from "@tanstack/react-query";
import { claimsService } from "@/services";

const { Title } = Typography;

const VerifierDashboardPage = () => {
  const { data: submittedClaims = [], isLoading } = useQuery({
    queryKey: ["submitted-claims"],
    queryFn: claimsService.getSubmittedClaims,
  });

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>
        Verifier Dashboard
      </Title>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card loading={isLoading}>
            <Statistic
              title="Pending Verification"
              value={submittedClaims.length}
              valueStyle={{ color: "#1890ff" }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default VerifierDashboardPage;
