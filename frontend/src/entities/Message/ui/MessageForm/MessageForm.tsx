import { useEffect, useMemo, useRef } from "react";
import { Form, Input, InputRef } from "antd";
import { MessageFormProps } from "./MessageForm.types.ts";
import SubmitButton from "./SubmitButton.tsx";

const MessageForm = ({ onMessageSend, formStatus }: MessageFormProps) => {
  const [form] = Form.useForm();
  const textContentRef = useRef<InputRef>(null);

  useEffect(() => {
    if (formStatus === "success") {
      form.resetFields(["textContent"]);
    }
  }, [formStatus, form]);

  const isPending = useMemo(() => formStatus === "pending", [formStatus]);

  const handleSubmit = async (values: {
    displayName: string;
    textContent: string;
  }) => {
    await onMessageSend(values.displayName, values.textContent);
    textContentRef.current?.focus();
  };

  return (
    <Form
      autoComplete="off"
      form={form}
      layout="inline"
      onFinish={handleSubmit}
    >
      <Form.Item
        name="displayName"
        rules={[{ required: true, message: "Please input your Display Name!" }]}
      >
        <Input placeholder="Display Name" readOnly={isPending} />
      </Form.Item>
      <Form.Item
        name="textContent"
        rules={[{ required: true, message: "Please input your Message!" }]}
      >
        <Input
          placeholder="Message"
          ref={textContentRef}
          readOnly={isPending}
        />
      </Form.Item>
      <Form.Item>
        <SubmitButton form={form} isPending={isPending} />
      </Form.Item>
    </Form>
  );
};

export default MessageForm;
