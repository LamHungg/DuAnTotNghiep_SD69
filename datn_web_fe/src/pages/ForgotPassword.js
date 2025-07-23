import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/main.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  return (
    <div className="forgot-page">
      <form className="forgot-form-box">
        <button type="button" className="forgot-back-btn" onClick={() => navigate(-1)}>&larr; Quay lại</button>
        <h2 className="forgot-title">Quên mật khẩu</h2>
        <p className="forgot-desc">Nhập email của bạn để lấy lại mật khẩu</p>
        <div className="forgot-field">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Nhập email"
            required
            className="forgot-input"
          />
        </div>
        <button className="btn btn-primary forgot-btn" type="submit">Tiếp tục</button>
      </form>
    </div>
  );
};

export default ForgotPassword; 