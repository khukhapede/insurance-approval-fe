import { Spin } from "antd";

interface Props {
  height?: string | number;
}

const LoadingSpinner = ({ height = "60vh" }: Props) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height,
      }}
    >
      <Spin size="large" />
    </div>
  );
};

export default LoadingSpinner;
