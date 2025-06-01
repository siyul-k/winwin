// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import App from "./App";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import PointPage from "./pages/PointPage";
import TreePage from "./pages/TreePage";
import DepositPage from "./pages/DepositPage";
import DepositHistoryPage from "./pages/DepositHistoryPage";
import WithdrawPage from "./pages/WithdrawPage";
import WithdrawHistoryPage from "./pages/WithdrawHistoryPage";
import ProductPage from "./pages/ProductPage";
import ProductHistoryPage from "./pages/ProductHistoryPage";
import NoticePage from "./pages/NoticePage";
import SettingsPage from "./pages/SettingsPage";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/point" element={<PointPage />} />
        <Route path="/tree" element={<TreePage />} />
        <Route path="/deposit" element={<DepositPage />} />
        <Route path="/deposit/history" element={<DepositHistoryPage />} />
        <Route path="/withdraw" element={<WithdrawPage />} />
        <Route path="/withdraw/history" element={<WithdrawHistoryPage />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/product/history" element={<ProductHistoryPage />} />
        <Route path="/notice" element={<NoticePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
