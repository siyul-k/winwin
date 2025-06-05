// ✅ 파일 위치: frontend/src/pages/AdminDepositPage.jsx
import React, { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';

export default function AdminDepositPage() {
  const [deposits, setDeposits] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ username: '', name: '', date: '', status: '' });
  const [enabled, setEnabled] = useState({ username: false, name: false, date: false, status: false });
  const [stats, setStats] = useState({ total: 0, today: 0, month: 0, prevMonth: 0 });

  const fetchDeposits = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      Object.keys(enabled).forEach((key) => {
        if (enabled[key] && filters[key]) params.append(key, filters[key]);
      });
      const res = await fetch(`/api/admin/deposits?${params}`);
      const data = await res.json();
      setDeposits(data);
    } catch (err) {
      console.error('입금 조회 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/deposits/stats');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error('입금 통계 실패:', err);
    }
  };

  const handleSearch = () => {
    fetchDeposits();
  };

  const handleComplete = async () => {
    if (selected.length === 0) return;
    const res = await fetch('/api/admin/deposits/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids: selected }),
    });
    const result = await res.json();
    if (result.success) {
      alert(`${result.updatedRows}건 완료 처리됨`);
      fetchDeposits();
      setSelected([]);
    }
  };

  const handleExcelExport = () => {
    const params = new URLSearchParams();
    Object.keys(enabled).forEach((key) => {
      if (enabled[key] && filters[key]) params.append(key, filters[key]);
    });
    window.open(`/api/admin/deposits/export?${params}`, '_blank');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    await fetch(`/api/admin/deposits/${id}`, { method: 'DELETE' });
    fetchDeposits();
  };

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    fetchStats();
    fetchDeposits();
  }, []);

  return (
    <div className="p-6 overflow-x-auto">
      <h2 className="text-2xl font-bold mb-6">입금 관리</h2>

      {/* 통계 현황 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 min-w-[900px]">
        {['total', 'today', 'month', 'prevMonth'].map((key, i) => (
          <div key={key} className="bg-white border rounded p-4 text-center shadow">
            <div className="text-gray-500 text-sm">
              {['총 입금금액', '오늘 입금액', '당월 입금액', '전월 입금액'][i]}
            </div>
            <div className="text-xl font-bold">
              {stats[key].toLocaleString()} 원
            </div>
          </div>
        ))}
      </div>

      {/* 검색 필터 */}
      <div className="flex flex-wrap items-center gap-2 mb-4 min-w-[900px]">
        {['username', 'name', 'status', 'date'].map((key) => (
          <div key={key} className="flex items-center gap-1">
            <input type="checkbox" checked={enabled[key]} onChange={(e) => setEnabled({ ...enabled, [key]: e.target.checked })} />
            {key === 'status' ? (
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="border rounded px-2 py-1"
              >
                <option value="">상태 선택</option>
                <option value="pending">요청</option>
                <option value="complete">완료</option>
              </select>
            ) : (
              <input
                type={key === 'date' ? 'date' : 'text'}
                placeholder={`${key} 검색`}
                value={filters[key] || ''}
                onChange={(e) => setFilters({ ...filters, [key]: e.target.value })}
                className="border rounded px-2 py-1"
              />
            )}
          </div>
        ))}
        <button onClick={handleSearch} className="bg-blue-600 text-white px-4 py-2 rounded">검색</button>
        <button onClick={handleExcelExport} className="bg-green-600 text-white px-4 py-2 rounded">엑셀 다운로드</button>
        <button onClick={handleComplete} disabled={selected.length === 0} className="bg-emerald-600 text-white px-4 py-2 rounded">완료처리</button>
      </div>

      {/* 테이블 */}
      {loading ? (
        <p>불러오는 중...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[1200px] border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1"></th>
                <th className="border px-2 py-1">등록일</th>
                <th className="border px-2 py-1">아이디</th>
                <th className="border px-2 py-1">이름</th>
                <th className="border px-2 py-1">상태</th>
                <th className="border px-2 py-1">은행명</th>
                <th className="border px-2 py-1">예금주</th>
                <th className="border px-2 py-1">입금액</th>
                <th className="border px-2 py-1">입금확인일</th>
                <th className="border px-2 py-1">비고</th>
              </tr>
            </thead>
            <tbody>
              {deposits.map((row) => (
                <tr key={row.id} className="text-center">
                  <td className="border px-2 py-1">
                    <input
                      type="checkbox"
                      checked={selected.includes(row.id)}
                      onChange={() => toggleSelect(row.id)}
                      disabled={row.status === 'complete'}
                    />
                  </td>
                  <td className="border px-2 py-1">{new Date(row.created_at).toLocaleString('ko-KR')}</td>
                  <td className="border px-2 py-1">{row.username}</td>
                  <td className="border px-2 py-1">{row.name}</td>
                  <td className="border px-2 py-1">{row.status}</td>
                  <td className="border px-2 py-1">{row.bank_name}</td>
                  <td className="border px-2 py-1">{row.account_holder}</td>
                  <td className="border px-2 py-1 text-right">{row.amount.toLocaleString()}</td>
                  <td className="border px-2 py-1">{row.completed_at ? new Date(row.completed_at).toLocaleString('ko-KR') : '-'}</td>
                  <td className="border px-2 py-1">
                    <button onClick={() => handleDelete(row.id)} className="text-red-500 hover:underline"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
