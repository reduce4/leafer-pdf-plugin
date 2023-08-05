import { Button, Space } from "antd";
const OperationButtons = ({ onPrev, onNext, onEnlarge, onShrink }) => {
  return (
    <>
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 999,
        }}
      >
        <Space>
          <Button onClick={() => onPrev()}>上一页</Button>
          <Button onClick={() => onNext()}>下一页</Button>
          <Button onClick={() => onShrink()}>缩小</Button>
          <Button onClick={() => onEnlarge()}>放大</Button>
        </Space>
      </div>
    </>
  );
};
export default OperationButtons;
