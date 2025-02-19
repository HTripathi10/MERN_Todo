import { Dropdown } from 'antd';
import { CheckCircleOutlined, UserOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserDetails } from '../util/GetUser';
import './Navbar.css';

function Navbar({ active }) {
  const [user, setUser] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const userDetails = getUserDetails();
    setUser(userDetails);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('todoAppUser');
    navigate('/login');
  };

  const items = [
    {
      key: '1',
      label: (<span onClick={() => navigate('/reset-password')}>Update Profile</span>),
    },
    {
      key: '2',
      label: (<span onClick={handleLogout}>Logout</span>),
    },
  ];

  return (
    <header className="navbar">
      <nav className="navbar-container">
        {/* Left side: Icon and Todo text */}
        <div className="navbar-left">
          <div className="navbar-icon">
            <CheckCircleOutlined />
          </div>
          <h4 className="navbar-title">Todo</h4>
        </div>

        {/* Right side: Links/Buttons */}
        <ul className="navbar-right">
          <li>
            <Link to='/' className="navbar-link home">
              Home
            </Link>
          </li>
          {user && (
            <li>
              <Link to='/to-do-list' className="navbar-link task">
                My Task
              </Link>
            </li>
          )}
          {user ? (
            <Dropdown menu={{ items }} placement="bottom" arrow>
              <div className="user-dropdown">
                <div className="user-icon">
                  <UserOutlined />
                </div>
                <span className="user-name">
                  {user?.firstName ? `Hello, ${user?.firstName} ${user?.lastName}` : user?.username}
                </span>
              </div>
            </Dropdown>
          ) : (
            <>
              <li>
                <Link to='/login' className="navbar-link login">
                  Login
                </Link>
              </li>
              <li>
                <Link to='/register' className="navbar-link register">
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Navbar;