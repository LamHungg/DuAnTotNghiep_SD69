import React, { useState, useEffect } from "react";
import { getAllProducts, getCategories } from "../services/homeService";

const DebugData = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsData, categoriesData] = await Promise.all([
          getAllProducts(),
          getCategories(),
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching debug data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading debug data...</div>;
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>Debug Data - Raw API Response</h2>

      <div style={{ marginBottom: "20px" }}>
        <h3>Categories ({categories.length})</h3>
        <pre
          style={{
            background: "#f5f5f5",
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          {JSON.stringify(categories, null, 2)}
        </pre>
      </div>

      <div>
        <h3>Products ({products.length})</h3>
        <div style={{ marginBottom: "10px" }}>
          <strong>Sample Products:</strong>
        </div>
        {products.slice(0, 5).map((product, index) => (
          <div
            key={product.id}
            style={{
              border: "1px solid #ddd",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
              background: "#f9f9f9",
            }}
          >
            <h4>Product {index + 1}:</h4>
            <pre style={{ fontSize: "12px", overflow: "auto" }}>
              {JSON.stringify(product, null, 2)}
            </pre>
          </div>
        ))}

        <div style={{ marginTop: "20px" }}>
          <h4>Category Analysis:</h4>
          <ul>
            {Array.from(new Set(products.map((p) => p.category))).map((cat) => (
              <li key={cat}>
                <strong>{cat}:</strong>{" "}
                {products.filter((p) => p.category === cat).length} products
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DebugData;
