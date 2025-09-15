import React, { useState, useEffect } from "react";
import { getCategories, getAllProducts } from "../services/homeService";

const TestData = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesData, productsData] = await Promise.all([
          getCategories(),
          getAllProducts(),
        ]);
        setCategories(categoriesData);
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching test data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading test data...</div>;
  }

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>Test Data from Backend</h2>

      <div style={{ marginBottom: "20px" }}>
        <h3>Categories ({categories.length})</h3>
        <ul>
          {categories.map((cat) => (
            <li key={cat.id}>
              {cat.icon} {cat.name} (ID: {cat.id})
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3>Products ({products.length})</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "10px",
          }}
        >
          {products.slice(0, 10).map((product) => (
            <div
              key={product.id}
              style={{
                border: "1px solid #ddd",
                padding: "10px",
                borderRadius: "5px",
              }}
            >
              <h4>{product.name}</h4>
              <p>Price: {product.price.toLocaleString()}đ</p>
              <p>Category: {product.category}</p>
              <p>Colors: {product.colors.join(", ")}</p>
            </div>
          ))}
        </div>
        {products.length > 10 && (
          <p>... and {products.length - 10} more products</p>
        )}
      </div>
    </div>
  );
};

export default TestData;
