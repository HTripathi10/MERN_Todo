import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import authServices from '../../services/authServices';
import { getUserDetails } from '../../util/GetUser';
import { KeyOutlined } from '@ant-design/icons';
import './ResetPassword.css';

const ResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = getUserDetails();

  const onFinish = async (values) => {
    try {
      setLoading(true);
      const { newPassword } = values;
      const userDetails = getUserDetails();
      if (!userDetails || !userDetails.userId) {
        throw new Error('User session expired');
      }
      await authServices.resetPassword({ 
        userId: userDetails.userId, 
        newPassword 
      });
      message.success('Password updated successfully');
      navigate('/');
    } catch (error) {
      message.error(error.response?.data?.message || 'Password update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-box">
        <div className="reset-password-header">
          <h2 className="reset-password-title">Update Password</h2>
          <div className="reset-password-icon">
            <KeyOutlined />
          </div>
        </div>
        <Form
          name="reset-password"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            label={<span className="reset-password-label">New Password</span>}
            name="newPassword"
            rules={[
              { required: true, message: 'Please input your new password!' }
            ]}
          >
            <Input.Password className="reset-password-input" />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              className="reset-password-button"
            >
              Update Password
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ResetPassword;
