import React, { useState } from "react";
import checkoutService from "../services/checkoutService";
import "../styles/main.css";

const DirectPurchase = () => {
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [addressId, setAddressId] = useState(1);
  const [paymentMethodId, setPaymentMethodId] = useState(1);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleTestPurchase = async () => {
    if (!productId) {
      setError("Vui lòng nhập ID sản phẩm!");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log(`🧪 Testing direct purchase for product ID: ${productId}`);

      const testResult = await checkoutService.testBuyProductDirectly(
        parseInt(productId),
        parseInt(quantity)
      );

      setResult({
        type: "success",
        message: "Test mua hàng thành công!",
        data: testResult,
      });

      console.log("✅ Test purchase successful:", testResult);
    } catch (error) {
      console.error("❌ Test purchase failed:", error);
      setError(`Lỗi test mua hàng: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRealPurchase = async () => {
    if (!productId) {
      setError("Vui lòng nhập ID sản phẩm!");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log(
        `🛒 Buying product directly: ID ${productId}, quantity ${quantity}`
      );

      const purchaseResult = await checkoutService.buyProductDirectly(
        parseInt(productId),
        parseInt(quantity),
        parseInt(addressId),
        parseInt(paymentMethodId)
      );

      setResult({
        type: "success",
        message: "Mua hàng thành công!",
        data: purchaseResult,
      });

      console.log("✅ Direct purchase successful:", purchaseResult);
    } catch (error) {
      console.error("❌ Direct purchase failed:", error);
      setError(`Lỗi mua hàng: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckProduct = async () => {
    if (!productId) {
      setError("Vui lòng nhập ID sản phẩm!");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log(`🔍 Checking product ID: ${productId}`);

      const response = await fetch(
        `http://localhost:8080/api/products/${productId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        const product = await response.json();
        setResult({
          type: "info",
          message: "Sản phẩm tồn tại!",
          data: product,
        });
        console.log("✅ Product exists:", product);
      } else {
        setError(`Sản phẩm ID ${productId} không tồn tại!`);
        console.log("❌ Product does not exist");
      }
    } catch (error) {
      console.error("❌ Error checking product:", error);
      setError(`Lỗi kiểm tra sản phẩm: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="direct-purchase-container"
      style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}
    >
      <h2>🛒 Mua Sản Phẩm Trực Tiếp</h2>
      <p>Nhập ID sản phẩm để mua trực tiếp, không cần qua giỏ hàng</p>

      <div className="form-group" style={{ marginBottom: "15px" }}>
        <label htmlFor="productId">ID Sản Phẩm:</label>
        <input
          type="number"
          id="productId"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          placeholder="Nhập ID sản phẩm..."
          style={{ width: "100%", padding: "8px", marginTop: "5px" }}
        />
      </div>

      <div className="form-group" style={{ marginBottom: "15px" }}>
        <label htmlFor="quantity">Số Lượng:</label>
        <input
          type="number"
          id="quantity"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          min="1"
          style={{ width: "100%", padding: "8px", marginTop: "5px" }}
        />
      </div>

      <div className="form-group" style={{ marginBottom: "15px" }}>
        <label htmlFor="addressId">ID Địa Chỉ:</label>
        <input
          type="number"
          id="addressId"
          value={addressId}
          onChange={(e) => setAddressId(e.target.value)}
          style={{ width: "100%", padding: "8px", marginTop: "5px" }}
        />
      </div>
      <div className="form-group" style={{ marginBottom: "15px" }}>
        <label htmlFor="paymentMethodId">ID Phương Thức Thanh Toán:</label>
        <input
          type="number"
          id="paymentMethodId"
          value={paymentMethodId}
          onChange={(e) => setPaymentMethodId(e.target.value)}
          style={{ width: "100%", padding: "8px", marginTop: "5px" }}
        />
      </div>
      <div
        className="button-group"
        style={{ display: "flex", gap: "10px", marginBottom: "20px" }}
      >
        <button
          onClick={handleCheckProduct}
          disabled={loading}
          style={{
            padding: "10px 15px",
            backgroundColor: "#17a2b8",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Đang kiểm tra..." : "🔍 Kiểm Tra Sản Phẩm"}
        </button>
        <button
          onClick={handleTestPurchase}
          disabled={loading}
          style={{
            padding: "10px 15px",
            backgroundColor: "#ffc107",
            color: "#212529",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Đang test..." : "🧪 Test Mua Hàng"}
        </button>

        <button
          onClick={handleRealPurchase}
          disabled={loading}
          style={{
            padding: "10px 15px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Đang mua..." : "🛒 Mua Hàng Thực Tế"}
        </button>
      </div>

      {error && (
        <div
          style={{
            padding: "15px",
            backgroundColor: "#f8d7da",
            color: "#721c24",
            border: "1px solid #f5c6cb",
            borderRadius: "4px",
            marginBottom: "15px",
          }}
        >
          <strong>❌ Lỗi:</strong> {error}
        </div>
      )}
      {result && (
        <div
          style={{
            padding: "15px",
            backgroundColor: result.type === "success" ? "#d4edda" : "#d1ecf1",
            color: result.type === "success" ? "#155724" : "#0c5460",
            border: `1px solid ${
              result.type === "success" ? "#c3e6cb" : "#bee5eb"
            }`,
            borderRadius: "4px",
            marginBottom: "15px",
          }}
        >
          <strong>✅ {result.message}</strong>
          <pre style={{ marginTop: "10px", whiteSpace: "pre-wrap" }}>
            {JSON.stringify(result.data, null, 2)}
          </pre>
        </div>
      )}

      <div
        className="info-box"
        style={{
          padding: "15px",
          backgroundColor: "#e2e3e5",
          border: "1px solid #d6d8db",
          borderRadius: "4px",
          marginTop: "20px",
        }}
      >
        <h4>📋 Hướng Dẫn Sử Dụng:</h4>
        <ul>
          <li>
            <strong>Kiểm Tra Sản Phẩm:</strong> Kiểm tra xem sản phẩm có tồn tại
            không
          </li>
          <li>
            <strong>Test Mua Hàng:</strong> Test quá trình mua hàng (không tạo
            đơn hàng thực)
          </li>
          <li>
            <strong>Mua Hàng Thực Tế:</strong> Tạo đơn hàng thực tế
          </li>
        </ul>
        <p>
          <strong>Lưu ý:</strong> Đảm bảo đã đăng nhập trước khi mua hàng!
        </p>
      </div>
    </div>
  );
};

export default DirectPurchase;
