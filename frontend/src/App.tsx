import {useEffect, useRef, useState} from "react";
import {observer} from "mobx-react-lite";
import {MessageForm, MessageError, MessageList, messageStore, ScrollDownButton} from "./entities/Message";
import {type MessageListRef} from "./entities/Message/ui/MessageList/MessageList.tsx";
import {Card, Space} from "antd";

const App = observer(() => {
  const [isAutoScroll, setIsAutoScroll] = useState(true);
  const listRef = useRef<MessageListRef>(null);

  useEffect(() => {
    messageStore.fetchMessages()
      .then(() => {
        messageStore.initWebSocket();
      });
    return () => {
      // todo Code above is "promise", so it is possible to execute before it is created. It is a potential bug.
      messageStore.ws?.close();
    };
  }, []);

  const handleSendMessage = async (displayName: string, textContent: string) => {
    const response = await messageStore.sendMessage(displayName, textContent);
    if (response?.success) {
      listRef.current?.scrollToEnd();
    }
  };

  const handleScrollToEnd = () => {
    listRef.current?.scrollToEnd();
  }

  function handleAutoScroll(value: boolean) {
    setIsAutoScroll(value)
  }

  return (
    <Card
      title="Chat"
      extra={isAutoScroll ? null : (<ScrollDownButton onClick={handleScrollToEnd}/>)}
      cover={<MessageList messages={messageStore.messages} onAutoScroll={handleAutoScroll} ref={listRef}/>}
      style={{ maxWidth: 550, margin: "2rem auto" }}
    >
      <Space direction="vertical">
      <MessageError
        errorCode={messageStore.fetchError?.errorCode}
        errorMessage={messageStore.fetchError?.errorMessage}/>
      <MessageForm onMessageSend={handleSendMessage} formStatus={messageStore.status}/>
      </Space>
    </Card>
  );
});

export default App;
