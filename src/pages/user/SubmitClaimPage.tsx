import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Card,
  Typography,
  Space,
} from "antd";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { App } from "antd";
import { claimsService } from "@/services";
import { ClaimType, type CreateClaimDto } from "@/types";

const { Title } = Typography;

const SubmitClaimPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { notification } = App.useApp();
  const [form] = Form.useForm();

  const createMutation = useMutation({
    mutationFn: (dto: CreateClaimDto) => claimsService.createClaim(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-claims"] });
      notification.success({ message: "Claim created successfully!" });
      navigate("/claims");
    },
    onError: () => {
      notification.error({ message: "Failed to create claim" });
    },
  });

  const handleSubmit = (values: CreateClaimDto) => {
    createMutation.mutate({
      title: values.title,
      description: values.description,
      claimAmount: values.claimAmount,
      claimType: values.claimType,
    });
  };

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>
        Submit New Claim
      </Title>
      <Card style={{ maxWidth: 600 }}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Title"
            name="title"
            rules={[
              { required: true, message: "Please enter a title" },
              { min: 3, message: "Title must be at least 3 characters" },
              { max: 100, message: "Title cannot exceed 100 characters" },
            ]}
          >
            <Input
              placeholder="e.g. Car crash on Sudirman"
              showCount
              maxLength={100}
            />
          </Form.Item>

          <Form.Item
            label="Claim Type"
            name="claimType"
            rules={[{ required: true, message: "Please select a claim type" }]}
          >
            <Select placeholder="Select type">
              <Select.Option value={ClaimType.ACCIDENT}>Accident</Select.Option>
              <Select.Option value={ClaimType.HEALTH}>Health</Select.Option>
              <Select.Option value={ClaimType.PROPERTY}>Property</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Amount (Rp)"
            name="claimAmount"
            rules={[
              { required: true, message: "Please enter amount" },
              {
                type: "number",
                min: 1000,
                message: "Minimum amount is Rp 1.000",
              },
              {
                type: "number",
                max: 1000000000,
                message: "Maximum amount is Rp 1.000.000.000",
              },
            ]}
          >
            <InputNumber
              style={{ width: "100%" }}
              min={0}
              step={1000}
              formatter={(v) => `Rp ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              parser={(v) => Number(v?.replace(/Rp\s?|(,*)/g, "") ?? 0) as 0}
              placeholder="0"
            />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[
              { required: true, message: "Please enter description" },
              {
                min: 10,
                message: "Description must be at least 10 characters",
              },
              { max: 500, message: "Description cannot exceed 500 characters" },
            ]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Describe the incident..."
              showCount
              maxLength={500}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Space>
              <Button onClick={() => navigate("/claims")}>Cancel</Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={createMutation.isPending}
              >
                Submit Claim
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default SubmitClaimPage;
