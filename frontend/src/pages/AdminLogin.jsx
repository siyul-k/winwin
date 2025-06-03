// src/pages/AdminLogin.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminLogin() {
  console.log("✅ AdminLogin 렌더링됨; hash =", window.location.hash);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3001/api/admin-login", {
        username,
        password,
      });
      if (res.data.success) {
        localStorage.setItem("admin", JSON.stringify(res.data.admin));
        navigate("/#/admin/dashboard"); // HashRouter라면 이렇게 navigate도 해 줘야 합니다.
      } else {
        setError(res.data.message || "로그인 실패");
      }
    } catch (err) {
      console.error(err);
      setError("서버 오류");
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "80px auto",
        padding: "2rem",
        backgroundColor: "#fff",
        border: "2px solid #ccc",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "24px", marginBottom: "1.5rem", color: "#1f2937" }}>
        🛡 관리자 로그인 페이지
      </h1>
      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input
          type="text"
          placeholder="관리자 아이디"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{
            padding: "0.75rem",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            padding: "0.75rem",
            fontSize: "16px",
            border: "1px solid #ccc",
            borderRadius: "6px",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "0.75rem",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            fontSize: "16px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          🔐 관리자 로그인
        </button>
        {error && (
          <p style={{ marginTop: "0.5rem", color: "red", fontWeight: "bold" }}>{error}</p>
        )}
      </form>
    </div>
  );
}
