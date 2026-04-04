import { Alert, Button } from "antd";

interface Props {
  message?: string;
  onRetry?: () => void;
}

const ErrorAlert = ({ message = "Something went wrong", onRetry }: Props) => {
  return (
    <Alert
      type="error"
      message={message}
      action={
        onRetry && (
          <Button size="small" danger onClick={onRetry}>
            Retry
          </Button>
        )
      }
    />
  );
};

export default ErrorAlert;
