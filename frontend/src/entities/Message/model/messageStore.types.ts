export type Message = {
  displayName: string;
  textContent: string;
  timestamp: number;
};

export type ResponseMessageList = {
  success: boolean;
  count: number;
  data: Message[];
};
export type ResponseAddMessage = {
  success: true;
  data: Message[];
};

export type FetchError = {
  errorCode: number;
  errorMessage: string;
  status: number;
  success: false;
};
