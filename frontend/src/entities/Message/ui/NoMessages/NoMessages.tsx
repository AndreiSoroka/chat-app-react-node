import { Result } from "antd";

const NoMessages = () => {
  return (
    <Result
      status="success"
      title="Welcome to our chat!"
      subTitle="Just type your name and start chatting!"
    />
  );
};

export default NoMessages;
