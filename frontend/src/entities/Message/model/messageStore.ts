import { makeAutoObservable } from "mobx";
import type {
  FetchError,
  Message,
  ResponseAddMessage,
  ResponseMessageList,
} from "./messageStore.types.ts";

// Temporary fix for reconnecting WebSocket after hot-reload
// need to read MobX docs to find a better solution
declare global {
  interface Window {
    __WEB_SOCKET__?: null | WebSocket;
  }
}

const WEBSOCKET_LIVE_STATUS: (number | undefined)[] = [
  WebSocket.OPEN,
  WebSocket.CONNECTING,
];

class MessageStore {
  messages: Message[] = [];
  messagesKeys = new Set<string>();
  lastTimestamp?: number;
  ws: WebSocket | null = window.__WEB_SOCKET__ || null;
  fetchError?: FetchError;
  status: "idle" | "pending" | "success" | "error" = "idle";

  constructor() {
    makeAutoObservable(this);

    this.initWebSocket();
  }

  initWebSocket() {
    if (
      window.__WEB_SOCKET__ &&
      WEBSOCKET_LIVE_STATUS.includes(window.__WEB_SOCKET__?.readyState)
    ) {
      this.ws = window.__WEB_SOCKET__;
      return;
    }

    if (WEBSOCKET_LIVE_STATUS.includes(this.ws?.readyState)) {
      return;
    }

    this.ws = new WebSocket(`ws://${window.location.host}/api/socket`);
    this.ws.onopen = this.handleWebSocketOpen.bind(this);
    this.ws.onmessage = this.handleWebSocketMessage.bind(this);
    this.ws.onclose = this.handleWebSocketClose.bind(this);
    window.__WEB_SOCKET__?.close();
    window.__WEB_SOCKET__ = this.ws;
  }

  handleWebSocketOpen() {
    // todo it is better to exchange messages using a socket, it will be easier to maintain. My mistake
    this.fetchMessages().then();
  }

  handleWebSocketMessage(event: MessageEvent) {
    const message: Message = JSON.parse(event.data);
    this.addMessage(message);
  }

  handleWebSocketClose() {
    // Try to reconnect in 3 second
    setTimeout(() => {
      this.initWebSocket();
    }, 3000);
  }

  async fetchMessages(): Promise<FetchError | ResponseMessageList | undefined> {
    if (this.status === "pending") {
      return;
    }
    this.setStatus("pending");

    const query = this.lastTimestamp ? `?timestamp=${this.lastTimestamp}` : "";
    try {
      const response = await fetch(`/api/message/list${query}`);
      if (!response.ok) {
        const error: FetchError = await response.json();
        this.setFetchError(error);
        return;
      }

      const data: ResponseMessageList = await response.json();
      if (this.lastTimestamp) {
        data.data.forEach(this.addMessage);
      } else {
        this.messages = data.data;
      }

      this.lastTimestamp = this.messages[this.messages.length - 1]?.timestamp;
      this.clearFetchError();
      this.setStatus("success");
      return data;
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      const customError: FetchError = {
        errorCode: -1,
        errorMessage: "Network error or unexpected error occurred.",
        status: 500,
        success: false,
      };
      this.setFetchError(customError);
      return customError;
    }
  }

  async sendMessage(
    displayName: string,
    textContent: string,
  ): Promise<FetchError | ResponseAddMessage | undefined> {
    if (this.status === "pending") {
      return;
    }
    this.setStatus("pending");

    try {
      const response = await fetch("/api/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          displayName,
          textContent,
        }),
      });
      if (!response.ok) {
        const error: FetchError = await response.json();
        this.setFetchError(error);
        return;
      }
      this.clearFetchError();
      this.setStatus("success");
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      const customError: FetchError = {
        errorCode: -1,
        errorMessage: "Network error or unexpected error occurred.",
        status: 500,
        success: false,
      };
      this.setFetchError(customError);
      return customError;
    }
  }

  addMessage(message: Message) {
    // Check duplicates by timestamp and nickname
    // P.s. From task requirements: I have only display name, text content and timestamp ¯\_(ツ)_/¯
    const messageId = `${message.timestamp}-${message.displayName}`;
    if (this.messagesKeys.has(messageId)) {
      return;
    }
    this.messagesKeys.add(messageId);

    // If message is newer than the last message in the list, add it to the end
    if (!this.lastTimestamp || message.timestamp > this.lastTimestamp) {
      this.messages.push(message);
      this.lastTimestamp = message.timestamp;
      return;
    }

    // If message is older than the last message in the list, find the correct place and add it
    for (let i = this.messages.length - 1; i >= 0; i--) {
      if (this.messages[i].timestamp <= message.timestamp) {
        this.messages.splice(i + 1, 0, message);
        break;
      }
    }
  }

  setFetchError(error: FetchError) {
    this.fetchError = error;
    this.setStatus("error");
  }

  clearFetchError() {
    this.fetchError = undefined;
  }

  setStatus(status: "idle" | "pending" | "success" | "error") {
    this.status = status;
  }
}

export default new MessageStore();
