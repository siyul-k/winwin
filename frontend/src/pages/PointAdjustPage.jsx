// ✅ 파일 위치: src/pages/PointAdjustPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PointAdjustPage = () => {
  const [memberId, setMemberId] = useState('');
  const [currentPoint, setCurrentPoint] = useState(null);
  const [adjustPoint, setAdjustPoint] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [adjustHistory, setAdjustHistory] = useState([]);

  const fetchCurrentPoint = async () => {
    if (!memberId) return;
    try {
      const res = await axios.get(`/api/points/total/${memberId}`);
      setCurrentPoint(res.data.total_points);
    } catch (err) {
      setMessage('❌ 포인트 조회 실패');
      setCurrentPoint(null);
    }
  };

  const fetchAdjustHistory = async () => {
    if (!memberId) return;
    try {
      const res = await axios.get(`/api/points/history/${memberId}`);
      setAdjustHistory(res.data);
    } catch (err) {
      setAdjustHistory([]);
    }
  };

  const handleAdjust = async () => {
    if (!memberId || !adjustPoint) {
      setMessage('회원 ID와 보정 금액을 입력하세요.');
      return;
    }
    try {
      await axios.post('/api/points/adjust', {
        member_id: memberId,
        point: parseInt(adjustPoint),
        type: 'adjustment',
        description,
      });
      setMessage('✅ 포인트 보정 완료');
      setAdjustPoint('');
      setDescription('');
      fetchCurrentPoint();
      fetchAdjustHistory();
    } catch (err) {
      setMessage('❌ 보정 실패: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await axios.delete(`/api/points/delete/${id}`);
      setMessage('🗑 삭제 완료');
      fetchCurrentPoint();
      fetchAdjustHistory();
    } catch (err) {
      setMessage('❌ 삭제 실패');
    }
  };

  const handleExcelDownload = () => {
    if (!memberId) return;
    window.open(`/api/points/export/${memberId}`, '_blank');
  };

  useEffect(() => {
    if (memberId) {
      fetchCurrentPoint();
      fetchAdjustHistory();
    }
  }, [memberId]);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">🛠 관리자 포인트 보정</h2>

      <div className="mb-4">
        <label className="block mb-1 font-medium">회원 ID</label>
        <input
          type="text"
          value={memberId}
          onChange={(e) => setMemberId(e.target.value)}
          className="border p-2 w-full"
          placeholder="예: 5"
        />
      </div>

      {currentPoint !== null && (
        <p className="mb-4">현재 포인트: <strong>{currentPoint.toLocaleString()} P</strong></p>
      )}

      <div className="mb-4">
        <label className="block mb-1 font-medium">보정 포인트 (예: +10000 또는 -5000)</label>
        <input
          type="number"
          value={adjustPoint}
          onChange={(e) => setAdjustPoint(e.target.value)}
          className="border p-2 w-full"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">보정 사유</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 w-full"
        />
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={handleAdjust}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          보정하기
        </button>
        <button
          onClick={handleExcelDownload}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          📥 엑셀 다운로드
        </button>
      </div>

      {message && <p className="mt-2 text-red-600">{message}</p>}

      {adjustHistory.length > 0 && (
        <div className="mt-8">
          <h3 className="font-semibold mb-2">📜 보정 이력</h3>
          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">ID</th>
                <th className="p-2 border">포인트</th>
                <th className="p-2 border">사유</th>
                <th className="p-2 border">일시</th>
                <th className="p-2 border">삭제</th>
              </tr>
            </thead>
            <tbody>
              {adjustHistory.map((item) => (
                <tr key={item.id}>
                  <td className="p-2 border text-center">{item.id}</td>
                  <td className="p-2 border text-right">{item.point.toLocaleString()}</td>
                  <td className="p-2 border">{item.description}</td>
                  <td className="p-2 border">{item.created_at}</td>
                  <td className="p-2 border text-center">
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-500 hover:underline"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PointAdjustPage;
