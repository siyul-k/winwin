// ✅ 파일 경로: frontend/src/components/AdminLayout.jsx
import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import MemberStats from '../pages/MemberStats';
import DepositStats from '../pages/DepositStats';
import WithdrawStats from '../pages/WithdrawStats';

export default function AdminLayout() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(null);

  const navLinkClass = (path) =>
    `px-4 py-2 text-sm font-medium hover:text-yellow-300 ${
      pathname.startsWith(path) ? 'text-yellow-300' : 'text-white'
    }`;

  const dropdownItemClass = (path) =>
    `block px-4 py-1 text-sm whitespace-nowrap hover:text-yellow-300 ${
      pathname.startsWith(path) ? 'text-yellow-300' : 'text-white'
    }`;

  // 페이지에 따라 통계 컴포넌트 선택
  let StatsComponent = null;
  if (pathname.startsWith('/admin/members')) StatsComponent = MemberStats;
  else if (pathname.startsWith('/admin/deposit')) StatsComponent = DepositStats;
  else if (pathname.startsWith('/admin/withdraws')) StatsComponent = WithdrawStats;

  return (
    <div className="flex flex-col min-h-screen">
      {/* 상단바 */}
      <header className="bg-gray-800 text-white shadow sticky top-0 z-50">
        <div className="flex justify-between items-center px-4 py-3 md:px-6">
          <div className="text-xl font-bold">📊 Admin</div>
        </div>

        {/* 메뉴 바 (한 줄 정렬) */}
        <nav className="bg-gray-900 text-white flex flex-wrap px-4 md:px-6 space-x-6 text-sm">
          <Link to="/admin/dashboard" className={navLinkClass('/admin/dashboard')}>대시보드</Link>
          <Link to="/admin/notices" className={navLinkClass('/admin/notices')}>공지사항</Link>
          <Link to="/admin/members" className={navLinkClass('/admin/members')}>회원관리</Link>

          {/* 조직도 드롭다운 */}
          <div
            className="relative group"
            onMouseEnter={() => setMenuOpen('org')}
            onMouseLeave={() => setMenuOpen(null)}
          >
            <button className="py-2">조직도 ▾</button>
            {menuOpen === 'org' && (
              <div className="absolute bg-gray-800 shadow mt-1 rounded z-40">
                <Link to="/admin/tree/recommend" className={dropdownItemClass('/admin/tree/recommend')}>추천 조직도</Link>
                <Link to="/admin/tree/sponsor" className={dropdownItemClass('/admin/tree/sponsor')}>후원 조직도</Link>
              </div>
            )}
          </div>

          {/* 지급관리 드롭다운 */}
          <div
            className="relative group"
            onMouseEnter={() => setMenuOpen('reward')}
            onMouseLeave={() => setMenuOpen(null)}
          >
            <button className="py-2">지급관리 ▾</button>
            {menuOpen === 'reward' && (
              <div className="absolute bg-gray-800 shadow mt-1 rounded z-40">
                <Link to="/admin/code-rewards" className={dropdownItemClass('/admin/code-rewards')}>코드지급</Link>
                <Link to="/admin/points" className={dropdownItemClass('/admin/points')}>포인트지급</Link>
              </div>
            )}
          </div>

          <Link to="/admin/deposit" className={navLinkClass('/admin/deposit')}>입금관리</Link>
          <Link to="/admin/withdraws" className={navLinkClass('/admin/withdraws')}>출금관리</Link>
          <Link to="/admin/products" className={navLinkClass('/admin/products')}>상품관리</Link>
          <Link to="/admin/centers" className={navLinkClass('/admin/centers')}>센터관리</Link>
          <Link to="/admin/rewards" className={navLinkClass('/admin/rewards')}>수당관리</Link>
          <Link to="/admin/settings" className={navLinkClass('/admin/settings')}>환경설정</Link>
        </nav>
      </header>

      {/* 통계 요약 컴포넌트 */}
      {StatsComponent && (
        <div className="bg-white shadow p-4 md:p-6">
          <StatsComponent />
        </div>
      )}

      {/* 콘텐츠 */}
      <main className="flex-1 bg-gray-50 p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  );
}
