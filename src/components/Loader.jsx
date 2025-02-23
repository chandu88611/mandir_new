import React from "react";
import { Row, Spin } from "antd";

const Loader = () => {
  return (
    <Row
      style={{
        width: "100%",
        height: "100vh",
      }}
      justify={"center"}
      align={"middle"}
    >
      <Spin tip="Loading Session" size="large" />
    </Row>
  );
};

export default Loader;
