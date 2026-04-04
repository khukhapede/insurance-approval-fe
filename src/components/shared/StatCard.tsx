import { Card, Statistic } from "antd";

interface Props {
  title: string;
  value: number;
  color?: string;
  loading?: boolean;
}

const StatCard = ({ title, value, color, loading }: Props) => {
  return (
    <Card loading={loading}>
      <Statistic
        title={title}
        value={value}
        valueStyle={color ? { color } : undefined}
      />
    </Card>
  );
};

export default StatCard;
