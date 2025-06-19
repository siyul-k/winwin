// ✅ 파일 위치: frontend/src/pages/AdminNoticesPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Edit, PlusCircle } from 'lucide-react';

export default function AdminNoticesPage() {
  const [notices, setNotices]     = useState([]);
  const [loading, setLoading]     = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm]           = useState({ title: '', content: '' });
  const [editingId, setEditingId] = useState(null);

  // 공지 목록 불러오기
  const fetchNotices = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/admin/notices');
      setNotices(res.data);
    } catch (err) {
      console.error('공지 목록 조회 실패:', err);
      setNotices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  // 모달 열기: 등록
  const openCreate = () => {
    setEditingId(null);
    setForm({ title: '', content: '' });
    setShowModal(true);
  };

  // 모달 열기: 수정
  const openEdit = (notice) => {
    setEditingId(notice.id);
    setForm({ title: notice.title, content: notice.content });
    setShowModal(true);
  };

  // 저장(등록/수정) 처리
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingId == null) {
        // 신규 등록
        await axios.post('/api/admin/notices', form);
        alert('✅ 공지가 등록되었습니다.');
      } else {
        // 수정
        await axios.put(`/api/admin/notices/${editingId}`, form);
        alert('✅ 변경되었습니다');
      }
      setShowModal(false);
      fetchNotices();
    } catch (err) {
      console.error('저장 실패:', err);
      if (editingId == null) {
        alert('❌ 공지 등록에 실패했습니다.');
      } else {
        alert('❌ 수정에 실패했습니다.');
      }
    }
  };

  // 삭제 처리
  const handleDelete = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    try {
      await axios.delete(`/api/admin/notices/${id}`);
      alert('✅ 삭제되었습니다');
      fetchNotices();
    } catch (err) {
      console.error('삭제 실패:', err);
      alert('❌ 삭제에 실패했습니다.');
    }
  };

  return (
    <div className="p-6 bg-white text-black min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">공지사항 목록</h2>
        <button
          onClick={openCreate}
          className="flex items-center bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded"
        >
          <PlusCircle className="mr-2" /> 공지추가
        </button>
      </div>

      {loading ? (
        <p>불러오는 중...</p>
      ) : (
        <table className="w-full table-auto border-collapse text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2 text-left">등록일</th>
              <th className="border px-3 py-2 text-left">제목</th>
              <th className="border px-3 py-2 text-left">작성자</th>
              <th className="border px-3 py-2 text-center">동작</th>
            </tr>
          </thead>
          <tbody>
            {notices.length > 0 ? (
              notices.map((n) => (
                <tr key={n.id} className="hover:bg-gray-50">
                  <td className="border px-3 py-2">
                    {new Date(n.created_at).toLocaleDateString()}
                  </td>
                  <td className="border px-3 py-2">{n.title}</td>
                  <td className="border px-3 py-2">관리자</td>
                  <td className="border px-3 py-2 text-center space-x-2">
                    <button onClick={() => openEdit(n)}>
                      <Edit size={18} className="text-gray-700 hover:text-black" />
                    </button>
                    <button onClick={() => handleDelete(n.id)}>
                      <Trash2 size={18} className="text-gray-700 hover:text-black" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-6">
                  등록된 공지가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* === Modal === */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg text-black">
            <h3 className="text-2xl mb-4 font-semibold">
              {editingId == null ? '공지 추가' : '공지 수정'}
            </h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">제목</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded border"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">내용</label>
                <textarea
                  className="w-full px-3 py-2 rounded border h-32"
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  required
                />
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded"
                >
                  저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
