// ✅ src/App.jsx (라우터 포함 전체 코드)
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// ✅ 페이지들
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import PointPage from "./pages/PointPage";
import TreePage from "./pages/TreePage";
import DepositPage from "./pages/DepositPage";
import DepositHistoryPage from "./pages/DepositHistoryPage";
import WithdrawPage from "./pages/WithdrawPage";
import WithdrawHistoryPage from "./pages/WithdrawHistoryPage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminDepositPage from "./pages/AdminDepositPage"; // ✅ 추가된 관리자 입금 페이지

export default function App() {
  return (
    <Router>
      <Routes>
        {/* 일반 회원 라우팅 */}
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/point" element={<PointPage />} />
        <Route path="/tree" element={<TreePage />} />
        <Route path="/deposit" element={<DepositPage />} />
        <Route path="/deposit-history" element={<DepositHistoryPage />} />
        <Route path="/withdraw" element={<WithdrawPage />} />
        <Route path="/withdraw-history" element={<WithdrawHistoryPage />} />

        {/* 관리자 전용 */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/deposit" element={<AdminDepositPage />} /> {/* ✅ 입금관리 페이지 */}

        {/* 404 fallback */}
        <Route path="*" element={<div>페이지를 찾을 수 없습니다.</div>} />
      </Routes>
    </Router>
  );
}
