import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/main.css';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Fake login: luôn thành công
    localStorage.setItem('currentUser', JSON.stringify({ username }));
    navigate('/profile');
  };

  return (
    <div className="login-page">
      <form onSubmit={handleSubmit}>
        <h2 className="login-title">Đăng nhập</h2>
        <div className="login-field">
          <label>Email</label>
          <input
            type="email"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Nhập email"
            required
            className="login-input"
          />
        </div>
        <div className="login-field">
          <label>Mật khẩu</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Nhập mật khẩu"
            required
            className="login-input"
          />
        </div>
        <div className="login-links">
          <Link to="/forgot-password" className="login-link">Quên mật khẩu?</Link>
          <Link to="/signup" className="login-link">Đăng ký tài khoản</Link>
        </div>
        <button className="btn btn-primary login-btn" type="submit">Đăng nhập</button>
      </form>
    </div>
  );
};

export default Login; 