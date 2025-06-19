// ✅ 파일 경로: src/pages/SettingsPage.jsx
import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = "http://localhost:3001/api";

const bankList = [
  "KB국민","NH농협","IBK기업","우리","신한","KEB하나","KDB산업","BNK경남",
  "BNK부산","SC제일","광주","전북","제주","HSBC","아이엠뱅크","우체국",
  "새마을금고","수협","신협","SBI저축","씨티은행","케이뱅크","카카오뱅크","토스뱅크"
];

export default function SettingsPage() {
  const [form, setForm] = useState({
    name: "",
    recommender: "",
    center: "",
    phone: "",
    email: "",
    bank_name: "",
    account_number: "",
    account_holder: "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      axios.get(`${API_BASE}/members/${user.id}`)
        .then((res) => setForm(res.data))
        .catch(err => console.error(err));
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      await axios.put(`${API_BASE}/members/${user.id}`, {
        phone: form.phone,
        email: form.email,
        bank_name: form.bank_name,
        account_number: form.account_number,
        account_holder: form.account_holder,
      });
      alert("변경되었습니다.");
    } catch (err) {
      console.error(err);
      alert("저장 실패");
    }
  };

  const handlePasswordChange = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordForm;
    if (newPassword !== confirmPassword) {
      return alert("새 비밀번호가 일치하지 않습니다.");
    }
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      await axios.patch(`${API_BASE}/members/${user.id}/password`, {
        currentPassword,
        newPassword,
      });
      alert("비밀번호가 변경되었습니다.");
    } catch (err) {
      console.error(err);
      alert("비밀번호 변경 실패");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">프로필 설정</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">이름</label>
          <input name="name" value={form.name} readOnly className="input w-full" />
        </div>
        <div>
          <label className="block mb-1 font-medium">추천인</label>
          <input name="recommender" value={form.recommender} readOnly className="input w-full" />
        </div>
        <div>
          <label className="block mb-1 font-medium">센터</label>
          <input name="center" value={form.center} readOnly className="input w-full" />
        </div>
        <div>
          <label className="block mb-1 font-medium">전화번호</label>
          <input name="phone" value={form.phone} onChange={handleChange} className="input w-full" />
        </div>
        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input name="email" value={form.email} onChange={handleChange} className="input w-full" />
        </div>
        <div>
          <label className="block mb-1 font-medium">은행</label>
          <select
            name="bank_name"
            value={form.bank_name || ""}
            onChange={handleChange}
            className="input w-full"
          >
            <option value="">은행 선택</option>
            {bankList.map(bank => (
              <option key={bank} value={bank}>{bank}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block mb-1 font-medium">계좌번호</label>
          <input name="account_number" value={form.account_number} onChange={handleChange} className="input w-full" />
        </div>
        <div>
          <label className="block mb-1 font-medium">예금주</label>
          <input name="account_holder" value={form.account_holder} onChange={handleChange} className="input w-full" />
        </div>
      </div>

      <button
        onClick={handleSave}
        className="mt-4 w-full bg-purple-800 text-white py-2 rounded"
      >
        저장
      </button>

      <h2 className="mt-8 text-xl font-semibold">비밀번호 변경</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <div>
          <label className="block mb-1 font-medium">현재 패스워드</label>
          <input
            type="password"
            name="currentPassword"
            value={passwordForm.currentPassword}
            onChange={(e) =>
              setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
            }
            className="input w-full"
            placeholder="현재 패스워드"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">새 패스워드</label>
          <input
            type="password"
            name="newPassword"
            value={passwordForm.newPassword}
            onChange={(e) =>
              setPasswordForm({ ...passwordForm, newPassword: e.target.value })
            }
            className="input w-full"
            placeholder="새 패스워드"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">패스워드 확인</label>
          <input
            type="password"
            name="confirmPassword"
            value={passwordForm.confirmPassword}
            onChange={(e) =>
              setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
            }
            className="input w-full"
            placeholder="패스워드 확인"
          />
        </div>
      </div>

      <button
        onClick={handlePasswordChange}
        className="mt-4 w-full bg-purple-800 text-white py-2 rounded"
      >
        저장
      </button>
    </div>
  );
}
