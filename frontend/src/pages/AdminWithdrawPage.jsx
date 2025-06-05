// ✅ 파일 위치: src/pages/AdminWithdrawPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2 } from 'lucide-react';

export default function AdminWithdrawPage() {
  const [requests, setRequests] = useState([]);
  const [filters, setFilters] = useState({ username: '', name: '', startDate: '', endDate: '' });
  const [enabled, setEnabled] = useState({ username: false, name: false, date: false });
  const [stats, setStats] = useState({ total: 0, today: 0, month: 0, prev: 0 });
  const [selected, setSelected] = useState([]);

  const fetchData = async () => {
    const query = new URLSearchParams();
    if (enabled.username && filters.username) query.append('username', filters.username);
    if (enabled.name && filters.name) query.append('name', filters.name);
    if (enabled.date && filters.startDate && filters.endDate) {
      query.append('startDate', filters.startDate);
      query.append('endDate', filters.endDate);
    }

    const [res1, res2] = await Promise.all([
      axios.get(`/api/admin/withdraws?${query}`),
      axios.get(`/api/admin/withdraws/stats?${query}`),
    ]);

    setRequests(Array.isArray(res1.data) ? res1.data : []);
    setStats({
      total: res2.data.total_withdraw || 0,
      today: res2.data.today_withdraw || 0,
      month: res2.data.month_withdraw || 0,
      prev: res2.data.prev_month_withdraw || 0,
    });
  };

  const handleComplete = async () => {
    if (selected.length === 0) return;
    await axios.post('/api/admin/withdraws/complete', { ids: selected });
    setSelected([]);
    fetchData();
  };

  const handleCancel = async () => {
    if (selected.length === 0) return;
    await axios.post('/api/admin/withdraws/cancel', { ids: selected });
    setSelected([]);
    fetchData();
  };

  const handleDelete = async (id) => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      await axios.delete(`/api/admin/withdraws/${id}`);
      fetchData();
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">출금 신청 목록</h2>

      {/* 요약박스 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        {['총 출금액', '오늘 출금액', '당월 출금액', '전월 출금액'].map((label, i) => (
          <div key={label} className="bg-white p-4 shadow rounded text-center">
            <div className="text-gray-500 text-sm">{label}</div>
            <div className="text-lg font-bold">
              {Object.values(stats)[i].toLocaleString()} 원
            </div>
          </div>
        ))}
      </div>

      {/* 필터 */}
      <div className="flex flex-wrap gap-2 items-center mb-4">
        {['username', 'name'].map((key) => (
          <div key={key} className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={enabled[key]}
              onChange={(e) => setEnabled({ ...enabled, [key]: e.target.checked })}
            />
            <input
              type="text"
              placeholder={`${key} 검색`}
              value={filters[key] || ''}
              onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}
              className="border px-2 py-1 rounded"
            />
          </div>
        ))}
        <div className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={enabled.date}
            onChange={(e) => setEnabled({ ...enabled, date: e.target.checked })}
          />
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
            className="border px-2 py-1 rounded"
          />
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
            className="border px-2 py-1 rounded"
          />
        </div>
        <button onClick={fetchData} className="bg-blue-600 text-white px-3 py-1 rounded">검색</button>
        <button onClick={() => window.open('/api/admin/withdraws/export', '_blank')} className="bg-green-600 text-white px-3 py-1 rounded">내보내기</button>
        <button onClick={handleComplete} className="bg-teal-600 text-white px-3 py-1 rounded">완료처리</button>
        <button onClick={handleCancel} className="bg-gray-600 text-white px-3 py-1 rounded">취소처리</button>
      </div>

      {/* 테이블 */}
      <div className="overflow-x-auto">
        <table className="min-w-[1200px] w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">등록일</th>
              <th className="border px-2 py-1">아이디</th>
              <th className="border px-2 py-1">이름</th>
              <th className="border px-2 py-1">종류</th>
              <th className="border px-2 py-1">상태</th>
              <th className="border px-2 py-1">출금신청금액</th>
              <th className="border px-2 py-1">수수료</th>
              <th className="border px-2 py-1">출금액</th>
              <th className="border px-2 py-1">은행</th>
              <th className="border px-2 py-1">예금주</th>
              <th className="border px-2 py-1">계좌번호</th>
              <th className="border px-2 py-1">비고</th>
              <th className="border px-2 py-1">액션</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.id}>
                <td className="border px-2 py-1">{r.created_at?.slice(0, 10)}</td>
                <td className="border px-2 py-1">{r.username}</td>
                <td className="border px-2 py-1">{r.name}</td>
                <td className="border px-2 py-1">{r.type}</td>
                <td className="border px-2 py-1">{r.status}</td>
                <td className="border px-2 py-1 text-right">{r.amount?.toLocaleString()}</td>
                <td className="border px-2 py-1 text-right">{r.fee?.toLocaleString()}</td>
                <td className="border px-2 py-1 text-right">{r.actual_amount?.toLocaleString()}</td>
                <td className="border px-2 py-1">{r.bank_name}</td>
                <td className="border px-2 py-1">{r.account_holder}</td>
                <td className="border px-2 py-1">{r.account_number}</td>
                <td className="border px-2 py-1">{r.memo}</td>
                <td className="border px-2 py-1">
                  <button onClick={() => handleDelete(r.id)}><Trash2 size={16} className="text-red-500" /></button>
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr><td colSpan={13} className="text-center py-4">출금 요청이 없습니다.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
