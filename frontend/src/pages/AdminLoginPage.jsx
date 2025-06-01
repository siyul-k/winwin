import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });

  useEffect(() => {
    console.log("📍 Admin 로그인 페이지 접근됨");
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3001/api/admin-login", formData);
      localStorage.setItem("admin", JSON.stringify(res.data));
      navigate("/admin/dashboard");
    } catch (err) {
      alert("관리자 로그인 실패: 권한이 없거나 정보가 일치하지 않습니다.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center mb-6">🔐 Admin 로그인</h2>
        <input name="username" placeholder="아이디" onChange={handleChange} required className="input mb-4" />
        <input name="password" type="password" placeholder="비밀번호" onChange={handleChange} required className="input mb-6" />
        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700">로그인</button>
      </form>
    </div>
  );
}
