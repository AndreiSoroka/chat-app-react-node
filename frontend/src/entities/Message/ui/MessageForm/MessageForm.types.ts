import {FormInstance} from "antd";

export type MessageFormProps = {
  onMessageSend: (displayName: string, textContent: string) => Promise<void>;
  formStatus: 'idle' | 'pending' | 'success' | 'error';
}

export type MessageFormButtonProps = { form: FormInstance; isPending: boolean }
