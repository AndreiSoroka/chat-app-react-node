import {useRef, useState} from "react";
import {observer} from "mobx-react-lite";
import {MessageList, messageStore, ScrollDownButton, type MessageListRef} from "@/entities/Message";
import {SendMessage} from "@/features/SendMessage";
import {Card} from "antd";
import NoMessages from "../../entities/Message/ui/NoMessages/NoMessages.tsx";

const Chat = observer(() => {
  const [isAutoScroll, setIsAutoScroll] = useState(true);
  const listRef = useRef<MessageListRef>(null);

  const handleScrollToEnd = () => {
    listRef.current?.scrollToEnd();
  }

  return (
    <Card
      title="Chat"
      extra={isAutoScroll ? null : (<ScrollDownButton onClick={handleScrollToEnd}/>)}
      cover={
        messageStore.messages.length
          ? <MessageList messages={messageStore.messages} onAutoScroll={setIsAutoScroll} ref={listRef}/>
          : <NoMessages/>
      }
    >
      <SendMessage onClickScrollToEnd={handleScrollToEnd}/>
    </Card>
  );
});

export default Chat;
