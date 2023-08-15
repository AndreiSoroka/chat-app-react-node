import { Alert } from "antd";
import type { ErrorsProps } from "./MessageError.types.ts";

const MessageError = ({ errorCode, errorMessage }: ErrorsProps) => {
  if (!errorCode || !errorMessage) return null;

  return <Alert message={errorMessage} type="error" showIcon />;
};

export default MessageError;
