// ✅ 파일 경로: frontend/src/pages/DepositStats.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function DepositStats() {
  const [stats, setStats] = useState({ total: 0, today: 0 });

  useEffect(() => {
    axios.get('/api/admin/deposits/stats')
      .then(res => setStats(res.data))
      .catch(err => console.error('입금 통계 조회 실패:', err));
  }, []);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white border rounded p-4 text-center shadow">
        <div className="text-gray-500 text-sm">입금 건수(전체)</div>
        <div className="text-xl font-bold">{stats.total}</div>
      </div>
      <div className="bg-white border rounded p-4 text-center shadow">
        <div className="text-gray-500 text-sm">입금 건수(오늘)</div>
        <div className="text-xl font-bold">{stats.today}</div>
      </div>
    </div>
  );
}
