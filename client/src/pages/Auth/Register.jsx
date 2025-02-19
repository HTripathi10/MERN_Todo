import React, { useState } from 'react'
import { Button, Input, message } from 'antd'
import { UserAddOutlined } from '@ant-design/icons'
import { Link, useNavigate } from 'react-router';
import { getErrorMessage } from '../../util/GetError';
import Authservices from '../../services/authServices';
import './Register.css';

function Register() {
    const[username,setUsername] = useState("");
    const[password,setPassword] = useState("");
    const[firstName,setFirstName] = useState("");
    const[lastName,setLastName] = useState("");
    const[loading,setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async () => {
        try {
            setLoading(true);
            const data = {
                firstName,
                lastName,
                username,
                password
            }
            const response = await Authservices.registerUser(data);
            console.log(response.data);
            
            setLoading(false);
            message.success('You are registered successfully!');
            navigate('/login');
        } catch (err) {
            console.log(err);
            message.error(getErrorMessage(err));
        }
    }

  return (
    <div className="register-container">
      <div className="register-box">
        <div className="register-header">
          <h4 className="register-title">Register</h4>
          <div className="register-icon">
            <UserAddOutlined />
          </div>
        </div>
        
        <div className="register-form">
          <Input 
            placeholder="First Name" 
            value={firstName} 
            onChange={(e)=>setFirstName(e.target.value)}
            className="register-input"
          />
          <Input 
            placeholder="Last Name" 
            value={lastName} 
            onChange={(e)=>setLastName(e.target.value)}
            className="register-input"
          />
          <Input 
            placeholder="Username" 
            value={username} 
            onChange={(e)=>setUsername(e.target.value)}
            className="register-input"
          />
          <Input.Password 
            placeholder="Password" 
            value={password} 
            onChange={(e)=>setPassword(e.target.value)}
            className="register-input"
          />
        </div>

        <div className="register-link">
          <span>Existing User? </span>
          <Link to='/login'>
            Login
          </Link>
        </div>

        <Button 
          type='primary'
          loading={loading} 
          size='large' 
          disabled={!firstName || !lastName || !username || !password} 
          onClick={handleSubmit}
          className="register-button"
        >
          Register
        </Button>
      </div>
    </div>
  )
}

export default Register