import { MessageFormButtonProps } from "@/entities/Message/ui/MessageForm/MessageForm.types.ts";
import { useEffect, useState } from "react";
import { Button, Form } from "antd";

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
    <Button
      type="primary"
      htmlType="submit"
      disabled={!submittable || isPending}
    >
      Send
    </Button>
  );
};

export default SubmitButton;
