import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/main.css';
import { useLocation, useNavigate } from 'react-router-dom';

const defaultProduct = {
  name: 'Áo Khoác Len Local Brand Unisex ZMEN "Simple love with ZMEN" AK125',
  price: 299000,
  oldPrice: 600000,
  images: [
    'https://product.hstatic.net/200000690725/product/ak125-1.jpg',
    'https://product.hstatic.net/200000690725/product/ak125-2.jpg',
    'https://product.hstatic.net/200000690725/product/ak125-3.jpg',
    'https://product.hstatic.net/200000690725/product/ak125-4.jpg',
    'https://product.hstatic.net/200000690725/product/ak125-5.jpg',
    'https://product.hstatic.net/200000690725/product/ak125-6.jpg',
  ],
  colors: [
    { name: 'Trắng', code: '#f8f8f8' },
    { name: 'Đen', code: '#222' },
  ],
  sizes: ['M', 'L', 'XL'],
  inStock: true,
  description: 'Áo khoác len local brand unisex, chất liệu cao cấp, form rộng, phù hợp nam nữ.',
};

const similarProducts = [
  { name: 'Áo Thun Wash Local Brand Unisex', price: 290000, oldPrice: 400000, image: 'https://product.hstatic.net/200000690725/product/ts326-1.jpg', colors: ['#222', '#f8f8f8'] },
  { name: 'Áo Thun Local Brand Unisex Teelab Star Tshirt TS326', price: 210000, oldPrice: 350000, image: 'https://product.hstatic.net/200000690725/product/ts326-2.jpg', colors: ['#222'] },
  { name: 'Áo Thun Local Brand Unisex Teelab Basic Tshirt TS324', price: 210000, oldPrice: 350000, image: 'https://product.hstatic.net/200000690725/product/ts324-1.jpg', colors: ['#f8f8f8', '#222', '#bfa16c'] },
  { name: 'Áo Hoodie Local Brand Unisex Zipup Teelab Classic', price: 350000, oldPrice: 658000, image: 'https://product.hstatic.net/200000690725/product/hd119-1.jpg', colors: ['#222', '#f8f8f8'] },
];

const fakeReviews = [
  {
    user: 'Nguyễn Văn A',
    rating: 5,
    comment: 'Sản phẩm rất đẹp, chất lượng tốt, giao hàng nhanh!',
    date: '2024-05-01',
  },
  {
    user: 'Trần Thị B',
    rating: 4,
    comment: 'Áo mặc vừa vặn, sẽ ủng hộ lần sau.',
    date: '2024-05-02',
  },
  {
    user: 'Lê Văn C',
    rating: 5,
    comment: 'Shop tư vấn nhiệt tình, sản phẩm đúng mô tả.',
    date: '2024-05-03',
  },
];

const fakeQAs = [
  {
    user: 'Minh',
    question: 'Áo này có co giãn không?',
    answer: 'Dạ áo có co giãn nhẹ, chất len mềm mại ạ.',
    date: '2024-05-04',
  },
  {
    user: 'Hà',
    question: 'Có size XL không shop?',
    answer: 'Dạ sản phẩm hiện có đủ size M, L, XL nhé ạ.',
    date: '2024-05-05',
  },
];

const ProductDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const stateProduct = location.state;
  // Nếu có state truyền từ ProductCard thì dùng, nếu không thì dùng defaultProduct
  const product = stateProduct
    ? {
        ...stateProduct,
        images: stateProduct.image ? [stateProduct.image] : defaultProduct.images,
        colors: stateProduct.colors
          ? stateProduct.colors.map((c, idx) =>
              typeof c === 'string' ? { name: `Màu ${idx + 1}`, code: c } : c
            )
          : defaultProduct.colors,
        sizes: defaultProduct.sizes,
        inStock: true,
        description: defaultProduct.description,
        oldPrice: stateProduct.oldPrice || defaultProduct.oldPrice,
      }
    : defaultProduct;

  const [mainImg, setMainImg] = useState(0);
  const [color, setColor] = useState(product.colors[0].code);
  const [size, setSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState('desc');
  const [qas, setQAs] = useState(fakeQAs);
  const [qaInput, setQaInput] = useState('');
  const [qaError, setQaError] = useState('');

  const handleDecrease = () => {
    setQuantity(q => Math.max(1, q - 1));
  };
  const handleIncrease = () => {
    setQuantity(q => q + 1);
  };
  const handleSendQA = () => {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      setQaError('Hãy đăng nhập để bình luận');
      setQaInput('');
      // Nhấp nháy icon account trên header
      const accIcon = document.querySelector('.header__icon-link[title="Tài khoản"]');
      if (accIcon) {
        accIcon.classList.add('shake-account');
        setTimeout(() => accIcon.classList.remove('shake-account'), 1200);
      }
      return;
    }
    setQaError('');
    if (qaInput.trim()) {
      setQAs([
        ...qas,
        {
          user: JSON.parse(currentUser).username || 'Bạn',
          question: qaInput,
          answer: 'Shop sẽ trả lời bạn sớm nhất!',
          date: new Date().toISOString().slice(0, 10),
        },
      ]);
      setQaInput('');
    }
  };

  return (
    <div className="home-page product-detail-page">
      <Header />
      <div className="product-detail-container">
        <div className="product-detail-gallery">
          <div className="product-detail-mainimg">
            <img src={product.images[mainImg]} alt={product.name} />
          </div>
          <div className="product-detail-thumbs-scroll">
            <div className="product-detail-thumbs">
              {product.images.map((img, idx) => (
                <img key={idx} src={img} alt="thumb" className={mainImg === idx ? 'active' : ''} onClick={() => setMainImg(idx)} />
              ))}
            </div>
          </div>
        </div>
        <div className="product-detail-info">
          <h1 className="product-detail-title">{product.name}</h1>
          <div className="product-detail-prices">
            <span className="product-detail-price">{product.price.toLocaleString()}đ</span>
            <span className="product-detail-oldprice">{product.oldPrice.toLocaleString()}đ</span>
          </div>
          <div className="product-detail-meta">
            <div className="product-detail-label">Màu sắc:</div>
            <div className="product-detail-colors">
              {product.colors.map((c, idx) => (
                <span key={c.code} className={`product-detail-color${color === c.code ? ' active' : ''}`} style={{background: c.code}} onClick={() => setColor(c.code)} title={c.name}></span>
              ))}
            </div>
            <div className="product-detail-label">Kích thước:</div>
            <div className="product-detail-sizes">
              {product.sizes.map((s) => (
                <span key={s} className={`product-detail-size${size === s ? ' active' : ''}`} onClick={() => setSize(s)}>{s}</span>
              ))}
            </div>
            <div className="product-detail-label">Số lượng:</div>
            <div className="product-detail-qty-wrap">
              <button className="qty-btn" onClick={handleDecrease} aria-label="Giảm">-</button>
              <input type="number" min={1} value={quantity} onChange={e => setQuantity(Math.max(1, Number(e.target.value)))} className="product-detail-qty" />
              <button className="qty-btn" onClick={handleIncrease} aria-label="Tăng">+</button>
            </div>
            <span className="product-detail-stock">{product.inStock ? 'Còn hàng' : 'Hết hàng'}</span>
          </div>
          <div className="product-detail-actions">
            <button className="btn btn-outline">THÊM VÀO GIỎ</button>
            <button className="btn btn-primary" onClick={() => navigate('/muahang')}>MUA NGAY</button>
          </div>
        </div>
      </div>
      <div className="product-detail-tabs">
        <button className={`product-detail-tab${tab === 'desc' ? ' active' : ''}`} onClick={() => setTab('desc')}>Mô tả</button>
        <button className={`product-detail-tab${tab === 'qa' ? ' active' : ''}`} onClick={() => setTab('qa')}>Hỏi đáp</button>
      </div>
      <div className="product-detail-tab-content">
        {tab === 'desc' && (
          <div className="product-detail-desc">
            <h2>Thông tin sản phẩm</h2>
            <p>{product.description}</p>
          </div>
        )}
        {tab === 'qa' && (
          <div className="product-detail-qa">
            <h2>Hỏi đáp về sản phẩm</h2>
            {qas.map((qa, idx) => (
              <div className="qa-item" key={idx}>
                <div className="qa-q"><b>{qa.user} hỏi:</b> {qa.question}</div>
                <div className="qa-a"><b>Shop trả lời:</b> {qa.answer}</div>
                <div className="qa-date">{qa.date}</div>
              </div>
            ))}
            <div className="qa-input-wrap">
              <input
                type="text"
                className="qa-input"
                placeholder="Viết bình luận...."
                value={qaInput}
                onChange={e => setQaInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSendQA(); }}
              />
              <button className="btn btn-primary qa-send-btn" onClick={handleSendQA}>Gửi</button>
            </div>
            {qaError && <div style={{ color: 'red', marginTop: 8, fontWeight: 500 }}>{qaError}</div>}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail; 