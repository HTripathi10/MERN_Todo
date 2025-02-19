import React, { useState } from 'react'
import {Button, Input, message} from 'antd'
import { Link, useNavigate } from 'react-router';
import Authservices from '../../services/authServices';
import { getErrorMessage } from '../../util/GetError';
import { LockOutlined } from '@ant-design/icons';
import './Login.css';

function Login() {

    const[username,setUsername] = useState("");
    const[password,setPassword] = useState("");
    const[loading,setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async () => {
        try {
            setLoading(true);
            let data = {
                username,
                password
            }
            const response = await Authservices.loginUser(data);
            console.log(response.data);
            localStorage.setItem('todoAppUser',JSON.stringify(response.data));
            message.success("Logged in successfully!");
            navigate('/to-do-list');
            setLoading(false);
        } catch (err) {
            console.log(err);
            message.error(getErrorMessage(err));
            setLoading(false);
        }
    }

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <h4 className="login-title">Login</h4>
          <div className="login-icon">
            <LockOutlined />
          </div>
        </div>
        
        <div className="login-form">
          <Input 
            placeholder="Username" 
            value={username} 
            onChange={(e)=>setUsername(e.target.value)}
            className="login-input"
          />
          <Input.Password 
            placeholder="Password" 
            value={password} 
            onChange={(e)=>setPassword(e.target.value)}
            className="login-input"
          />
        </div>

        <div className="login-link">
          <span>New User? </span>
          <Link to='/register'>
            Register
          </Link>
        </div>

        <Button 
          loading={loading} 
          type='primary' 
          size='large' 
          disabled={!username || !password} 
          onClick={handleSubmit}
          className="login-button"
        >
          Login
        </Button>
      </div>
    </div>
  )
}

export default Login