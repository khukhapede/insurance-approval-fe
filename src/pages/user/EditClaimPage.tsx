import { Form, Input, InputNumber, Select, Button, Card, Typography, Space, Spin, App } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { claimsService } from '@/services';
import { ClaimType, ClaimStatus, type UpdateClaimDto } from '@/types';

const { Title } = Typography;

const EditClaimPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { notification } = App.useApp();
  const [form] = Form.useForm();

  const { data: claim, isLoading } = useQuery({
    queryKey: ['claim', id],
    queryFn: () => claimsService.getClaimById(id!),
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: (dto: UpdateClaimDto) => claimsService.updateClaim(id!, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['claim', id] });
      queryClient.invalidateQueries({ queryKey: ['my-claims'] });
      notification.success({ message: 'Claim updated successfully!' });
      navigate(`/claims/${id}`);
    },
    onError: () => {
      notification.error({ message: 'Failed to update claim' });
    },
  });

  if (isLoading) return <Spin size="large" />;
  if (!claim) return <div>Claim not found</div>;

  if (claim.status !== ClaimStatus.DRAFT) {
    navigate(`/claims/${id}`);
    return null;
  }

  const handleSubmit = (values: UpdateClaimDto) => {
    updateMutation.mutate({
      title: values.title,
      description: values.description,
      claimAmount: values.claimAmount,
      claimType: values.claimType,
    });
  };

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>Edit Claim</Title>
      <Card style={{ maxWidth: 600 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            title: claim.title,
            claimType: claim.claimType,
            claimAmount: parseFloat(claim.claimAmount),
            description: claim.description,
          }}
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: 'Please enter a title' }]}
          >
            <Input placeholder="e.g. Car crash on Sudirman" />
          </Form.Item>

          <Form.Item
            label="Claim Type"
            name="claimType"
            rules={[{ required: true, message: 'Please select a claim type' }]}
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
            rules={[{ required: true, message: 'Please enter amount' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              min={0}
              step={1000}
              formatter={(v) => `Rp ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(v) => Number(v?.replace(/Rp\s?|(,*)/g, '') ?? 0) as 0}
            />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Space>
              <Button onClick={() => navigate(`/claims/${id}`)}>Cancel</Button>
              <Button type="primary" htmlType="submit" loading={updateMutation.isPending}>
                Save Changes
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default EditClaimPage;