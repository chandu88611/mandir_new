import React, { useContext, useEffect, useState } from "react";
import { Alert, Button, Col, Form, Image, Input, Row, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
// import { AuthContext } from "../../providers/AuthProvider";

const Login = () => {
  const navigate = useNavigate();

  const [error, setError] = useState(false);

  const onFinish = async (values) => {
    const validUser =
      values?.email === "admin@admin.com" && values?.password === "admin123";

    if (validUser) {
      sessionStorage.setItem("auth", true);
      navigate("/campaigns");
    } else {
      setError(true);
    }
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
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <Row
            justify={"center"}
            align={"center"}
            gutter={[0, 30]}
            style={{ width: "100%" }}
          >
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
                    <Typography.Title style={{ textAlign: "center" }} level={2}>
                      Login
                    </Typography.Title>
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
                    <Form.Item
                      name="password"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Input.Password
                        type="password"
                        size="large"
                        placeholder="Password"
                      />
                    </Form.Item>

                    {error && (
                      <Form.Item style={{ color: "red", marginTop: "-15px" }}>
                        <Alert
                          message="Invalid Credentials"
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
                        // loading={isLoading}
                      >
                        Log in
                      </Button>

                      {/* <Link className="login-form-forgot" to="/forgot-password">
                        <Typography.Paragraph
                          style={{ textAlign: "center", marginTop: "10px" }}
                          type="secondary"
                        >
                          Forgot your password ?
                        </Typography.Paragraph>
                      </Link> */}
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </div>
      </Col>
    </Row>
  );
};

export default Login;
