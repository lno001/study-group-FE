import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../api/auth";
import Toast from "../components/Toast";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    loginId: "",
    nickname: "",
    password: "",
    passwordConfirm: "",
    gender: "",
    age: "",
    education: "",
    region: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.passwordConfirm) {
      const msg = "비밀번호 확인이 일치하지 않습니다.";
      setError(msg);
      showToast(msg, "error");
      return;
    }

    if (form.age !== "" && Number(form.age) < 1) {
      const msg = "나이는 1 이상이어야 합니다.";
      setError(msg);
      showToast(msg, "error");
      return;
    }

    setLoading(true);
    try {
      await signup({
        loginId: form.loginId,
        nickname: form.nickname,
        password: form.password,
        gender: form.gender || null,
        age: form.age ? Number(form.age) : null,
        education: form.education || null,
        region: form.region || null,
      });
      showToast("회원가입이 완료되었습니다.", "success");
      setTimeout(() => navigate("/login"), 800);
    } catch (err) {
      const msg = err.response?.data?.msg || "회원가입에 실패했습니다.";
      setError(msg);
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-narrow">
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>회원가입</h2>

      <form onSubmit={handleSubmit} className="card form-card">
        <label>
          아이디 (영어·숫자)
          <input
            name="loginId"
            value={form.loginId}
            onChange={onChange}
            required
          />
        </label>

        <label>
          닉네임 (한글·영어·숫자)
          <input
            name="nickname"
            value={form.nickname}
            onChange={onChange}
            required
          />
        </label>

        <label>
          비밀번호
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={onChange}
            required
          />
        </label>

        <label>
          비밀번호 확인
          <input
            type="password"
            name="passwordConfirm"
            value={form.passwordConfirm}
            onChange={onChange}
            required
          />
        </label>

        <label>
          성별
          <select name="gender" value={form.gender} onChange={onChange}>
            <option value="">선택 안 함</option>
            <option value="남">남</option>
            <option value="여">여</option>
          </select>
        </label>

        <label>
          나이
          <div className="age-row">
            <button
              type="button"
              className="age-btn"
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  age: String(Math.max(1, Number(prev.age || 1) - 1)),
                }))
              }
            >
              -
            </button>
            <input
              type="number"
              name="age"
              min={1}
              value={form.age}
              onChange={(e) => {
                const v = e.target.value;
                if (v === "" || Number(v) >= 1) onChange(e);
              }}
            />
            <button
              type="button"
              className="age-btn"
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  age: String(Math.max(1, Number(prev.age || 0) + 1)),
                }))
              }
            >
              +
            </button>
          </div>
        </label>

        <label>
          학력
          <input
            name="education"
            value={form.education}
            onChange={onChange}
            placeholder="대학생, 직장인 등"
          />
        </label>

        <label>
          구역
          <select name="region" value={form.region} onChange={onChange}>
            <option value="">선택 안 함</option>
            {Array.from({ length: 26 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={`${n}구`}>
                {n}구
              </option>
            ))}
          </select>
        </label>

        {error && <p className="error-text">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "가입 중..." : "회원가입"}
        </button>
      </form>

      <p
        style={{
          textAlign: "center",
          marginTop: 16,
          color: "var(--text-muted)",
        }}
      >
        이미 계정이 있나요?{" "}
        <Link to="/login" style={{ color: "var(--primary)" }}>
          로그인
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
