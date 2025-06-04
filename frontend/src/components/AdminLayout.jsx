// ✅ 파일 위치: src/components/AdminLayout.jsx
import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleClose = () => setSidebarOpen(false);

  return (
    <div className="flex min-h-screen relative">
      {/* ✅ 오버레이 (모바일용) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-10 md:hidden"
          onClick={handleClose}
        />
      )}

      {/* ✅ Sidebar */}
      <div className={`bg-gray-800 text-white w-64 p-4 space-y-2 fixed inset-y-0 z-20 transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <h2 className="text-2xl font-bold mb-4">📊 Admin</h2>
        <nav className="space-y-2 text-sm">
          <Link to="/admin/dashboard" onClick={handleClose} className="block hover:text-yellow-300">대시보드</Link>
          <Link to="/admin/members" onClick={handleClose} className="block hover:text-yellow-300">회원관리</Link>
          <Link to="/admin/deposit" onClick={handleClose} className="block hover:text-yellow-300">입금관리</Link>
          <Link to="/admin/withdraws" onClick={handleClose} className="block hover:text-yellow-300">출금관리</Link>
          <Link to="/admin/points" onClick={handleClose} className="block hover:text-yellow-300">포인트보정</Link>
          <Link to="/admin/rewards" onClick={handleClose} className="block hover:text-yellow-300">수당관리</Link>
          <Link to="/admin/settings" onClick={handleClose} className="block hover:text-yellow-300">환경설정</Link>
        </nav>
      </div>

      {/* ✅ Main Content */}
      <div className="flex-1 ml-0 md:ml-64 bg-gray-50">
        <div className="flex items-center justify-between p-4 border-b bg-white sticky top-0 z-10 shadow">
          <button className="md:hidden text-xl" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
          <h1 className="text-lg font-bold">Admin Panel</h1>
        </div>
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
