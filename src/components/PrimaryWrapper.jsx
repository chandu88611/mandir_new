import { Col, Row } from "antd";
import React from "react";

const PrimaryWrapper = ({ children }) => {
  return (
    <Row justify={"center"} style={{ paddingTop: "10px" }}>
      <Col style={{ width: "900px" }}>{children}</Col>
    </Row>
  );
};

export default PrimaryWrapper;
