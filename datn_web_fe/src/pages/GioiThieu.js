import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/main.css';

const GioiThieu = () => {
  return (
    <div style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #fff 100%)', minHeight: '100vh' }}>
      <Header />
      <div style={{ maxWidth: 950, margin: '0 auto', padding: '0 0 48px 0', background: 'transparent' }}>
        {/* Banner lớn */}
        <div style={{ width: '100%', height: 220, background: 'linear-gradient(90deg, #e0e7ff 0%, #fff 100%)', borderRadius: 24, margin: '32px 0 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', position: 'relative', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
          <img src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=900&q=80" alt="Banner" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.25, position: 'absolute', left: 0, top: 0 }} />
          <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', width: '100%' }}>
            <h1 style={{ fontSize: 38, fontWeight: 800, color: '#222', margin: 0, letterSpacing: 1 }}>ZMEN FASHION</h1>
            <div style={{ color: '#007bff', fontSize: 22, fontWeight: 600, marginTop: 8 }}>Thời trang trẻ trung - Năng động - Cá tính</div>
            <div style={{ color: '#444', fontSize: 16, marginTop: 10 }}>Khám phá phong cách của bạn cùng ZMEN!</div>
          </div>
        </div>
        {/* Section giới thiệu tổng quan */}
        <div style={{ background: '#fff', borderRadius: 18, margin: '32px 0 0 0', padding: '32px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'center' }}>
            <img src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80" alt="about" style={{ width: 180, height: 180, borderRadius: '50%', objectFit: 'cover', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }} />
            <div style={{ flex: 1, minWidth: 220 }}>
              <h2 style={{ fontSize: 26, fontWeight: 700, color: '#222', marginBottom: 10 }}>Về ZMEN Fashion</h2>
              <div style={{ fontSize: 17, color: '#333', lineHeight: 1.7 }}>
                <b>ZMEN Fashion</b> là thương hiệu thời trang hiện đại, chuyên cung cấp các sản phẩm quần áo nam nữ chất lượng cao với phong cách trẻ trung, cá tính và luôn cập nhật xu hướng mới nhất.<br /><br />
                Chúng tôi tự hào mang đến trải nghiệm mua sắm tuyệt vời, sản phẩm đa dạng, giá cả hợp lý cùng dịch vụ tận tâm.
              </div>
            </div>
          </div>
        </div>
        {/* Section Giá trị cốt lõi */}
        <div style={{ margin: '36px 0 0 0', background: '#f5f7fa', borderRadius: 18, padding: '32px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.03)' }}>
          <h2 style={{ color: '#007bff', fontWeight: 700, fontSize: 24, marginBottom: 18, textAlign: 'center', letterSpacing: 1 }}>Giá trị cốt lõi</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 28, justifyContent: 'center' }}>
            <CoreValue icon="🎯" title="Chất lượng" desc="Sản phẩm chính hãng, chất liệu cao cấp, kiểm định kỹ lưỡng." />
            <CoreValue icon="🚚" title="Dịch vụ" desc="Giao hàng nhanh, đổi trả dễ dàng, hỗ trợ tận tâm 24/7." />
            <CoreValue icon="💡" title="Sáng tạo" desc="Luôn cập nhật xu hướng, sáng tạo trong từng thiết kế." />
            <CoreValue icon="🤝" title="Khách hàng" desc="Khách hàng là trung tâm, cam kết hài lòng 100%." />
          </div>
        </div>
        {/* Section Đội ngũ */}
        <div style={{ margin: '36px 0 0 0', background: '#fff', borderRadius: 18, padding: '32px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
          <h2 style={{ color: '#222', fontWeight: 700, fontSize: 24, marginBottom: 18, textAlign: 'center', letterSpacing: 1 }}>Đội ngũ của chúng tôi</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'center' }}>
            <TeamCard name="Nguyễn Văn A" role="Founder & CEO" img="https://randomuser.me/api/portraits/men/32.jpg" />
            <TeamCard name="Trần Thị B" role="Trưởng phòng Thiết kế" img="https://randomuser.me/api/portraits/women/44.jpg" />
            <TeamCard name="Lê Văn C" role="Quản lý vận hành" img="https://randomuser.me/api/portraits/men/65.jpg" />
          </div>
        </div>
        {/* Section thông tin liên hệ */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'center', margin: '36px 0 0 0' }}>
          <div style={{ flex: '1 1 260px', background: '#f0f4ff', borderRadius: 14, padding: 24, boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
            <h3 style={{ color: '#007bff', fontWeight: 600, fontSize: 20, marginBottom: 10 }}>Địa chỉ</h3>
            <div>18LK23 Khu đô thị Vân Canh, Hoài Đức, Hà Nội</div>
          </div>
          <div style={{ flex: '1 1 260px', background: '#f0f4ff', borderRadius: 14, padding: 24, boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
            <h3 style={{ color: '#007bff', fontWeight: 600, fontSize: 20, marginBottom: 10 }}>Liên hệ</h3>
            <div>Hotline: <b>0968 023 318</b></div>
            <div>Email: <b>zmenfashion@gmail.com</b></div>
            <div>Facebook: <a href="#" style={{ color: '#007bff' }}>fb.com/zmenfashion</a></div>
          </div>
          <div style={{ flex: '1 1 260px', background: '#f0f4ff', borderRadius: 14, padding: 24, boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
            <h3 style={{ color: '#007bff', fontWeight: 600, fontSize: 20, marginBottom: 10 }}>Giờ mở cửa</h3>
            <div>Thứ 2 - Chủ nhật: 8:00 - 21:30</div>
          </div>
        </div>
        <div style={{ textAlign: 'center', color: '#888', fontSize: 16, marginTop: 36 }}>
          <b>Cảm ơn bạn đã tin tưởng và lựa chọn ZMEN Fashion!</b><br />
          Hãy theo dõi chúng tôi để cập nhật những xu hướng thời trang mới nhất.
        </div>
      </div>
      <Footer />
    </div>
  );
};

const CoreValue = ({ icon, title, desc }) => (
  <div style={{ flex: '1 1 180px', minWidth: 160, background: '#fff', borderRadius: 12, padding: 18, textAlign: 'center', boxShadow: '0 1px 6px rgba(0,0,0,0.03)' }}>
    <div style={{ fontSize: 32, marginBottom: 8 }}>{icon}</div>
    <div style={{ fontWeight: 600, color: '#222', fontSize: 18, marginBottom: 6 }}>{title}</div>
    <div style={{ color: '#555', fontSize: 15 }}>{desc}</div>
  </div>
);

const TeamCard = ({ name, role, img }) => (
  <div style={{ flex: '1 1 180px', minWidth: 160, background: '#fafbfc', borderRadius: 12, padding: 18, textAlign: 'center', boxShadow: '0 1px 6px rgba(0,0,0,0.03)' }}>
    <img src={img} alt={name} style={{ width: 70, height: 70, borderRadius: '50%', objectFit: 'cover', marginBottom: 10, boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }} />
    <div style={{ fontWeight: 600, color: '#222', fontSize: 17 }}>{name}</div>
    <div style={{ color: '#007bff', fontSize: 15, marginTop: 2 }}>{role}</div>
  </div>
);

export default GioiThieu; 