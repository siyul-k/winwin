// ✅ 파일 위치: src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// ─ 관리자 레이아웃 ─
import AdminLayout from "./components/AdminLayout";

// ─ 사용자 레이아웃 ─
import UserLayout from "./components/UserLayout";

// ─ 관리자 페이지 ─
import AdminLogin from "./pages/AdminLogin";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import AdminMembersPage from "./pages/AdminMembersPage";
import AdminTreePage from "./pages/AdminTreePage";           // 추천 조직도
import AdminTreeSponsorPage from "./pages/AdminTreeSponsorPage"; // 후원 조직도
import AdminDepositPage from "./pages/AdminDepositPage";
import AdminWithdrawPage from "./pages/AdminWithdrawPage";
import PointAdjustPage from "./pages/PointAdjustPage";
import AdminNoticesPage from "./pages/AdminNoticesPage";
import AdminCodeGivePage from "./pages/AdminCodeGivePage"; // 관리자 코드지급 페이지
import AdminProductsPage from './pages/AdminProductsPage'; 
import AdminRewardsPage from "./pages/AdminRewardsPage";
import AdminCentersPage from "./pages/AdminCentersPage";
import AdminSettingsPage from './pages/AdminSettingsPage';
import ComingSoonPage from "./pages/ComingSoonPage";

// ─ 일반 회원 페이지 ─
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import SettingsPage from "./pages/SettingsPage";
import PointPage from "./pages/PointPage";
import PointSummaryPage from "./pages/PointSummaryPage";
// ─ 여기를 바꿨습니다! ─
import { useAuth } from "./hooks/useAuth";                   // 로그인 정보 훅
// import TreePage from "./pages/TreePage";                   // 기존 TreePage 대신
// ─ 대신 아래에 UserTreePage(서브트리 모드) 정의 ─
import DepositPage from "./pages/DepositPage";
import DepositHistoryPage from "./pages/DepositHistoryPage";
import WithdrawPage from "./pages/WithdrawPage";
import WithdrawHistoryPage from "./pages/WithdrawHistoryPage";
import NoticePage from "./pages/NoticePage";
import ProductPage from "./pages/ProductPage";
import ProductHistoryPage from "./pages/ProductHistoryPage";

export default function App() {
  // 로그인한 회원 정보 (username)을 가져옵니다.
  const { username: currentUser } = useAuth();

  // 회원 전용 조직도: 본인부터 하위만 보여줄 Wrapper 컴포넌트
  const UserTreePage = () => (
    <UserLayout>
      <AdminTreeSponsorPage currentUser={currentUser} />
    </UserLayout>
  );

  return (
    <Router>
      <Routes>
        {/* ─────────────── 회원 라우팅 ─────────────── */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route path="/dashboard" element={<UserLayout><DashboardPage /></UserLayout>} />
        <Route path="/point" element={<UserLayout><PointPage /></UserLayout>} />
        <Route path="/point/summary" element={<UserLayout><PointSummaryPage /></UserLayout>} />
        <Route path="/settings" element={<UserLayout><SettingsPage /></UserLayout>} />

        {/* ─ 기존 TreePage 대신, 본인 서브트리만 보여주는 UserTreePage ─ */}
        <Route path="/tree" element={<UserTreePage />} />

        <Route path="/deposit" element={<UserLayout><DepositPage /></UserLayout>} />
        <Route path="/deposit-history" element={<UserLayout><DepositHistoryPage /></UserLayout>} />
        <Route path="/withdraw" element={<UserLayout><WithdrawPage /></UserLayout>} />
        <Route path="/withdraw-history" element={<UserLayout><WithdrawHistoryPage /></UserLayout>} />
        <Route path="/notices" element={<UserLayout><NoticePage /></UserLayout>} />
        <Route path="/product" element={<UserLayout><ProductPage /></UserLayout>} />
        <Route path="/product-history" element={<UserLayout><ProductHistoryPage /></UserLayout>} />

        {/* ─────────────── 관리자 로그인 ─────────────── */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* ─────────────── 관리자 공통 레이아웃 ─────────────── */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="members" element={<AdminMembersPage />} />
          {/* 조직도 하위 라우팅 (관리자는 전체 트리) */}
          <Route path="tree/recommend" element={<AdminTreePage />} />
          <Route path="tree/sponsor" element={<AdminTreeSponsorPage />} />
          <Route path="deposit" element={<AdminDepositPage />} />
          <Route path="withdraws" element={<AdminWithdrawPage />} />
          <Route path="rewards" element={<AdminRewardsPage />} />
          <Route path="code-rewards" element={<AdminCodeGivePage />} />
          <Route path="points" element={<PointAdjustPage />} />
          <Route path="notices" element={<AdminNoticesPage />} />
          <Route path="centers" element={<AdminCentersPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />
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
