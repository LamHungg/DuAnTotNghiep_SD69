import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import AddProduct from "./pages/AddProduct";

// Layout Components
import DashboardLayout from "./layouts/DashboardLayout";

// Pages
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Customers from "./pages/Customers";
import OrderUpdate from "./pages/OrderUpdate";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="orders" element={<Orders />} />
          <Route path="customers" element={<Customers />} />
        </Route>
        <Route path="/orders/update" element={<OrderUpdate />} />
      </Routes>
    </Router>
  );
}

export default App;
