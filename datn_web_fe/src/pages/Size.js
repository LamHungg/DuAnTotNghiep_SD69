import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/main.css';

const sizeData = [
  {
    type: 'Áo thun',
    img: 'https://i.imgur.com/0y8Ftya.png',
    sizes: [
      { size: 'M', dai: 70, nguc: 53 },
      { size: 'L', dai: 73, nguc: 56 },
      { size: 'XL', dai: 76, nguc: 59 },
    ],
  },
  {
    type: 'Polo',
    img: 'https://i.imgur.com/0y8Ftya.png',
    sizes: [
      { size: 'M', dai: 70, nguc: 53 },
      { size: 'L', dai: 73, nguc: 56 },
      { size: 'XL', dai: 76, nguc: 59 },
    ],
  },
  {
    type: 'Sơ mi',
    img: 'https://i.imgur.com/0y8Ftya.png',
    sizes: [
      { size: 'M', dai: 70, nguc: 53 },
      { size: 'L', dai: 73, nguc: 56 },
      { size: 'XL', dai: 76, nguc: 59 },
    ],
  },
  {
    type: 'Sơ mi dài tay',
    img: 'https://i.imgur.com/0y8Ftya.png',
    sizes: [
      { size: 'M', dai: 70, nguc: 57 },
      { size: 'L', dai: 73, nguc: 60 },
      { size: 'XL', dai: 76, nguc: 63 },
    ],
  },
  {
    type: 'Long sleeves',
    img: 'https://i.imgur.com/0y8Ftya.png',
    sizes: [
      { size: 'M', dai: 72, nguc: 63 },
      { size: 'L', dai: 74, nguc: 65 },
      { size: 'XL', dai: 76, nguc: 67 },
    ],
  },
  {
    type: 'Sweater',
    img: 'https://i.imgur.com/0y8Ftya.png',
    sizes: [
      { size: 'M', dai: 70, nguc: 57 },
      { size: 'L', dai: 73, nguc: 60 },
      { size: 'XL', dai: 76, nguc: 63 },
    ],
  },
  {
    type: 'Hoodie',
    img: 'https://i.imgur.com/0y8Ftya.png',
    sizes: [
      { size: 'M', dai: 70, nguc: 57 },
      { size: 'L', dai: 73, nguc: 60 },
      { size: 'XL', dai: 76, nguc: 63 },
    ],
  },
  {
    type: 'Áo khoác',
    img: 'https://i.imgur.com/0y8Ftya.png',
    sizes: [
      { size: 'M', dai: 70, nguc: 63 },
      { size: 'L', dai: 73, nguc: 66 },
      { size: 'XL', dai: 76, nguc: 69 },
    ],
  },
  {
    type: 'Track pant',
    img: 'https://i.imgur.com/0y8Ftya.png',
    sizes: [
      { size: 'M', dai: 100, nguc: 33 },
      { size: 'L', dai: 102, nguc: 35 },
      { size: 'XL', dai: 104, nguc: 37 },
    ],
  },
  {
    type: 'Quần short',
    img: 'https://i.imgur.com/0y8Ftya.png',
    sizes: [
      { size: 'M', dai: 49, nguc: 54 },
      { size: 'L', dai: 51, nguc: 58 },
      { size: 'XL', dai: 53, nguc: 61 },
    ],
  },
  {
    type: 'Flannel',
    img: 'https://i.imgur.com/0y8Ftya.png',
    sizes: [
      { size: 'M', dai: 73, nguc: 56 },
      { size: 'L', dai: 76, nguc: 59 },
      { size: 'XL', dai: 78, nguc: 62 },
    ],
  },
];

const Size = () => {
  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      <Header />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 0 48px 0' }}>
        <h1 style={{ textAlign: 'center', color: '#1abc9c', fontWeight: 800, fontSize: 38, letterSpacing: 2, marginBottom: 8 }}>TEELAB</h1>
        <div style={{ textAlign: 'center', color: '#888', fontSize: 22, marginBottom: 24 }}>Bảng size</div>
        {/* Bảng size gợi ý theo cân nặng/chiều cao */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 36 }}>
          <table style={{ borderCollapse: 'collapse', minWidth: 700, background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <thead>
              <tr>
                <th style={{ background: '#fff', color: '#1abc9c', fontWeight: 800, fontSize: 22, padding: '18px 0', border: 'none' }}>cm/kg</th>
                <th style={{ background: '#f6faf7', color: '#43a047', fontWeight: 700, fontSize: 22, padding: '18px 0', border: 'none' }}>&lt;58kg</th>
                <th style={{ background: '#f6faf7', color: '#43a047', fontWeight: 700, fontSize: 22, padding: '18px 0', border: 'none' }}>59-68kg</th>
                <th style={{ background: '#f6faf7', color: '#43a047', fontWeight: 700, fontSize: 22, padding: '18px 0', border: 'none' }}>69-85kg</th>
              </tr>
            </thead>
            <tbody style={{ fontSize: 20, fontWeight: 600 }}>
              <tr>
                <td style={{ padding: '18px 24px', color: '#111', background: '#fff', border: 'none' }}>&lt;1m62 cm</td>
                <td style={{ background: '#f6f6f6', textAlign: 'center', border: 'none' }}>M</td>
                <td style={{ background: '#fff', textAlign: 'center', border: 'none' }}>M</td>
                <td style={{ background: '#f6f6f6', textAlign: 'center', border: 'none' }}>M/L</td>
              </tr>
              <tr>
                <td style={{ padding: '18px 24px', color: '#111', background: '#fff', border: 'none' }}>1m63 - 1m72 cm</td>
                <td style={{ background: '#f6f6f6', textAlign: 'center', border: 'none' }}>M</td>
                <td style={{ background: '#fff', textAlign: 'center', border: 'none' }}>L</td>
                <td style={{ background: '#f6f6f6', textAlign: 'center', border: 'none' }}>XL</td>
              </tr>
              <tr>
                <td style={{ padding: '18px 24px', color: '#111', background: '#fff', border: 'none' }}>&gt;1m72 cm</td>
                <td style={{ background: '#f6f6f6', textAlign: 'center', border: 'none' }}>L</td>
                <td style={{ background: '#fff', textAlign: 'center', border: 'none' }}>L</td>
                <td style={{ background: '#f6f6f6', textAlign: 'center', border: 'none' }}>XL</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style={{ fontWeight: 800, color: '#222', fontSize: 22, margin: '32px 0 18px 0', letterSpacing: 1 }}>Thông số chi tiết sản phẩm</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'center' }}>
          {sizeData.map((item, idx) => (
            <div key={idx} style={{ background: '#f8fafc', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', padding: 24, minWidth: 260, maxWidth: 320, flex: '1 1 300px', textAlign: 'center', marginBottom: 18 }}>
              <img src={item.img} alt={item.type} style={{ width: 64, height: 64, objectFit: 'contain', borderRadius: 12, background: '#fff', marginBottom: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }} />
              <div style={{ fontWeight: 700, color: '#1abc9c', fontSize: 18, marginBottom: 10 }}>{item.type}</div>
              <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', borderRadius: 8, overflow: 'hidden', margin: '0 auto' }}>
                <thead>
                  <tr style={{ background: '#f0f4ff', color: '#007bff', fontWeight: 700, fontSize: 15 }}>
                    <th style={{ padding: '8px 0' }}>Size</th>
                    <th style={{ padding: '8px 0' }}>Dài (cm)</th>
                    <th style={{ padding: '8px 0' }}>Ngực (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  {item.sizes.map((sz, i) => (
                    <tr key={sz.size} style={{ background: i % 2 === 0 ? '#fff' : '#f6fafd' }}>
                      <td style={{ textAlign: 'center', fontWeight: 700, color: '#43a047', padding: '7px 0' }}>{sz.size}</td>
                      <td style={{ textAlign: 'center', padding: '7px 0' }}>{sz.dai}</td>
                      <td style={{ textAlign: 'center', padding: '7px 0' }}>{sz.nguc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Size; 