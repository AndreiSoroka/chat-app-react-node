import {makeAutoObservable, runInAction} from "mobx";
import type {FetchError, Message, ResponseAddMessage, ResponseMessageList} from "./messageStore.types.ts";

class MessageStore {
  messages: Message[] = [];
  lastTimestamp?: number;
  ws: WebSocket | null = null;
  fetchError?: FetchError;
  status: "idle" | "pending" | "success" | "error" = "idle";

  constructor() {
    makeAutoObservable(this);
  }

  initWebSocket() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }
    this.ws = new WebSocket(`ws://${window.location.host}/api/socket`);
    this.ws.onmessage = this.handleWebSocketMessage;
    this.ws.onclose = this.handleWebSocketClose;
  }

  handleWebSocketMessage = (event: MessageEvent) => {
    const message: Message = JSON.parse(event.data);
    runInAction(() => {
      this.addMessage(message);
    });
  };

  handleWebSocketClose = () => {
    // Try to reconnect in 1 second
    setTimeout(() => {
      this.fetchMessages().then(() => {
        this.initWebSocket();
      });
    }, 1000);
  };

  async fetchMessages(): Promise<FetchError | ResponseMessageList | undefined> {
    if (this.status === "pending") {
      return;
    }
    runInAction(() => {
      this.setStatus("pending");
    });
    const query = this.lastTimestamp ? `?timestamp=${this.lastTimestamp}` : '';
    try {
      const response = await fetch(`/api/message/list${query}`);
      if (!response.ok) {
        const error: FetchError = await response.json();
        runInAction(() => {
          this.setFetchError(error);
        });
        return;
      }
      const data: ResponseMessageList = await response.json();
      runInAction(() => {
        if (this.lastTimestamp) {
          this.messages.push(...data.data);
        } else {
          this.messages = data.data;
        }
        this.lastTimestamp = this.messages[this.messages.length - 1]?.timestamp;
        this.clearFetchError();
        this.setStatus("success");
      });
      return data;
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      const customError: FetchError = {
        errorCode: -1,
        errorMessage: 'Network error or unexpected error occurred.',
        status: 500,
        success: false
      }
      runInAction(() => {
        this.setFetchError(customError);
      });
      return customError;
    }
  }

  async sendMessage(displayName: string, textContent: string): Promise<FetchError | ResponseAddMessage | undefined> {
    if (this.status === "pending") {
      return;
    }
    runInAction(() => {
      this.setStatus("pending");
    });

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
        runInAction(() => {
          this.setFetchError(error);
        });
        return;
      }
      runInAction(() => {
        this.clearFetchError();
        this.setStatus("success");
      });
      return await response.json();
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      const customError: FetchError = {
        errorCode: -1,
        errorMessage: 'Network error or unexpected error occurred.',
        status: 500,
        success: false
      }
      runInAction(() => {
        this.setFetchError(customError);
      });
      return customError;
    }
  }

  addMessage(message: Message) {
    if (!this.lastTimestamp || message.timestamp > this.lastTimestamp) {
      this.messages.push(message);
      this.lastTimestamp = message.timestamp;
      return;
    }

    // If message is older than the last message in the list, find the correct
    for (let i = this.messages.length - 1; i >= 0; i--) {
      if (this.messages[i].timestamp <= message.timestamp) {
        this.messages.splice(i + 1, 0, message);
        break;
      }
    }
  }

  setFetchError(error: FetchError) {
    this.fetchError = error;
    this.setStatus("error")
  }

  clearFetchError() {
    this.fetchError = undefined;
  }

  setStatus(status: "idle" | "pending" | "success" | "error") {
    this.status = status;
  }
}

export default new MessageStore();
