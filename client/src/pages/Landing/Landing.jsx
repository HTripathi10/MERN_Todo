import React from 'react'
import Navbar from '../../components/Navbar'
import { Link } from 'react-router'
import { CheckCircleOutlined, CalendarOutlined, TeamOutlined } from '@ant-design/icons'
import './Landing.css'

function Landing() {
  return (
    <div className="landing-container">
        <Navbar active={"home"}/>
        <div className="landing-content">
            <div className="landing-text">
                <h1 className="landing-title">
                    Schedule your daily tasks with ToDo!
                </h1>
                <div className="landing-buttons">
                    <Link 
                        to="/register" 
                        className="landing-button-primary"
                    >
                        Register
                    </Link>
                    <Link 
                        to="/login" 
                        className="landing-button-secondary"
                    >
                        Login
                    </Link>
                </div>
            </div>
            <div className="features-section">
                <div className="features-box">
                    <h2 className="features-title">
                        Why Choose ToDo?
                    </h2>
                    <div className="features-list">
                        <div className="feature-item">
                            <CheckCircleOutlined className="feature-icon check" />
                            <span>Easy task management</span>
                        </div>
                        <div className="feature-item">
                            <CalendarOutlined className="feature-icon calendar" />
                            <span>Deadline tracking</span>
                        </div>
                        <div className="feature-item">
                            <TeamOutlined className="feature-icon team" />
                            <span>Collaboration features</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Landing
