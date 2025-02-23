import React from "react";

import {
  Button,
  Image,
  Col,
  Form,
  Input,
  Row,
  Typography,
  Alert,
  Space,
} from "antd";
import { Spin } from "antd";

import { useForgotPasswordMutation } from "../../redux/services/auth";
import { LoadingOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [forgotPassword, { isLoading, error, isSuccess }] =
    useForgotPasswordMutation();
  const onFinish = async (values) => {
    await forgotPassword(values);
  };

  return (
    <Row justify={"center"} align="stretch" style={{ height: "100vh" }}>
      <Col span={9}>
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Row
            justify={"center"}
            align={"middle"}
            gutter={[0, 30]}
            style={{ width: "100%" }}
          >
            {isLoading || isSuccess ? (
              <Row justify={"center"} gutter={[0, 20]}>
                {isLoading && (
                  <Spin
                    indicator={
                      <LoadingOutlined
                        style={{
                          fontSize: 70,
                        }}
                        spin
                      />
                    }
                  />
                )}
                <Col span={24}>
                  <Row justify={"center"} span={24}>
                    <Space direction="vertical" size={[0, 2]} align="center">
                      <Typography.Title
                        level={3}
                        style={{ margin: "0px", textAlign: "center" }}
                      >
                        Check your Mail
                      </Typography.Title>
                      <Row justify={"center"}>
                        <Typography.Paragraph
                          level={4}
                          style={{ margin: "0px", textAlign: "center" }}
                        >
                          Link to change password has been successfully sent{" "}
                          <br /> to your Email
                        </Typography.Paragraph>
                      </Row>
                    </Space>
                  </Row>
                </Col>
              </Row>
            ) : (
              <Col span={20}>
                <Form
                  style={{ width: "100%" }}
                  initialValues={{ remember: true }}
                  onFinish={onFinish}
                >
                  <Row
                    justify={"center"}
                    gutter={[0, 25]}
                    style={{ width: "100%" }}
                  >
                    <Col span={24}>
                      <Row justify={"center"}>
                        <Col span={20}>
                          <Typography.Title
                            style={{ textAlign: "center" }}
                            level={2}
                          >
                            Forgot Password?
                          </Typography.Title>
                          <Typography.Paragraph
                            type="secondary"
                            style={{ textAlign: "center" }}
                          >
                            Enter the email associated with your account and
                            we’ll send an email with instructions to reset your
                            password
                          </Typography.Paragraph>
                          <Typography.Paragraph
                            className="text"
                            type="danger"
                            style={{ textAlign: "center", margin: "0px" }}
                          >
                            {error && error?.data?.message}
                          </Typography.Paragraph>
                        </Col>
                      </Row>
                    </Col>
                    <Col span={22}>
                      <Form.Item
                        name="email"
                        rules={[
                          {
                            required: true,
                          },
                        ]}
                      >
                        <Input placeholder="Email" size="large" />
                      </Form.Item>
                      {false && (
                        <Form.Item style={{ color: "red", marginTop: "-15px" }}>
                          <Alert
                            message="Invalidate Credentials"
                            type="error"
                            style={{ color: "red" }}
                          />
                        </Form.Item>
                      )}

                      <Form.Item>
                        <Button
                          size="large"
                          block
                          type="primary"
                          htmlType="submit"
                          // loading={isLoading} Never mind! Take me back to login
                        >
                          Send Instructions
                        </Button>
                        <Typography.Paragraph
                          style={{ textAlign: "center", marginTop: "10px" }}
                          type="secondary"
                        >
                          Never mind!{" "}
                          <Link className="login-form-forgot" to="/login">
                            Take me back to login
                          </Link>
                        </Typography.Paragraph>
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Col>
            )}
          </Row>
        </div>
      </Col>
    </Row>
  );
};

export default ForgotPassword;
