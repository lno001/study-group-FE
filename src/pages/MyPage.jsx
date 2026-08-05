import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyInfo, updateMyInfo, withdraw } from "../api/user";
import Toast from "../components/Toast";

export default function MyPage() {
  const navigate = useNavigate();
  const [info, setInfo] = useState(null);
  const [mode, setMode] = useState("view"); // view | edit
  const [form, setForm] = useState({
    nickname: "",
    gender: "",
    age: "",
    education: "",
    region: "",
    genderPublic: "N",
    agePublic: "N",
    educationPublic: "N",
    regionPublic: "Y",
    currentPassword: "",
    newPassword: "",
    newPasswordConfirm: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const load = async () => {
    try {
      const res = await getMyInfo();
      const d = res.data.data;
      setInfo(d);
      setForm({
        nickname: d.nickname || "",
        gender: d.gender || "",
        age: d.age != null ? String(d.age) : "",
        education: d.education || "",
        region: d.region || "",
        genderPublic: d.genderPublic || "N",
        agePublic: d.agePublic || "N",
        educationPublic: d.educationPublic || "N",
        regionPublic: d.regionPublic || "Y",
        currentPassword: "",
        newPassword: "",
        newPasswordConfirm: "",
      });
    } catch (err) {
      showToast(
        err.response?.data?.msg || "정보를 불러오지 못했습니다.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
      return;
    }
    load();
  }, [navigate]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.currentPassword) {
      showToast("현재 비밀번호를 입력해주세요.", "error");
      return;
    }
    if (form.newPassword && form.newPassword !== form.newPasswordConfirm) {
      showToast("새 비밀번호 확인이 일치하지 않습니다.", "error");
      return;
    }
    if (form.age !== "" && Number(form.age) < 1) {
      showToast("나이는 1 이상이어야 합니다.", "error");
      return;
    }

    setSaving(true);
    try {
      const res = await updateMyInfo({
        currentPassword: form.currentPassword,
        nickname: form.nickname,
        newPassword: form.newPassword || null,
        gender: form.gender || null,
        age: form.age ? Number(form.age) : null,
        education: form.education || null,
        region: form.region || null,
        genderPublic: form.genderPublic,
        agePublic: form.agePublic,
        educationPublic: form.educationPublic,
        regionPublic: form.regionPublic,
      });
      setInfo(res.data.data);
      showToast("정보가 수정되었습니다.", "success");
      setMode("view");
    } catch (err) {
      showToast(err.response?.data?.msg || "수정에 실패했습니다.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleWithdraw = async () => {
    const ok = window.confirm(
      "정말 탈퇴하시겠습니까? 탈퇴 후 로그인할 수 없습니다.",
    );
    if (!ok) return;

    try {
      await withdraw();
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      showToast("탈퇴가 완료되었습니다.", "success");
      setTimeout(() => {
        navigate("/");
        window.location.reload();
      }, 600);
    } catch (err) {
      showToast(err.response?.data?.msg || "탈퇴에 실패했습니다.", "error");
    }
  };

  if (loading) {
    return <p style={{ color: "var(--text-muted)" }}>불러오는 중...</p>;
  }

  if (!info) {
    return <p>정보가 없습니다.</p>;
  }

  // ===== 조회 모드 =====
  if (mode === "view") {
    return (
      <div className="page-narrow">
        <h2 style={{ textAlign: "center", marginBottom: 24 }}>내 정보</h2>

        <div
          className="card"
          style={{ display: "flex", flexDirection: "column", gap: 12 }}
        >
          <div className="meta-item">
            <span className="label">아이디</span>
            <span className="value">{info.loginId}</span>
          </div>
          <div className="meta-item">
            <span className="label">닉네임</span>
            <span className="value">{info.nickname}</span>
          </div>
          <div className="meta-item">
            <span className="label">성별</span>
            <span className="value">{info.gender || "-"}</span>
          </div>
          <div className="meta-item">
            <span className="label">나이</span>
            <span className="value">{info.age ?? "-"}</span>
          </div>
          <div className="meta-item">
            <span className="label">학력</span>
            <span className="value">{info.education || "-"}</span>
          </div>
          <div className="meta-item">
            <span className="label">구역</span>
            <span className="value">{info.region || "-"}</span>
          </div>
          <div className="meta-item">
            <span className="label">공개 설정</span>
            <span className="value">
              성별 {info.genderPublic === "Y" ? "공개" : "비공개"} · 나이{" "}
              {info.agePublic === "Y" ? "공개" : "비공개"} · 학력{" "}
              {info.educationPublic === "Y" ? "공개" : "비공개"} · 구역{" "}
              {info.regionPublic === "Y" ? "공개" : "비공개"}
            </span>
          </div>

          <div className="detail-actions" style={{ marginTop: 8 }}>
            <button type="button" onClick={() => setMode("edit")}>
              수정
            </button>
            <button
              type="button"
              onClick={handleWithdraw}
              style={{
                background: "var(--bg-card)",
                color: "var(--danger)",
                border: "1px solid var(--danger)",
              }}
            >
              탈퇴
            </button>
          </div>
        </div>

        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ message: "", type: "success" })}
        />
      </div>
    );
  }

  // ===== 수정 모드 =====
  return (
    <div className="page-narrow">
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>정보 수정</h2>

      <form onSubmit={handleSubmit} className="card form-card">
        <label>
          아이디
          <input value={info.loginId} disabled />
        </label>

        <label>
          닉네임
          <input
            name="nickname"
            value={form.nickname}
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
          <input name="education" value={form.education} onChange={onChange} />
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

        <label>
          성별 공개
          <select
            name="genderPublic"
            value={form.genderPublic}
            onChange={onChange}
          >
            <option value="Y">공개</option>
            <option value="N">비공개</option>
          </select>
        </label>
        <label>
          나이 공개
          <select name="agePublic" value={form.agePublic} onChange={onChange}>
            <option value="Y">공개</option>
            <option value="N">비공개</option>
          </select>
        </label>
        <label>
          학력 공개
          <select
            name="educationPublic"
            value={form.educationPublic}
            onChange={onChange}
          >
            <option value="Y">공개</option>
            <option value="N">비공개</option>
          </select>
        </label>
        <label>
          구역 공개
          <select
            name="regionPublic"
            value={form.regionPublic}
            onChange={onChange}
          >
            <option value="Y">공개</option>
            <option value="N">비공개</option>
          </select>
        </label>

        <hr style={{ borderColor: "var(--border)", width: "100%" }} />

        <label>
          현재 비밀번호 (필수)
          <input
            type="password"
            name="currentPassword"
            value={form.currentPassword}
            onChange={onChange}
            required
          />
        </label>
        <label>
          새 비밀번호 (변경 시에만)
          <input
            type="password"
            name="newPassword"
            value={form.newPassword}
            onChange={onChange}
          />
        </label>
        <label>
          새 비밀번호 확인
          <input
            type="password"
            name="newPasswordConfirm"
            value={form.newPasswordConfirm}
            onChange={onChange}
          />
        </label>

        <button type="submit" disabled={saving}>
          {saving ? "저장 중..." : "저장하기"}
        </button>
        <button
          type="button"
          onClick={() => setMode("view")}
          style={{
            background: "var(--bg-card)",
            color: "var(--text)",
            border: "1px solid var(--border)",
          }}
        >
          취소
        </button>
      </form>

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "success" })}
      />
    </div>
  );
}
