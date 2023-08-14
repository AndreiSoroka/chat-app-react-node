import {ArrowDownOutlined} from "@ant-design/icons";
import {Button} from "antd";


const ScrollDownButton = ({onClick}: {
  onClick: () => void;
}) => {
  return (
    <Button icon={<ArrowDownOutlined/>} onClick={onClick}>
      Scroll
    </Button>
  );
}

export default ScrollDownButton;
