import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();

  const handleClose = () => setSidebarOpen(false);

  const navLinkClass = (path) =>
    `px-4 py-2 text-sm font-medium rounded hover:text-yellow-300 whitespace-nowrap ${
      pathname.startsWith(path) ? 'text-yellow-300' : 'text-white'
    }`;

  return (
    <div className="flex flex-col min-h-screen">
      {/* 상단 네비게이션 바 */}
      <header className="bg-gray-800 text-white shadow flex items-center justify-between px-4 py-3 md:px-6 sticky top-0 z-20">
        <div className="text-xl font-bold flex items-center">
          <span className="mr-2">📊</span> Admin
        </div>
        <button className="md:hidden text-xl" onClick={() => setSidebarOpen(!sidebarOpen)}>
          ☰
        </button>
      </header>

      {/* 메뉴바 - 데스크탑 및 모바일 대응 */}
      <nav
        className={`bg-gray-900 text-white flex flex-col md:flex-row md:items-center md:justify-start gap-2 px-4 py-2 transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'block' : 'hidden md:flex'
        }`}
      >
        <Link to="/admin/dashboard" onClick={handleClose} className={navLinkClass('/admin/dashboard')}>
          대시보드
        </Link>
        <Link to="/admin/notices" onClick={handleClose} className={navLinkClass('/admin/notices')}>
          공지사항
        </Link>
        <Link to="/admin/members" onClick={handleClose} className={navLinkClass('/admin/members')}>
          회원관리
        </Link>
        <Link to="/admin/tree" onClick={handleClose} className={navLinkClass('/admin/tree')}>
          조직도
        </Link>
        <Link to="/admin/deposit" onClick={handleClose} className={navLinkClass('/admin/deposit')}>
          입금관리
        </Link>
        <Link to="/admin/withdraws" onClick={handleClose} className={navLinkClass('/admin/withdraws')}>
          출금관리
        </Link>
        <Link to="/admin/points" onClick={handleClose} className={navLinkClass('/admin/points')}>
          포인트보정
        </Link>
        <Link to="/admin/rewards" onClick={handleClose} className={navLinkClass('/admin/rewards')}>
          수당관리
        </Link>
        <Link to="/admin/settings" onClick={handleClose} className={navLinkClass('/admin/settings')}>
          환경설정
        </Link>
      </nav>

      {/* 콘텐츠 영역 */}
      <main className="flex-1 bg-gray-50 p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
