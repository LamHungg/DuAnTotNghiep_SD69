import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaEdit,
  FaCamera,
  FaLock,
  FaSignOutAlt,
  FaShieldAlt,
  FaHistory,
  FaHeart,
  FaCog,
  FaTrash,
  FaCheck,
  FaTimes,
  FaEye,
  FaStar,
  FaBell,
  FaMobile,
  FaKey,
} from "react-icons/fa";
import authService from "../services/authService";
import addressService from "../services/addressService";
import orderService from "../services/orderService";
import AuthToast from "../components/AuthToast";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    type: "success",
    message: "",
  });

  // User data
  const [user, setUser] = useState(null);
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    birthDate: "",
    avatar: null,
  });

  // Address management
  const [addresses, setAddresses] = useState([]);
  const [newAddress, setNewAddress] = useState({
    name: "",
    phone: "",
    province: "",
    district: "",
    ward: "",
    detail: "",
    isDefault: false,
    type: "home",
  });

  // Security
  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Orders
  const [orders, setOrders] = useState([]);
  const [orderFilter, setOrderFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetail, setShowOrderDetail] = useState(false);

  // Security settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    loginNotifications: false,
  });

  // Review modal
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState({
    orderId: "",
    productId: "",
    rating: 5,
    comment: "",
  });

  const fileInputRef = useRef();

  useEffect(() => {
    // Check authentication
    if (!authService.isAuthenticated()) {
      navigate("/login", { state: { from: location } });
      return;
    }

    // Load user data
    loadUserData();
    loadAddresses();
    loadOrders();
    loadSecuritySettings();
  }, [navigate, location]);

  const loadUserData = async () => {
    try {
      // Lấy trực tiếp từ localStorage để đảm bảo đồng bộ
      const userStr = localStorage.getItem("user");
      let currentUser = null;

      if (userStr) {
        try {
          currentUser = JSON.parse(userStr);
          console.log("Current user data from localStorage:", currentUser);
        } catch (e) {
          console.error("Error parsing user data:", e);
        }
      }

      // Nếu không có từ localStorage, thử refresh từ server
      if (!currentUser) {
        currentUser = await authService.refreshUserData();
        console.log("Current user data from server:", currentUser);
      }

      if (currentUser) {
        setUser(currentUser);

        // Tách họ tên từ hoTen
        const hoTenParts = currentUser.hoTen
          ? currentUser.hoTen.split(" ")
          : [];
        const firstName = currentUser.firstName || hoTenParts[0] || "";
        const lastName =
          currentUser.lastName || hoTenParts.slice(1).join(" ") || "";

        // Lấy số điện thoại từ nhiều nguồn có thể
        const phone =
          currentUser.phone || currentUser.soDienThoai || currentUser.sdt || "";

        console.log("Parsed data:", {
          firstName,
          lastName,
          phone,
          currentUser,
        });

        setProfileData({
          firstName,
          lastName,
          email: currentUser.email || "",
          phone,
          gender: currentUser.gender || currentUser.gioiTinh || "",
          birthDate: currentUser.birthDate || currentUser.ngaySinh || "",
          avatar: currentUser.avatar || null,
        });
      }
    } catch (error) {
      console.error("Lỗi load user data:", error);
    }
  };

  const loadAddresses = async () => {
    try {
      // Debug: Test API first
      console.log("Testing debug API...");
      const debugInfo = await addressService.debugApi();
      console.log("Debug info:", debugInfo);

      const addressList = await addressService.getAddresses();
      setAddresses(addressList);
    } catch (error) {
      console.error("Lỗi load addresses:", error);
      // Fallback to mock data if API fails
      setAddresses([
        {
          id: 1,
          hoTen: "Nguyễn Văn A",
          soDienThoai: "0912345678",
          tinhThanh: "Hà Nội",
          quanHuyen: "Cầu Giấy",
          phuongXa: "Dịch Vọng",
          diaChiChiTiet: "Số 1, Trần Đăng Ninh",
          macDinh: true,
          loaiDiaChi: "home",
        },
      ]);
    }
  };

  const loadOrders = async () => {
    try {
      console.log("🚀 Loading customer orders...");

      // Debug authentication first
      const authInfo = orderService.debugAuth();
      console.log("🔍 Auth info:", authInfo);

      // Test connection first
      try {
        await orderService.testConnection();
        console.log("✅ Orders API connection test successful");
      } catch (testError) {
        console.error("❌ Orders API connection test failed:", testError);
      }

      const orderList = await orderService.getOrders();
      console.log("📥 Orders loaded:", orderList);
      setOrders(orderList);
    } catch (error) {
      console.error("❌ Lỗi load orders:", error);
      console.error("🔍 Error details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      // Fallback to mock data if API fails
      console.log("🔄 Using fallback mock data");
      setOrders([
        {
          id: "ORD001",
          maDonHang: "DH001",
          ngayDat: "2024-01-15T10:00:00",
          trangThai: "delivered",
          tongTien: 150000,
          chiTietDonHang: [
            { tenSanPham: "Sản phẩm 1", donGia: 75000, soLuong: 2 },
          ],
        },
      ]);
    }
  };

  const loadSecuritySettings = async () => {
    try {
      // Load security settings from localStorage or API
      const savedSettings = localStorage.getItem("securitySettings");
      if (savedSettings) {
        setSecuritySettings(JSON.parse(savedSettings));
      }
    } catch (error) {
      console.error("Lỗi load security settings:", error);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileData((prev) => ({
          ...prev,
          avatar: event.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileUpdate = async () => {
    setLoading(true);
    try {
      // Validate required fields
      if (
        !profileData.firstName ||
        !profileData.lastName ||
        !profileData.email
      ) {
        showToast("Vui lòng điền đầy đủ thông tin bắt buộc", "error");
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(profileData.email)) {
        showToast("Email không hợp lệ", "error");
        return;
      }

      // Validate phone format (optional)
      if (profileData.phone) {
        const phoneRegex = /^[0-9]{10,11}$/;
        if (!phoneRegex.test(profileData.phone)) {
          showToast("Số điện thoại không hợp lệ (10-11 số)", "error");
          return;
        }
      }

      // Prepare data for API
      const updateData = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        email: profileData.email,
        phone: profileData.phone,
        gender: profileData.gender,
        birthDate: profileData.birthDate,
      };

      // Call API to update profile
      const response = await authService.updateProfile(updateData);

      // Update local storage with new data from API response
      const updatedUser = {
        ...user,
        ...response,
        hoTen: `${profileData.firstName} ${profileData.lastName}`.trim(),
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);

      // Update profile data with response data
      setProfileData((prev) => ({
        ...prev,
        phone: response.phone || response.soDienThoai || prev.phone,
      }));

      showToast("Cập nhật thông tin thành công!", "success");
    } catch (error) {
      console.error("Lỗi cập nhật profile:", error);
      showToast("Có lỗi xảy ra khi cập nhật thông tin", "error");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    if (
      !securityData.currentPassword ||
      !securityData.newPassword ||
      !securityData.confirmPassword
    ) {
      showToast("Vui lòng điền đầy đủ thông tin", "error");
      return;
    }

    if (securityData.newPassword !== securityData.confirmPassword) {
      showToast("Mật khẩu xác nhận không khớp", "error");
      return;
    }

    if (securityData.newPassword.length < 6) {
      showToast("Mật khẩu mới phải có ít nhất 6 ký tự", "error");
      return;
    }

    setLoading(true);
    try {
      // Call API to change password
      await authService.changePassword(
        securityData.currentPassword,
        securityData.newPassword
      );

      setSecurityData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      showToast("Đổi mật khẩu thành công!", "success");
    } catch (error) {
      console.error("Lỗi đổi mật khẩu:", error);
      if (error.response?.data?.message) {
        showToast(error.response.data.message, "error");
      } else {
        showToast("Có lỗi xảy ra khi đổi mật khẩu", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async () => {
    if (!newAddress.name || !newAddress.phone || !newAddress.province) {
      showToast("Vui lòng điền đầy đủ thông tin bắt buộc", "error");
      return;
    }

    setLoading(true);
    try {
      const addressData = {
        hoTen: newAddress.name,
        soDienThoai: newAddress.phone,
        tinhThanh: newAddress.province,
        quanHuyen: newAddress.district,
        phuongXa: newAddress.ward,
        diaChiChiTiet: newAddress.detail,
        loaiDiaChi: newAddress.type,
        macDinh: newAddress.isDefault,
      };

      await addressService.addAddress(addressData);

      // Reload addresses
      await loadAddresses();

      // Reset form
      setNewAddress({
        name: "",
        phone: "",
        province: "",
        district: "",
        ward: "",
        detail: "",
        isDefault: false,
        type: "home",
      });

      showToast("Thêm địa chỉ thành công!", "success");
    } catch (error) {
      console.error("Lỗi thêm địa chỉ:", error);
      showToast("Có lỗi xảy ra khi thêm địa chỉ", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) {
      return;
    }

    setLoading(true);
    try {
      await addressService.deleteAddress(id);
      await loadAddresses();
      showToast("Xóa địa chỉ thành công!", "success");
    } catch (error) {
      console.error("Lỗi xóa địa chỉ:", error);
      showToast("Có lỗi xảy ra khi xóa địa chỉ", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSetDefaultAddress = async (id) => {
    setLoading(true);
    try {
      await addressService.setDefaultAddress(id);
      await loadAddresses();
      showToast("Đặt địa chỉ mặc định thành công!", "success");
    } catch (error) {
      console.error("Lỗi đặt địa chỉ mặc định:", error);
      showToast("Có lỗi xảy ra khi đặt địa chỉ mặc định", "error");
    } finally {
      setLoading(false);
    }
  };

  // Order detail functions
  const handleViewOrderDetail = async (order) => {
    try {
      setLoading(true);
      const orderDetail = await orderService.getOrderById(order.id);
      setSelectedOrder(orderDetail);
      setShowOrderDetail(true);
    } catch (error) {
      console.error("Lỗi lấy chi tiết đơn hàng:", error);
      showToast("Không thể lấy chi tiết đơn hàng", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCloseOrderDetail = () => {
    setShowOrderDetail(false);
    setSelectedOrder(null);
  };

  // Review functions
  const handleOpenReviewModal = (orderId, productId) => {
    setReviewData({
      orderId,
      productId,
      rating: 5,
      comment: "",
    });
    setShowReviewModal(true);
  };

  const handleSubmitReview = async () => {
    if (!reviewData.comment.trim()) {
      showToast("Vui lòng nhập nội dung đánh giá", "error");
      return;
    }

    setLoading(true);
    try {
      // TODO: Implement review submission API
      console.log("Submitting review:", reviewData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      showToast("Đánh giá thành công!", "success");
      setShowReviewModal(false);
      setReviewData({
        orderId: "",
        productId: "",
        rating: 5,
        comment: "",
      });
    } catch (error) {
      console.error("Lỗi đánh giá:", error);
      showToast("Có lỗi xảy ra khi đánh giá", "error");
    } finally {
      setLoading(false);
    }
  };

  // Order status update functions
  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) {
      return;
    }

    const reason = window.prompt("Lý do hủy đơn hàng (không bắt buộc):");

    setLoading(true);
    try {
      await orderService.cancelOrder(orderId, reason || "");
      await loadOrders();
      showToast("Hủy đơn hàng thành công!", "success");
    } catch (error) {
      console.error("Lỗi hủy đơn hàng:", error);
      showToast("Có lỗi xảy ra khi hủy đơn hàng", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmReceived = async (orderId) => {
    if (!window.confirm("Bạn có chắc chắn đã nhận hàng?")) {
      return;
    }

    setLoading(true);
    try {
      await orderService.confirmReceived(orderId);
      await loadOrders();
      showToast("Xác nhận nhận hàng thành công!", "success");
    } catch (error) {
      console.error("Lỗi xác nhận nhận hàng:", error);
      showToast("Có lỗi xảy ra khi xác nhận nhận hàng", "error");
    } finally {
      setLoading(false);
    }
  };

  // Security settings functions
  const handleToggleTwoFactorAuth = async () => {
    try {
      const newValue = !securitySettings.twoFactorAuth;
      setSecuritySettings((prev) => ({
        ...prev,
        twoFactorAuth: newValue,
      }));

      // Save to localStorage
      localStorage.setItem(
        "securitySettings",
        JSON.stringify({
          ...securitySettings,
          twoFactorAuth: newValue,
        })
      );

      showToast(
        newValue ? "Đã bật xác thực 2 yếu tố" : "Đã tắt xác thực 2 yếu tố",
        "success"
      );
    } catch (error) {
      console.error("Lỗi cập nhật xác thực 2 yếu tố:", error);
      showToast("Có lỗi xảy ra khi cập nhật cài đặt", "error");
    }
  };

  const handleToggleLoginNotifications = async () => {
    try {
      const newValue = !securitySettings.loginNotifications;
      setSecuritySettings((prev) => ({
        ...prev,
        loginNotifications: newValue,
      }));

      // Save to localStorage
      localStorage.setItem(
        "securitySettings",
        JSON.stringify({
          ...securitySettings,
          loginNotifications: newValue,
        })
      );

      showToast(
        newValue ? "Đã bật thông báo đăng nhập" : "Đã tắt thông báo đăng nhập",
        "success"
      );
    } catch (error) {
      console.error("Lỗi cập nhật thông báo đăng nhập:", error);
      showToast("Có lỗi xảy ra khi cập nhật cài đặt", "error");
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const showToast = (message, type = "success") => {
    setToast({
      visible: true,
      type,
      message,
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
      case "Chờ xác nhận":
        return "#ff9800";
      case "processing":
      case "Đang xử lý":
        return "#2196f3";
      case "shipped":
      case "Đang giao":
        return "#9c27b0";
      case "delivered":
      case "Đã giao hàng":
      case "Hoàn thành":
        return "#4caf50";
      case "cancelled":
      case "Đã hủy":
        return "#f44336";
      default:
        return "#666";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Chờ xác nhận";
      case "processing":
        return "Đang xử lý";
      case "shipped":
        return "Đang giao";
      case "delivered":
        return "Đã giao";
      case "cancelled":
        return "Đã hủy";
      case "Chờ xác nhận":
      case "Đang xử lý":
      case "Đang giao":
      case "Đã giao hàng":
      case "Hoàn thành":
      case "Đã hủy":
        return status;
      default:
        return status || "Không xác định";
    }
  };

  if (!user) {
    return <div className="loading">Đang tải...</div>;
  }

  return (
    <div className="profile-container">
      <AuthToast
        visible={toast.visible}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ ...toast, visible: false })}
      />

      <div className="profile-header">
        <div className="profile-avatar">
          <div
            className="avatar-wrapper"
            onClick={() => fileInputRef.current?.click()}
          >
            {profileData.avatar ? (
              <img src={profileData.avatar} alt="Avatar" />
            ) : (
              <FaUser className="default-avatar" />
            )}
            <div className="avatar-overlay">
              <FaCamera />
            </div>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleAvatarChange}
            style={{ display: "none" }}
          />
        </div>
        <div className="profile-info">
          <h1>
            {profileData.firstName} {profileData.lastName}
          </h1>
          <p>{profileData.email}</p>
          {profileData.phone && <p>📞 {profileData.phone}</p>}
        </div>
      </div>

      <div className="profile-tabs">
        <button
          className={`tab-button ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          <FaUser />
          Thông tin cá nhân
        </button>
        <button
          className={`tab-button ${activeTab === "address" ? "active" : ""}`}
          onClick={() => setActiveTab("address")}
        >
          <FaMapMarkerAlt />
          Địa chỉ
        </button>
        <button
          className={`tab-button ${activeTab === "orders" ? "active" : ""}`}
          onClick={() => setActiveTab("orders")}
        >
          <FaHistory />
          Đơn hàng
        </button>
        <button
          className={`tab-button ${activeTab === "security" ? "active" : ""}`}
          onClick={() => setActiveTab("security")}
        >
          <FaShieldAlt />
          Bảo mật
        </button>
      </div>

      <div className="profile-content">
        {activeTab === "profile" && (
          <div className="profile-section">
            <h2>Thông tin cá nhân</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>Họ</label>
                <input
                  type="text"
                  value={profileData.firstName}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      firstName: e.target.value,
                    }))
                  }
                  placeholder="Nhập họ"
                />
              </div>
              <div className="form-group">
                <label>Tên</label>
                <input
                  type="text"
                  value={profileData.lastName}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      lastName: e.target.value,
                    }))
                  }
                  placeholder="Nhập tên"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  placeholder="Nhập email"
                />
              </div>
              <div className="form-group">
                <label>Số điện thoại</label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                  placeholder="Nhập số điện thoại"
                />
              </div>
              <div className="form-group">
                <label>Giới tính</label>
                <select
                  value={profileData.gender}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      gender: e.target.value,
                    }))
                  }
                >
                  <option value="">Chọn giới tính</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
              </div>
              <div className="form-group">
                <label>Ngày sinh</label>
                <input
                  type="date"
                  value={profileData.birthDate}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      birthDate: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
            <button
              className="save-button"
              onClick={handleProfileUpdate}
              disabled={loading}
            >
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        )}

        {activeTab === "address" && (
          <div className="profile-section">
            <h2>Quản lý địa chỉ</h2>

            <div className="address-form">
              <h3>Thêm địa chỉ mới</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Họ tên *</label>
                  <input
                    type="text"
                    value={newAddress.name}
                    onChange={(e) =>
                      setNewAddress((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="Nhập họ tên"
                  />
                </div>
                <div className="form-group">
                  <label>Số điện thoại *</label>
                  <input
                    type="tel"
                    value={newAddress.phone}
                    onChange={(e) =>
                      setNewAddress((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    placeholder="Nhập số điện thoại"
                  />
                </div>
                <div className="form-group">
                  <label>Tỉnh/Thành phố *</label>
                  <select
                    value={newAddress.province}
                    onChange={(e) =>
                      setNewAddress((prev) => ({
                        ...prev,
                        province: e.target.value,
                      }))
                    }
                  >
                    <option value="">Chọn tỉnh/thành phố</option>
                    <option value="Hà Nội">Hà Nội</option>
                    <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                    <option value="Đà Nẵng">Đà Nẵng</option>
                    <option value="Hải Phòng">Hải Phòng</option>
                    <option value="Cần Thơ">Cần Thơ</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Quận/Huyện</label>
                  <select
                    value={newAddress.district}
                    onChange={(e) =>
                      setNewAddress((prev) => ({
                        ...prev,
                        district: e.target.value,
                      }))
                    }
                  >
                    <option value="">Chọn quận/huyện</option>
                    <option value="Cầu Giấy">Cầu Giấy</option>
                    <option value="Đống Đa">Đống Đa</option>
                    <option value="Hai Bà Trưng">Hai Bà Trưng</option>
                    <option value="Hoàn Kiếm">Hoàn Kiếm</option>
                    <option value="Tây Hồ">Tây Hồ</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Phường/Xã</label>
                  <select
                    value={newAddress.ward}
                    onChange={(e) =>
                      setNewAddress((prev) => ({
                        ...prev,
                        ward: e.target.value,
                      }))
                    }
                  >
                    <option value="">Chọn phường/xã</option>
                    <option value="Dịch Vọng">Dịch Vọng</option>
                    <option value="Nghĩa Đô">Nghĩa Đô</option>
                    <option value="Quan Hoa">Quan Hoa</option>
                    <option value="Yên Hòa">Yên Hòa</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Địa chỉ chi tiết</label>
                  <input
                    type="text"
                    value={newAddress.detail}
                    onChange={(e) =>
                      setNewAddress((prev) => ({
                        ...prev,
                        detail: e.target.value,
                      }))
                    }
                    placeholder="Số nhà, tên đường..."
                  />
                </div>
              </div>
              <div className="address-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={newAddress.isDefault}
                    onChange={(e) =>
                      setNewAddress((prev) => ({
                        ...prev,
                        isDefault: e.target.checked,
                      }))
                    }
                  />
                  Đặt làm địa chỉ mặc định
                </label>
                <div className="address-type">
                  <label>Loại địa chỉ:</label>
                  <div className="type-buttons">
                    <button
                      type="button"
                      className={`type-btn ${
                        newAddress.type === "home" ? "active" : ""
                      }`}
                      onClick={() =>
                        setNewAddress((prev) => ({ ...prev, type: "home" }))
                      }
                    >
                      Nhà riêng
                    </button>
                    <button
                      type="button"
                      className={`type-btn ${
                        newAddress.type === "office" ? "active" : ""
                      }`}
                      onClick={() =>
                        setNewAddress((prev) => ({ ...prev, type: "office" }))
                      }
                    >
                      Văn phòng
                    </button>
                  </div>
                </div>
              </div>
              <button
                className="add-button"
                onClick={handleAddAddress}
                disabled={loading}
              >
                {loading ? "Đang thêm..." : "Thêm địa chỉ"}
              </button>
            </div>

            <div className="address-list">
              <h3>Địa chỉ đã lưu</h3>
              {addresses.map((address) => (
                <div key={address.id} className="address-card">
                  <div className="address-info">
                    <div className="address-header">
                      <h4>{address.hoTen}</h4>
                      {address.macDinh && (
                        <span className="default-badge">Mặc định</span>
                      )}
                    </div>
                    <p>{address.soDienThoai}</p>
                    <p>
                      {[
                        address.diaChiChiTiet,
                        address.phuongXa,
                        address.quanHuyen,
                        address.tinhThanh,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                    <span className="address-type-badge">
                      {address.loaiDiaChi === "home"
                        ? "Nhà riêng"
                        : "Văn phòng"}
                    </span>
                  </div>
                  <div className="address-actions">
                    {!address.macDinh && (
                      <button
                        className="edit-btn"
                        onClick={() => handleSetDefaultAddress(address.id)}
                        disabled={loading}
                        title="Đặt làm mặc định"
                      >
                        <FaCheck />
                      </button>
                    )}
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteAddress(address.id)}
                      disabled={loading}
                      title="Xóa địa chỉ"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
              {addresses.length === 0 && (
                <div className="empty-state">
                  <FaMapMarkerAlt />
                  <p>Chưa có địa chỉ nào được lưu</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="profile-section">
            <h2>Lịch sử đơn hàng</h2>

            <div className="order-filters">
              <button
                className={`filter-btn ${
                  orderFilter === "all" ? "active" : ""
                }`}
                onClick={() => setOrderFilter("all")}
              >
                Tất cả
              </button>
              <button
                className={`filter-btn ${
                  orderFilter === "pending" ? "active" : ""
                }`}
                onClick={() => setOrderFilter("pending")}
              >
                Chờ xác nhận
              </button>
              <button
                className={`filter-btn ${
                  orderFilter === "processing" ? "active" : ""
                }`}
                onClick={() => setOrderFilter("processing")}
              >
                Đang xử lý
              </button>
              <button
                className={`filter-btn ${
                  orderFilter === "delivered" ? "active" : ""
                }`}
                onClick={() => setOrderFilter("delivered")}
              >
                Đã giao
              </button>
            </div>

            <div className="orders-list">
              {orders &&
                Array.isArray(orders) &&
                orders
                  .filter(
                    (order) =>
                      orderFilter === "all" ||
                      (order.trangThaiDonHang &&
                        order.trangThaiDonHang.tenTrangThai === orderFilter) ||
                      (order.trangThai && order.trangThai === orderFilter)
                  )
                  .map((order) => (
                    <div key={order.id} className="order-card">
                      <div className="order-header">
                        <div className="order-info">
                          <h4>Đơn hàng #{order.maDonHang}</h4>
                          <p>
                            {new Date(order.ngayDat).toLocaleDateString(
                              "vi-VN"
                            )}
                          </p>
                        </div>
                        <div className="order-status">
                          <span
                            className="status-badge"
                            style={{
                              backgroundColor: getStatusColor(
                                order.trangThaiDonHang?.tenTrangThai ||
                                  order.trangThai
                              ),
                            }}
                          >
                            {getStatusText(
                              order.trangThaiDonHang?.tenTrangThai ||
                                order.trangThai
                            )}
                          </span>
                        </div>
                      </div>
                      <div className="order-items">
                        {order.chiTietDonHang &&
                          order.chiTietDonHang.map((item, index) => (
                            <div key={index} className="order-item">
                              <span>
                                {item.chiTietSanPham?.sanPham?.tenSanPham ||
                                  item.tenSanPham ||
                                  "Sản phẩm"}
                              </span>
                              <span>x{item.soLuong}</span>
                              <span>
                                {(item.donGia || item.gia).toLocaleString()}đ
                              </span>
                            </div>
                          ))}
                      </div>
                      <div className="order-footer">
                        <div className="order-total">
                          Tổng:{" "}
                          <strong>
                            {(
                              order.tongThanhToan || order.tongTien
                            ).toLocaleString()}
                            đ
                          </strong>
                        </div>
                        <div className="order-actions">
                          <button
                            className="action-btn"
                            onClick={() => handleViewOrderDetail(order)}
                            disabled={loading}
                          >
                            <FaEye />
                            Xem chi tiết
                          </button>
                          {(order.trangThaiDonHang?.tenTrangThai ===
                            "Hoàn thành" ||
                            order.trangThai === "delivered") && (
                            <button
                              className="action-btn"
                              onClick={() =>
                                handleOpenReviewModal(
                                  order.id,
                                  order.chiTietDonHang?.[0]?.id
                                )
                              }
                            >
                              <FaStar />
                              Đánh giá
                            </button>
                          )}
                          {(order.trangThaiDonHang?.tenTrangThai ===
                            "Chờ xác nhận" ||
                            order.trangThai === "pending") && (
                            <button
                              className="action-btn cancel-btn"
                              onClick={() => handleCancelOrder(order.id)}
                              disabled={loading}
                            >
                              <FaTimes />
                              Hủy đơn
                            </button>
                          )}
                          {(order.trangThaiDonHang?.tenTrangThai ===
                            "Đã giao hàng" ||
                            order.trangThai === "delivered") && (
                            <button
                              className="action-btn confirm-btn"
                              onClick={() => handleConfirmReceived(order.id)}
                              disabled={loading}
                            >
                              <FaCheck />
                              Xác nhận nhận hàng
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              {(!orders ||
                !Array.isArray(orders) ||
                orders.filter(
                  (order) =>
                    orderFilter === "all" ||
                    (order.trangThaiDonHang &&
                      order.trangThaiDonHang.tenTrangThai === orderFilter) ||
                    (order.trangThai && order.trangThai === orderFilter)
                ).length === 0) && (
                <div className="empty-state">
                  <FaHistory />
                  <p>Chưa có đơn hàng nào</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="profile-section">
            <h2>Bảo mật tài khoản</h2>

            <div className="security-form">
              <h3>Đổi mật khẩu</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Mật khẩu hiện tại</label>
                  <input
                    type="password"
                    value={securityData.currentPassword}
                    onChange={(e) =>
                      setSecurityData((prev) => ({
                        ...prev,
                        currentPassword: e.target.value,
                      }))
                    }
                    placeholder="Nhập mật khẩu hiện tại"
                  />
                </div>
                <div className="form-group">
                  <label>Mật khẩu mới</label>
                  <input
                    type="password"
                    value={securityData.newPassword}
                    onChange={(e) =>
                      setSecurityData((prev) => ({
                        ...prev,
                        newPassword: e.target.value,
                      }))
                    }
                    placeholder="Nhập mật khẩu mới"
                  />
                </div>
                <div className="form-group">
                  <label>Xác nhận mật khẩu mới</label>
                  <input
                    type="password"
                    value={securityData.confirmPassword}
                    onChange={(e) =>
                      setSecurityData((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    placeholder="Nhập lại mật khẩu mới"
                  />
                </div>
              </div>
              <button
                className="save-button"
                onClick={handlePasswordChange}
                disabled={loading}
              >
                {loading ? "Đang đổi..." : "Đổi mật khẩu"}
              </button>
            </div>

            <div className="security-options">
              <h3>Tùy chọn bảo mật</h3>
              <div className="security-item">
                <div className="security-info">
                  <div className="security-icon">
                    <FaMobile />
                  </div>
                  <div>
                    <h4>Xác thực 2 yếu tố</h4>
                    <p>Tăng cường bảo mật cho tài khoản của bạn</p>
                  </div>
                </div>
                <button
                  className={`toggle-btn ${
                    securitySettings.twoFactorAuth ? "active" : ""
                  }`}
                  onClick={handleToggleTwoFactorAuth}
                >
                  {securitySettings.twoFactorAuth ? "Đã bật" : "Bật"}
                </button>
              </div>
              <div className="security-item">
                <div className="security-info">
                  <div className="security-icon">
                    <FaBell />
                  </div>
                  <div>
                    <h4>Thông báo đăng nhập</h4>
                    <p>Nhận thông báo khi có đăng nhập mới</p>
                  </div>
                </div>
                <button
                  className={`toggle-btn ${
                    securitySettings.loginNotifications ? "active" : ""
                  }`}
                  onClick={handleToggleLoginNotifications}
                >
                  {securitySettings.loginNotifications ? "Đã bật" : "Bật"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {showOrderDetail && selectedOrder && (
        <div className="modal-overlay" onClick={handleCloseOrderDetail}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Chi tiết đơn hàng #{selectedOrder.maDonHang}</h3>
              <button className="modal-close" onClick={handleCloseOrderDetail}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="order-detail-info">
                <p>
                  <strong>Ngày đặt:</strong>{" "}
                  {new Date(selectedOrder.ngayDat).toLocaleDateString("vi-VN")}
                </p>
                <p>
                  <strong>Trạng thái:</strong>{" "}
                  {getStatusText(
                    selectedOrder.trangThaiDonHang?.tenTrangThai ||
                      selectedOrder.trangThai
                  )}
                </p>
                <p>
                  <strong>Tổng tiền:</strong>{" "}
                  {(
                    selectedOrder.tongThanhToan || selectedOrder.tongTien
                  )?.toLocaleString()}
                  đ
                </p>
              </div>
              <div className="order-detail-items">
                <h4>Sản phẩm đã đặt:</h4>
                {selectedOrder.chiTietDonHang?.map((item, index) => (
                  <div key={index} className="order-detail-item">
                    <span>
                      {item.chiTietSanPham?.tenSanPham ||
                        item.tenSanPham ||
                        "Sản phẩm không xác định"}
                    </span>
                    <span>x{item.soLuong}</span>
                    <span>{(item.donGia || item.gia)?.toLocaleString()}đ</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowReviewModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Đánh giá sản phẩm</h3>
              <button
                className="modal-close"
                onClick={() => setShowReviewModal(false)}
              >
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="review-form">
                <div className="form-group">
                  <label>Đánh giá:</label>
                  <div className="rating-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        className={`star-btn ${
                          star <= reviewData.rating ? "active" : ""
                        }`}
                        onClick={() =>
                          setReviewData((prev) => ({ ...prev, rating: star }))
                        }
                      >
                        <FaStar />
                      </button>
                    ))}
                  </div>
                </div>
                <div className="form-group">
                  <label>Nhận xét:</label>
                  <textarea
                    value={reviewData.comment}
                    onChange={(e) =>
                      setReviewData((prev) => ({
                        ...prev,
                        comment: e.target.value,
                      }))
                    }
                    placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                    rows="4"
                  />
                </div>
                <div className="modal-actions">
                  <button
                    className="cancel-btn"
                    onClick={() => setShowReviewModal(false)}
                  >
                    Hủy
                  </button>
                  <button
                    className="submit-btn"
                    onClick={handleSubmitReview}
                    disabled={loading}
                  >
                    {loading ? "Đang gửi..." : "Gửi đánh giá"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="profile-footer">
        <button className="logout-button" onClick={handleLogout}>
          <FaSignOutAlt />
          Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default Profile;
