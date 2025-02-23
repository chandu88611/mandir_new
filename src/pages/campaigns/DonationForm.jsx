import React, { useState, useEffect } from 'react';
import {
  Modal,
  Button,
  Form,
  Input,
  Radio,
  Space,
  message,
  InputNumber,
} from 'antd';

const DonationForm = ({ open, handleClose }) => {
  const [form] = Form.useForm();
  const [amount, setAmount] = useState(1000); // Default donation amount

  const onSubmit = (values) => {
    console.log('Form values:', values);
    message.success('Donation successful');
    handleClose(); // Close modal after submission
  };

  return (
    <Modal open={open} onCancel={handleClose} footer={null} width={500}>
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <h2 className="text-xl font-semibold mb-4 text-center">Donate to Help</h2>
        
        {/* Donation Amount Options */}
        <Form.Item name="amount" label="Choose Amount" initialValue={amount}>
          <Radio.Group
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          >
            <Space>
              <Radio value={500}>₹ 500</Radio>
              <Radio value={1000}>₹ 1000</Radio>
              <Radio value={2000}>₹ 2000</Radio>
              <InputNumber
                min={1}
                style={{ width: 100 }}
                placeholder="Other Amount"
                onChange={(value) => setAmount(value)}
              />
            </Space>
          </Radio.Group>
        </Form.Item>

        {/* Full Name */}
        <Form.Item
          name="fullName"
          label="Full Name"
          rules={[{ required: true, message: 'Please enter your full name' }]}
        >
          <Input placeholder="Enter your full name" />
        </Form.Item>

        {/* Email Address */}
        <Form.Item
          name="email"
          label="Email Address"
          rules={[
            { required: true, message: 'Please enter your email address' },
            { type: 'email', message: 'Please enter a valid email address' },
          ]}
        >
          <Input placeholder="Enter your email address" />
        </Form.Item>

        {/* Phone Number */}
        <Form.Item
          name="phone"
          label="Phone Number"
          rules={[{ required: true, message: 'Please enter your phone number' }]}
        >
          <Input placeholder="Enter your phone number" />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            DONATE NOW
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DonationForm;
