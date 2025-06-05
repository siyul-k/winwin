import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// 관리자 레이아웃
import AdminLayout from "./components/AdminLayout";

// 관리자 페이지
import AdminLogin from "./pages/AdminLogin";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminMembersPage from "./pages/AdminMembersPage";
import AdminTreePage from "./pages/AdminTreePage"; // ✅ 조직도 페이지 연결
import AdminDepositPage from "./pages/AdminDepositPage";
import AdminWithdrawPage from "./pages/AdminWithdrawPage";
import PointAdjustPage from "./pages/PointAdjustPage";
import AdminNoticesPage from "./pages/AdminNoticesPage";
import AdminRewardsPage from "./pages/AdminRewardsPage";
import ComingSoonPage from "./pages/ComingSoonPage";

// 일반 회원 페이지
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import PointPage from "./pages/PointPage";
import TreePage from "./pages/TreePage";
import DepositPage from "./pages/DepositPage";
import DepositHistoryPage from "./pages/DepositHistoryPage";
import WithdrawPage from "./pages/WithdrawPage";
import WithdrawHistoryPage from "./pages/WithdrawHistoryPage";
import NoticePage from "./pages/NoticePage"; // 회원용 공지사항

export default function App() {
  return (
    <Router>
      <Routes>
        {/* ─────────────── 회원 라우팅 ─────────────── */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/point" element={<PointPage />} />
        <Route path="/tree" element={<TreePage />} />
        <Route path="/deposit" element={<DepositPage />} />
        <Route path="/deposit-history" element={<DepositHistoryPage />} />
        <Route path="/withdraw" element={<WithdrawPage />} />
        <Route path="/withdraw-history" element={<WithdrawHistoryPage />} />
        <Route path="/notices" element={<NoticePage />} />

        {/* ─────────────── 관리자 로그인 ─────────────── */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* ─────────────── 관리자 공통 레이아웃 ─────────────── */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="members" element={<AdminMembersPage />} />
          <Route path="tree" element={<AdminTreePage />} /> {/* ✅ 조직도 페이지 실제 연결 */}
          <Route path="deposit" element={<AdminDepositPage />} />
          <Route path="withdraws" element={<AdminWithdrawPage />} />
          <Route path="rewards" element={<AdminRewardsPage />} />
          <Route path="points" element={<PointAdjustPage />} />
          <Route path="notices" element={<AdminNoticesPage />} />

          {/* Coming Soon 메뉴 */}
          <Route path="sales" element={<ComingSoonPage title="🛒 판매관리" />} />
          <Route path="settings" element={<ComingSoonPage title="⚙️ 환경설정" />} />
        </Route>

        {/* ─────────────── Not Found ─────────────── */}
        <Route
          path="*"
          element={<div className="p-10">❌ 페이지를 찾을 수 없습니다.</div>}
        />
      </Routes>
    </Router>
  );
}
