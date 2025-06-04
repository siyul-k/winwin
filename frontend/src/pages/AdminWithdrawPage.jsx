// ✅ 파일 위치: src/pages/AdminWithdrawPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminWithdrawPage = () => {
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
  try {
    const res = await axios.get('/api/admin/withdraws');
    console.log('출금데이터:', res.data);
    setRequests(Array.isArray(res.data) ? res.data : res.data.data || []);
  } catch (err) {
    console.error('출금 요청 불러오기 실패', err);
    setRequests([]);
  }
};

  const handleStatus = async (id, status) => {
    try {
      await axios.put(`/api/admin/withdraws/${id}`, { status });
      fetchRequests();
    } catch (err) {
      alert('처리 실패');
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">💸 출금 신청 목록</h2>

      <div className="overflow-x-auto">
        <table className="min-w-[900px] bg-white border rounded shadow">
          <thead className="bg-gray-100 text-sm">
            <tr>
              <th className="px-3 py-2">아이디</th>
              <th className="px-3 py-2">이름</th>
              <th className="px-3 py-2">금액</th>
              <th className="px-3 py-2">상태</th>
              <th className="px-3 py-2">요청일</th>
              <th className="px-3 py-2">액션</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((row) => (
              <tr key={row.id} className="text-sm border-b">
                <td className="px-3 py-2">{row.username}</td>
                <td className="px-3 py-2">{row.name}</td>
                <td className="px-3 py-2 text-right">{row.amount.toLocaleString()}</td>
                <td className="px-3 py-2">{row.status}</td>
                <td className="px-3 py-2">{row.requested_at?.slice(0, 10)}</td>
                <td className="px-3 py-2 space-x-2">
                  <button
                    className="bg-green-500 text-white px-2 py-1 rounded text-xs"
                    onClick={() => handleStatus(row.id, 'approved')}
                  >
                    승인
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                    onClick={() => handleStatus(row.id, 'rejected')}
                  >
                    취소
                  </button>
                </td>
              </tr>
            ))}
            {requests.length === 0 && (
              <tr><td colSpan={6} className="text-center py-4">출금 요청이 없습니다.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminWithdrawPage;
