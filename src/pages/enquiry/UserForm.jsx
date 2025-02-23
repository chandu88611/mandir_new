import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  Row,
  Select,
  TreeSelect,
  Typography,
} from "antd";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  useCreateUserMutation,
  useGetSingleUserQuery,
  useUpdateUserMutation,
} from "../../redux/services/users";

import PrimaryWrapper from "../../components/PrimaryWrapper";
import { useGetOrganizationsQuery } from "../../redux/services/organizations";

const UserForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form] = Form.useForm();

  const { data: organizations, isSuccess } = useGetOrganizationsQuery({
    page: 1,
  });

  const [createUser, { isLoading: creating, isSuccess: userCreateSuccess }] =
    useCreateUserMutation();

  const [
    updateUser,
    { error, isLoading: updatingUser, isSuccess: userUpdateSuccess },
  ] = useUpdateUserMutation();

  const { data, isLoading } = useGetSingleUserQuery(id, { skip: !id });

  const onFinish = (values) => {
    if (id) {
      updateUser({ id: id, ...values });
    } else {
      createUser({ ...values });
    }
  };

  useEffect(() => {
    if (userCreateSuccess || userUpdateSuccess) {
      navigate("/users");
    }
  }, [userCreateSuccess, userUpdateSuccess, navigate]);

  return (
    <PrimaryWrapper>
      <Row justify="center">
        <Col span={16}>
          {id ? (
            <Typography.Title level={3}>Update User</Typography.Title>
          ) : (
            <Typography.Title level={3}>Create User</Typography.Title>
          )}
        </Col>
      </Row>
      <Row justify="center">
        <Col span={16}>
          <Card loading={id && isLoading}>
            <Form
              form={form}
              onFinish={onFinish}
              layout="vertical"
              autoComplete="off"
              initialValues={
                data
                  ? {
                      ...data,
                      organization: data?.organization?._id,
                    }
                  : {}
              }
            >
              <Form.Item
                name="full_name"
                label="Full Name"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
              {organizations && (
                <Form.Item name="organization" label="Organization">
                  <Select placeholder="Select your Organization">
                    {organizations.results?.map((org) => (
                      <Option value={org._id}>{org.name}</Option>
                    ))}
                  </Select>
                </Form.Item>
              )}
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  {
                    required: true,
                    type: "email",
                  },
                ]}
              >
                <Input type="email" />
              </Form.Item>

              {!id && (
                <Form.Item
                  name="password"
                  label="Password"
                  rules={[{ required: true }]}
                >
                  <Input.Password
                    iconRender={(visible) =>
                      visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                  />
                </Form.Item>
              )}
              <Row justify="space-between">
                <Button danger onClick={() => window.history.back()}>
                  Cancel
                </Button>
                <Button
                  htmlType="submit"
                  loading={creating || updatingUser}
                  type="primary"
                >
                  {id ? "Update" : "Create"}
                </Button>
              </Row>
            </Form>
          </Card>
        </Col>
      </Row>
    </PrimaryWrapper>
  );
};

export default UserForm;
