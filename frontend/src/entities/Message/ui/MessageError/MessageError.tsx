import { Alert } from 'antd';

type ErrorsProps = {
  errorCode?: number;
  errorMessage?: string;
};

const MessageError  = ({ errorCode, errorMessage }: ErrorsProps) => {
  if (!errorCode || !errorMessage) return null;

  return (
    <Alert
      message={errorMessage}
      type="error"
      showIcon
    />
  );
};

export default MessageError;
