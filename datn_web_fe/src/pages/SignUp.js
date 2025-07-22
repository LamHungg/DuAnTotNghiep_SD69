import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/main.css';

const passwordChecks = [
  { label: 'Ít nhất 8 ký tự', test: v => v.length >= 8 },
  { label: 'Có chữ in hoa', test: v => /[A-Z]/.test(v) },
  { label: 'Có số', test: v => /[0-9]/.test(v) },
  { label: 'Có ký tự đặc biệt', test: v => /[^A-Za-z0-9]/.test(v) },
];

const SignUp = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isValid = passwordChecks.every(c => c.test(form.password));

  return (
    <div className="signup-page">
      <form className="signup-form-box">
        <h2 className="signup-title">Tạo tài khoản</h2>
        <p className="signup-sub">Tham gia để bắt đầu mua sắm cùng chúng tôi</p>
        <div className="signup-row">
          <div className="signup-field">
            <label>Họ</label>
            <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="Nhập họ" className="signup-input" />
          </div>
          <div className="signup-field">
            <label>Tên</label>
            <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Nhập tên" className="signup-input" />
          </div>
        </div>
        <div className="signup-field">
          <label>Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Nhập email" className="signup-input" />
        </div>
        <div className="signup-field">
          <label>Mật khẩu</label>
          <div className="signup-password-wrap">
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange}
              placeholder="Tạo mật khẩu"
              className="signup-input"
            />
            <span className="signup-eye" onClick={() => setShowPassword(v => !v)}>{showPassword ? '🙈' : '👁️'}</span>
          </div>
        </div>
        <div className="signup-checklist">
          {passwordChecks.map((c, idx) => (
            <div key={idx} className={c.test(form.password) ? 'check-ok' : 'check-no'}>
              {c.test(form.password) ? '✔' : '✖'} {c.label}
            </div>
          ))}
        </div>
        <div className="signup-field">
          <label>Xác nhận mật khẩu</label>
          <div className="signup-password-wrap">
            <input
              name="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Nhập lại mật khẩu"
              className="signup-input"
            />
            <span className="signup-eye" onClick={() => setShowConfirm(v => !v)}>{showConfirm ? '🙈' : '👁️'}</span>
          </div>
        </div>
        <button className="btn btn-primary signup-btn" type="submit" disabled={!isValid}>Tạo tài khoản</button>
        <div className="signup-links">
          <Link to="/forgot-password" className="signup-link">Quên mật khẩu?</Link>
          <span className="signup-link-text">Đã có tài khoản?</span>
          <a href="/login" className="signup-link">Đăng nhập</a>
        </div>
      </form>
    </div>
  );
};

export default SignUp; 