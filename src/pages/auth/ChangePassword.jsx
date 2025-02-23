import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Input, Flex, Typography } from "antd";
import { useChangePasswordMutation } from "../../redux/services/auth";

const ChangePasswordModal = ({ openModal, setOpenModal }) => {
  const [form] = Form.useForm();

  const [changePassword, { isSuccess, isLoading, isError, error }] =
    useChangePasswordMutation();

  const onFinish = async (values) => {
    await changePassword(values);
  };

  //   useEffect(() => {
  //     if (isSuccess && !isError) {
  //       setOpenModal(false);
  //       form.resetFields();
  //     }
  //   }, [isSuccess, isError, setOpenModal, form]);

  return (
    <Modal
      open={openModal}
      footer={null}
      onCancel={() => setOpenModal(false)}
      centered
    >
      <Flex gap={10} vertical>
        <Typography.Title level={4}>Change Password</Typography.Title>
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
          onFinish={onFinish}
        >
          <Form.Item
            label="Old Password"
            name="old_password"
            rules={[
              {
                required: true,
                message: "Please input your old password!",
              },
            ]}
          >
            <Input.Password
              type="password"
              size="large"
              placeholder="Old Password"
            />
          </Form.Item>
          <Form.Item
            name="new_password"
            label="New Password"
            rules={[{ required: true }]}
          >
            <Input.Password
              type="password"
              size="large"
              placeholder="New Password"
            />
          </Form.Item>
          <Form.Item
            name="confirm_password"
            label="Confirm Password"
            dependencies={["new_password"]}
            rules={[
              { required: true },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("new_password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The two passwords do not match!")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              type="password"
              size="large"
              placeholder="Confirm Password"
            />
          </Form.Item>
          <Flex gap={10} justify="end">
            <Button onClick={() => setOpenModal(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Change Password
            </Button>
          </Flex>
        </Form>
      </Flex>
    </Modal>
  );
};

export default ChangePasswordModal;
