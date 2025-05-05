import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./login.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock, faEye } from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/logo.png';

function Login() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/admin/dashboard');
  };

  return (
    <div className="wrapper">
      <div className="login-container login-background">
      <div className="login-form-container">
      <img src={logo} alt="Logo" className="logo-login" />
      <form className="login-form">
          <h5 className="system-label">POINT OF SALE SYSTEM</h5>
          <h1 className="login-title">LOGIN</h1>

          <div className="input-group">
            <FontAwesomeIcon icon={faUser} className="icon" />
            <input type="text" placeholder="Username" />
          </div>

          <div className="input-group">
            <FontAwesomeIcon icon={faLock} className="icon" />
            <input type="password" placeholder="Password" />
            <FontAwesomeIcon icon={faEye} className="eye-icon" />
          </div>

          <button 
            type="button" 
            className="login-button" 
            onClick={handleLoginClick}
          >
            LOGIN
          </button>

          <p className="forgot-password">
            Forgot Password? <a href="#login">Reset Here</a>
          </p>
        </form>
        </div>
      </div>
    </div>
  )
}

export default Login
