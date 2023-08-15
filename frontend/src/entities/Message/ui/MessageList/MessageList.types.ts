export type MessageListRef = {
  scrollToEnd: () => void;
};

export type MessageListProps = {
  messages: {
    displayName: string;
    textContent: string;
    timestamp: number;
  }[];
  onAutoScroll?: (value: boolean) => void;
};
