import { ArrowDownOutlined } from "@ant-design/icons";
import { Button } from "antd";
import type { ScrollDownButtonProps } from "./ScrollDownButton.types";

const ScrollDownButton = ({ onClick }: ScrollDownButtonProps) => {
  return (
    <Button icon={<ArrowDownOutlined />} onClick={onClick}>
      Scroll
    </Button>
  );
};

export default ScrollDownButton;
