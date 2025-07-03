import axios from 'axios';

const API_BASE = 'http://localhost:8080/ZMEN/Admin/DonHang';

// Lấy danh sách đơn hàng tóm tắt
export const getAllOrders = () => axios.get(`${API_BASE}`);

// Lấy chi tiết đơn hàng theo ID
export const getOrderDetail = (id) => axios.get(`${API_BASE}/${id}`);

// Tạo đơn hàng mới
export const createOrder = (data) => axios.post(`${API_BASE}`, data);

// Xác nhận đơn hàng
export const confirmOrder = (id) => axios.post(`${API_BASE}/${id}/confirm`);

// Bắt đầu giao hàng
export const shipOrder = (id) => axios.post(`${API_BASE}/${id}/ship`);

// Giao hàng thành công
export const deliverOrder = (id) => axios.post(`${API_BASE}/${id}/deliver`);

// Hoàn thành đơn hàng
export const completeOrder = (id) => axios.post(`${API_BASE}/${id}/complete`);

// Hủy đơn hàng
export const cancelOrder = (id) => axios.post(`${API_BASE}/${id}/cancel`); 