import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ForgotPassword from './pages/ForgotPassword';
import Cart from './pages/Cart';
import Checkout from './pages/muahang';
import Profile from './pages/Profile';
import GioiThieu from './pages/GioiThieu';
import Size from './pages/Size';
import Header from './components/Header';
import Footer from './components/Footer';
import './styles/main.css';

const Layout = ({ children }) => (
  <div className="main-layout">
    <Header />
    {children}
    <Footer />
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product-detail" element={<ProductDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/gioi-thieu" element={<GioiThieu />} />
        <Route path="/size" element={<Size />} />
        <Route path="/cart" element={<Layout><Cart /></Layout>} />
        <Route path="/muahang" element={<Layout><Checkout /></Layout>} />
        <Route path="/login" element={<Layout><Login /></Layout>} />
        <Route path="/signup" element={<Layout><SignUp /></Layout>} />
        <Route path="/forgot-password" element={<Layout><ForgotPassword /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;
