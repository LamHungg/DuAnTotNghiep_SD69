import React, { useState, useEffect } from "react";
import axios from "axios";

const ErrorTest = () => {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const testAPI = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("Testing API...");

        // Test 1: Categories
        console.log("Test 1: Categories");
        const categoriesResponse = await axios.get(
          "http://localhost:8080/api/customer/categories"
        );
        console.log("Categories response:", categoriesResponse.data);

        // Test 2: Products
        console.log("Test 2: Products");
        const productsResponse = await axios.get(
          "http://localhost:8080/api/customer/products"
        );
        console.log("Products response:", productsResponse.data);

        // Test 3: Áo category
        console.log("Test 3: Áo category");
        const aoResponse = await axios.get(
          "http://localhost:8080/api/customer/products/category/%C3%81o"
        );
        console.log("Áo response:", aoResponse.data);

        setData({
          categories: categoriesResponse.data,
          products: productsResponse.data,
          aoProducts: aoResponse.data,
        });
      } catch (err) {
        console.error("API Error:", err);
        setError({
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        });
      } finally {
        setLoading(false);
      }
    };

    testAPI();
  }, []);

  if (loading) {
    return <div>Testing API connections...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
        <h2>❌ API Error Detected</h2>
        <div
          style={{
            background: "#ffebee",
            padding: "15px",
            borderRadius: "8px",
            border: "2px solid #f44336",
          }}
        >
          <h3>Error Details:</h3>
          <p>
            <strong>Message:</strong> {error.message}
          </p>
          <p>
            <strong>Status:</strong> {error.status}
          </p>
          <p>
            <strong>Response:</strong>
          </p>
          <pre
            style={{
              background: "#f5f5f5",
              padding: "10px",
              borderRadius: "5px",
              overflow: "auto",
            }}
          >
            {JSON.stringify(error.response, null, 2)}
          </pre>
        </div>

        <div style={{ marginTop: "20px" }}>
          <h3>🔧 Troubleshooting Steps:</h3>
          <ol>
            <li>Check if backend is running on port 8080</li>
            <li>Check if CustomerController is properly compiled</li>
            <li>Check browser console for CORS errors</li>
            <li>Verify API endpoints are correct</li>
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>✅ API Test Successful!</h2>

      <div style={{ marginBottom: "20px" }}>
        <h3>Categories ({data.categories.length})</h3>
        <ul>
          {data.categories.map((cat) => (
            <li key={cat.id}>
              {cat.icon} {cat.name} - {cat.count} products
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h3>All Products ({data.products.length})</h3>
        <p>Successfully loaded {data.products.length} products!</p>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h3>Áo Category ({data.aoProducts.length})</h3>
        <p>Found {data.aoProducts.length} products for "Áo" category!</p>
      </div>

      <div
        style={{
          background: "#e8f5e8",
          padding: "15px",
          borderRadius: "8px",
          border: "2px solid #4caf50",
        }}
      >
        <h3>🎯 All APIs Working!</h3>
        <p>✅ Categories API: Working</p>
        <p>✅ Products API: Working</p>
        <p>✅ Category Filter API: Working</p>
        <p>✅ Data Structure: Correct</p>
      </div>
    </div>
  );
};

export default ErrorTest;
