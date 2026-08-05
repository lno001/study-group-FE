import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/auth";
import Toast from "../components/Toast";

export default function Login() {
  const navigate = useNavigate();
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await login({ loginId, password });
      const { accessToken, refreshToken } = res.data.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      showToast("로그인 성공", "success");
      setTimeout(() => {
        navigate("/");
        window.location.reload();
      }, 500);
    } catch (err) {
      const msg = err.response?.data?.msg || "로그인에 실패했습니다.";
      setError(msg);
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-narrow">
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>로그인</h2>

      <form onSubmit={handleSubmit} className="card form-card">
        <label>
          아이디
          <input
            type="text"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            placeholder="영어, 숫자"
            required
          />
        </label>

        <label>
          비밀번호
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>

        {error && <p className="error-text">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "로그인 중..." : "로그인"}
        </button>
      </form>

      <p
        style={{
          textAlign: "center",
          marginTop: 16,
          color: "var(--text-muted)",
        }}
      >
        계정이 없나요?{" "}
        <Link to="/signup" style={{ color: "var(--primary)" }}>
          회원가입
        </Link>
      </p>

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "success" })}
      />
    </div>
  );
}
