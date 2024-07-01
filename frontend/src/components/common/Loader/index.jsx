import { Button, Spin } from "antd";
import React from "react";

function Loading() {
  const [spinning, setSpinning] = React.useState(false);

  const showLoader = () => {
    setSpinning(true);
    setTimeout(() => {
      setSpinning(false);
    }, 3000);
  };

  return (
    <>
      <Button onClick={showLoader}>Show fullscreen for 3s</Button>
      <Spin spinning={spinning} fullscreen />
    </>
  );
}

export default Loading;
