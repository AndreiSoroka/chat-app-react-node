import {observer} from "mobx-react-lite";
import {Space} from "antd";
import {MessageError, MessageForm, messageStore} from "@/entities/Message";
import {SendMessageProps} from "./SendMessage.types.ts";

const SendMessage = observer(({onClickScrollToEnd}: SendMessageProps) => {

  const handleSendMessage = async (displayName: string, textContent: string) => {
    const response = await messageStore.sendMessage(displayName, textContent);
    if (response?.success) {
      onClickScrollToEnd?.();
    }
  };

  return (
    <Space direction="vertical">
      <MessageError
        errorCode={messageStore.fetchError?.errorCode}
        errorMessage={messageStore.fetchError?.errorMessage}/>
      <MessageForm onMessageSend={handleSendMessage} formStatus={messageStore.status}/>
    </Space>
  );
});

export default SendMessage;
