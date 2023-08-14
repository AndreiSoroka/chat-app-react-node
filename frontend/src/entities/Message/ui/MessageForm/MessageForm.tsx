import {useEffect, useMemo, useRef, useState} from 'react';
import type { FormInstance } from 'antd';
import {Button, Form, Input, InputRef} from 'antd';

type MessageFormProps = {
  onMessageSend: (displayName: string, textContent: string) => Promise<void>;
  formStatus: 'idle' | 'pending' | 'success' | 'error';
}
type MessageFormButtonProps = { form: FormInstance; isPending: boolean }

const SubmitButton = ({ form, isPending }: MessageFormButtonProps) => {
  const [submittable, setSubmittable] = useState(false);

  const values = Form.useWatch([], form);

  useEffect(() => {
    form.validateFields({ validateOnly: true }).then(
      () => {
        setSubmittable(true);
      },
      () => {
        setSubmittable(false);
      },
    );
  }, [form, values]);

  return (
    <Button type="primary" htmlType="submit" disabled={!submittable || isPending}>
      Send
    </Button>
  );
};

const MessageForm = ({ onMessageSend, formStatus }: MessageFormProps) => {
  const [form] = Form.useForm();
  const textContentRef = useRef<InputRef>(null);


  useEffect(() => {
    if (formStatus === "success") {
      form.resetFields(['textContent']);
    }
  }, [formStatus, form]);

  const isPending = useMemo(() => formStatus === "pending", [formStatus] );

  const handleSubmit = async (values: { displayName: string; textContent: string }) => {
    await onMessageSend(values.displayName, values.textContent);
    textContentRef.current?.focus();
  };

  return (
    <Form form={form} layout="inline" onFinish={handleSubmit}>
      <Form.Item name="displayName" rules={[{ required: true, message: 'Please input your Display Name!' }]}>
        <Input placeholder="Display Name" readOnly={isPending} />
      </Form.Item>
      <Form.Item name="textContent" rules={[{ required: true, message: 'Please input your Message!' }]}>
        <Input placeholder="Message" ref={textContentRef} readOnly={isPending} />
      </Form.Item>
      <Form.Item>
        <SubmitButton form={form} isPending={isPending} />
      </Form.Item>
    </Form>
  );
};

export default MessageForm;
