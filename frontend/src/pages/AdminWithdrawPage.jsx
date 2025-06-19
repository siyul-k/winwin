// ✅ 파일 경로: frontend/src/pages/AdminWithdrawPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

export default function AdminWithdrawPage() {
  const [requests, setRequests] = useState([]);
  const [selected, setSelected] = useState([]);
  const [filters, setFilters] = useState({
    username: '',
    name: '',
    startDate: '',
    endDate: ''
  });
  const [enabled, setEnabled] = useState({
    username: false,
    name: false,
    date: false
  });
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    thisMonth: 0,
    lastMonth: 0
  });
  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    fetchData();
    fetchStats();
  }, []);

  const fetchData = async () => {
    const params = {};
    if (enabled.username && filters.username) params.username = filters.username;
    if (enabled.name && filters.name) params.name = filters.name;
    if (enabled.date && filters.startDate && filters.endDate) {
      params.startDate = filters.startDate;
      params.endDate = filters.endDate;
    }
    const res = await axios.get('/api/admin/withdraws', { params });
    setRequests(res.data);
    setSelected([]);
  };

  const fetchStats = async () => {
    const params = {};
    if (enabled.username && filters.username) params.username = filters.username;
    if (enabled.name && filters.name) params.name = filters.name;
    if (enabled.date && filters.startDate && filters.endDate) {
      params.startDate = filters.startDate;
      params.endDate = filters.endDate;
    }
    const res = await axios.get('/api/admin/withdraws/stats', { params });
    setStats({
      total: res.data.total || 0,
      today: res.data.today || 0,
      thisMonth: res.data.thisMonth || 0,
      lastMonth: res.data.lastMonth || 0
    });
  };

  const handleFilter = () => {
    fetchData();
    fetchStats();
  };

  const toggleSelect = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const changeStatus = async (action) => {
    if (selected.length === 0) return alert('선택된 항목이 없습니다.');
    await axios.post(`/api/admin/withdraws/${action}`, { ids: selected });
    setStatusMsg(action === 'complete' ? '완료 처리되었습니다.' : '취소 처리되었습니다.');
    fetchData();
    fetchStats();
  };

  const saveMemo = async (id, memo) => {
    await axios.post('/api/admin/withdraws/update-memo', { id, memo });
    setStatusMsg('비고가 변경되었습니다.');
    fetchData();
  };

  const deleteRequest = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    await axios.delete(`/api/admin/withdraws/${id}`);
    fetchData();
    fetchStats();
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      requests.map(r => ({
        등록일: r.created_at.replace('T',' ').slice(0,19),
        아이디: r.username,
        이름: r.name,
        종류: r.type === 'normal' ? '일반' : '센터',
        상태: r.status,
        신청금액: r.amount,
        수수료: r.fee,
        출금액: r.payout,
        은행: r.bank_name,
        예금주: r.account_holder,
        계좌번호: r.account_number,
        비고: r.memo
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, '출금내역');
    XLSX.writeFile(wb, `withdraws_${Date.now()}.xlsx`);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">출금 신청 목록</h2>

      {statusMsg && (
        <div className="mb-2 text-green-600">{statusMsg}</div>
      )}

      {/* 요약박스 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-center">
        {[
          ['총 출금액', stats.total],
          ['오늘 출금액', stats.today],
          ['당월 출금액', stats.thisMonth],
          ['전월 출금액', stats.lastMonth]
        ].map(([label, value]) => (
          <div key={label} className="bg-white p-4 rounded shadow">
            <div className="text-gray-500 text-sm">{label}</div>
            <div className="text-lg font-bold">{value.toLocaleString()}원</div>
          </div>
        ))}
      </div>

      {/* 필터 */}
      <div className="flex flex-wrap gap-2 items-center mb-4">
        {['username', 'name'].map(key => (
          <div key={key} className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={enabled[key]}
              onChange={e => setEnabled(prev => ({ ...prev, [key]: e.target.checked }))}
            />
            <input
              type="text"
              placeholder={`${key} 검색`}
              value={filters[key]}
              onChange={e => setFilters(prev => ({ ...prev, [key]: e.target.value }))}
              className="border px-2 py-1 rounded"
            />
          </div>
        ))}
        <div className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={enabled.date}
            onChange={e => setEnabled(prev => ({ ...prev, date: e.target.checked }))}
          />
          <input
            type="date"
            value={filters.startDate}
            onChange={e => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
            className="border px-2 py-1 rounded"
          />
          <input
            type="date"
            value={filters.endDate}
            onChange={e => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
            className="border px-2 py-1 rounded"
          />
        </div>
        <button onClick={handleFilter} className="bg-blue-600 text-white px-3 py-1 rounded">검색</button>
        <button onClick={exportExcel} className="bg-green-600 text-white px-3 py-1 rounded">내보내기</button>
        <button onClick={() => changeStatus('complete')} className="bg-teal-600 text-white px-3 py-1 rounded">완료처리</button>
        <button onClick={() => changeStatus('cancel')} className="bg-gray-600 text-white px-3 py-1 rounded">취소처리</button>
      </div>

      {/* 테이블 */}
      <div className="overflow-x-auto">
        <table className="min-w-[1300px] w-full border text-sm text-center">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-2 py-1">선택</th>
              <th className="border px-2 py-1">등록일</th>
              <th className="border px-2 py-1">아이디</th>
              <th className="border px-2 py-1">이름</th>
              <th className="border px-2 py-1">종류</th>
              <th className="border px-2 py-1">상태</th>
              <th className="border px-2 py-1">신청금액</th>
              <th className="border px-2 py-1">수수료</th>
              <th className="border px-2 py-1">출금액</th>
              <th className="border px-2 py-1">은행</th>
              <th className="border px-2 py-1">예금주</th>
              <th className="border px-2 py-1">계좌번호</th>
              <th className="border px-2 py-1">비고</th>
              <th className="border px-2 py-1">저장</th>
              <th className="border px-2 py-1">삭제</th>
            </tr>
          </thead>
          <tbody>
            {requests.map(r => {
              const locked = r.status !== '요청';
              return (
                <tr key={r.id}>
                  <td className="border px-2 py-1">
                    <input
                      type="checkbox"
                      disabled={locked}
                      checked={selected.includes(r.id)}
                      onChange={() => toggleSelect(r.id)}
                    />
                  </td>
                  <td className="border px-2 py-1">{r.created_at.replace('T',' ').slice(0,19)}</td>
                  <td className="border px-2 py-1">{r.username}</td>
                  <td className="border px-2 py-1">{r.name}</td>
                  <td className="border px-2 py-1">{r.type==='normal'?'일반':'센터'}</td>
                  <td className="border px-2 py-1">{r.status}</td>
                  <td className="border px-2 py-1 text-right">{r.amount.toLocaleString()}</td>
                  <td className="border px-2 py-1 text-right">{r.fee.toLocaleString()}</td>
                  <td className="border px-2 py-1 text-right">{r.payout.toLocaleString()}</td>
                  <td className="border px-2 py-1">{r.bank_name}</td>
                  <td className="border px-2 py-1">{r.account_holder}</td>
                  <td className="border px-2 py-1">{r.account_number}</td>
                  <td className="border px-2 py-1">
                    <input
                      type="text"
                      className="w-full border px-1 text-sm"
                      defaultValue={r.memo}
                      onChange={e => handleMemoChange(r.id, e.target.value)}
                      readOnly={locked}
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <button
                      className="px-2 py-1 bg-blue-500 text-white rounded text-sm"
                      onClick={() => saveMemo(r.id, memoEdits[r.id] ?? r.memo)}
                      disabled={locked}
                    >
                      저장
                    </button>
                  </td>
                  <td className="border px-2 py-1">
                    <button
                      className="px-2 py-1 bg-red-600 text-white rounded text-sm"
                      onClick={() => deleteRequest(r.id)}
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              );
            })}
            {requests.length === 0 && (
              <tr>
                <td colSpan={15} className="text-center py-4">
                  출금 요청이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
