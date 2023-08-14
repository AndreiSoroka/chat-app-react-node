import {observer} from "mobx-react-lite";
import VirtualList, {ListRef} from 'rc-virtual-list';
import {Avatar, List} from "antd";
import {
  type ForwardedRef,
  forwardRef,
  type UIEventHandler,
  useImperativeHandle,
  useLayoutEffect,
  useRef
} from "react";
import {toJS} from "mobx";
import type {MessageListProps, MessageListRef} from "./MessageList.types.ts";

const MessageList = observer(forwardRef(({
  messages,
  onAutoScroll
}: MessageListProps, ref: ForwardedRef<MessageListRef>) => {
  const isAutoScroll = useRef(true);
  const listRef = useRef<ListRef>(null);
  const cloneMessages = toJS(messages);

  const scrollToEnd = () => {
    listRef.current?.scrollTo(9999999999);
  }

  useImperativeHandle(ref, () => ({
    scrollToEnd
  }));

  useLayoutEffect(() => {
      if (isAutoScroll.current) {
        scrollToEnd();
      }
    },
    [cloneMessages]
  );


  const onScroll: UIEventHandler<HTMLElement> = (e) => {
    const {scrollTop, scrollHeight, clientHeight} = e.currentTarget;
    isAutoScroll.current = scrollHeight - scrollTop === clientHeight;
    onAutoScroll?.(isAutoScroll.current);
  }

  return (
    <List>
      <VirtualList
        data={cloneMessages}
        height={400}
        itemKey="timestamp"
        onScroll={onScroll}
        ref={listRef}
      >{(item) => (
        <List.Item
          style={{padding: '12px 24px'}}
          extra={
          <div>{new Date(item.timestamp).toLocaleString(undefined, {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}</div>
        }>
          <List.Item.Meta
            avatar={<Avatar src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=${item.displayName}`}/>}
            title={item.displayName}
            description={item.textContent}
          />
        </List.Item>
      )}</VirtualList>
    </List>
  );
}));

export default MessageList;
