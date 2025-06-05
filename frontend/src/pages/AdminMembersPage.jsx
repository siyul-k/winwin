// ✅ 파일 위치: frontend/src/pages/AdminMembersPage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Trash2, Edit } from 'lucide-react';

export default function AdminMembersPage() {
  const [members, setMembers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [filters, setFilters] = useState({
    username: '',
    name: '',
    recommender: '',
    center: '',
    date: '',
  });
  const [enabled, setEnabled] = useState({
    username: true,
    name: false,
    recommender: false,
    center: false,
    date: false,
  });
  const [loading, setLoading] = useState(false);
  const [editMember, setEditMember] = useState(null);
  const [stats, setStats] = useState({ total: 0, today: 0, blacklist: 0, center: 0 });

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const params = { page, limit };
      Object.keys(enabled).forEach((key) => {
        if (enabled[key] && filters[key]) params[key] = filters[key];
      });
      const res = await axios.get('/api/admin/members', { params });
      if (res.data && Array.isArray(res.data.data)) {
        setMembers(res.data.data);
        setTotal(res.data.total);
      } else {
        setMembers([]);
        setTotal(0);
      }
    } catch (err) {
      console.error('회원 목록 불러오기 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get('/api/admin/members/stats');
      setStats(res.data);
    } catch (err) {
      console.error('통계 불러오기 실패:', err);
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchMembers();
  };

  const handleDownloadExcel = async () => {
    try {
      const params = {};
      Object.keys(enabled).forEach((key) => {
        if (enabled[key] && filters[key]) params[key] = filters[key];
      });
      const res = await axios.get('/api/admin/members/export', {
        params,
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `members_${Date.now()}.xlsx`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error('엑셀 다운로드 실패:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('정말 이 회원을 삭제하시겠습니까?')) return;
    try {
      await axios.delete(`/api/admin/members/${id}`);
      fetchMembers();
    } catch (err) {
      console.error('회원 삭제 실패:', err);
    }
  };

  const handleEditSave = async () => {
    try {
      await axios.put(`/api/admin/members/${editMember.id}`, editMember);
      setEditMember(null);
      fetchMembers();
    } catch (err) {
      console.error('회원 수정 실패:', err);
    }
  };

  const handlePasswordReset = () => {
    setEditMember(prev => ({ ...prev, password: 'default1234' }));
  };

  useEffect(() => {
    fetchStats();
    fetchMembers();
  }, [page]);

  return (
    <div className="p-6 overflow-x-auto">
      <h2 className="text-2xl font-bold mb-6">회원 목록</h2>

      {/* 요약 통계 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 min-w-[900px]">
        {['전체회원', 'Today', 'Blacklist', 'Center'].map((label, i) => (
          <div key={label} className="bg-white border rounded p-4 text-center shadow">
            <div className="text-gray-500 text-sm">{label}</div>
            <div className="text-xl font-bold">{Object.values(stats)[i] ?? 0}</div>
          </div>
        ))}
      </div>

      {/* 검색 필터 */}
      <div className="flex flex-wrap items-center gap-2 mb-4 min-w-[900px]">
        {['username', 'name', 'recommender', 'center', 'date'].map((key) => (
          <div key={key} className="flex items-center gap-1">
            <input
              type="checkbox"
              checked={enabled[key]}
              onChange={(e) => setEnabled({ ...enabled, [key]: e.target.checked })}
            />
            {key === 'center' ? (
              <select
                value={filters.center}
                onChange={(e) => setFilters({ ...filters, center: e.target.value })}
                className="border rounded px-2 py-1"
              >
                <option value="">센터 선택</option>
                <option value="본사">본사</option>
                <option value="센터A">센터A</option>
                <option value="센터B">센터B</option>
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
        <button onClick={handleDownloadExcel} className="bg-green-600 text-white px-4 py-2 rounded">엑셀 다운로드</button>
      </div>

      {/* 테이블 */}
      {loading ? (
        <p>불러오는 중...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-[1200px] border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-1">등록일</th>
                <th className="border px-2 py-1">아이디</th>
                <th className="border px-2 py-1">이름</th>
                <th className="border px-2 py-1">핸드폰</th>
                <th className="border px-2 py-1">센터</th>
                <th className="border px-2 py-1">추천인</th>
                <th className="border px-2 py-1">후원인</th>
                <th className="border px-2 py-1">은행</th>
                <th className="border px-2 py-1">예금주</th>
                <th className="border px-2 py-1">계좌번호</th>
                <th className="border px-2 py-1">동작</th>
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr key={m.id}>
                  <td className="border px-2 py-1">{new Date(m.created_at).toLocaleDateString('ko-KR')}</td>
                  <td className="border px-2 py-1">{m.username}</td>
                  <td className="border px-2 py-1">{m.name}</td>
                  <td className="border px-2 py-1">{m.phone}</td>
                  <td className="border px-2 py-1">{m.center}</td>
                  <td className="border px-2 py-1">{m.recommender}</td>
                  <td className="border px-2 py-1">{m.sponsor}</td>
                  <td className="border px-2 py-1">{m.bank_name}</td>
                  <td className="border px-2 py-1">{m.account_holder}</td>
                  <td className="border px-2 py-1">{m.account_number}</td>
                  <td className="border px-2 py-1 space-x-2">
                    <button onClick={() => setEditMember(m)} className="text-blue-600 hover:underline"><Edit size={16} /></button>
                    <button onClick={() => handleDelete(m.id)} className="text-red-600 hover:underline"><Trash2 size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 페이지네이션 */}
      <div className="mt-4 space-x-2">
        {Array.from({ length: Math.ceil(total / limit) }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded border ${page === i + 1 ? 'bg-blue-600 text-white' : 'bg-white'}`}
          >{i + 1}</button>
        ))}
      </div>

      {/* 수정 모달 */}
      {editMember && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">회원 정보 수정</h3>
            <label className="block mb-2">이름
              <input className="border w-full p-2" value={editMember.name} onChange={(e) => setEditMember({ ...editMember, name: e.target.value })} />
            </label>
            <label className="block mb-2">전화번호
              <input className="border w-full p-2" value={editMember.phone} onChange={(e) => setEditMember({ ...editMember, phone: e.target.value })} />
            </label>
            <label className="block mb-2">센터명
              <input className="border w-full p-2" value={editMember.center} onChange={(e) => setEditMember({ ...editMember, center: e.target.value })} />
            </label>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={handlePasswordReset} className="px-3 py-1 bg-yellow-500 text-white rounded">비밀번호 초기화</button>
              <button onClick={() => setEditMember(null)} className="px-3 py-1 bg-gray-300 rounded">취소</button>
              <button onClick={handleEditSave} className="px-3 py-1 bg-blue-600 text-white rounded">저장</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}