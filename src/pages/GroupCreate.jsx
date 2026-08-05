import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createGroup } from "../api/group";
import Toast from "../components/Toast";

export default function GroupCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    maxMembers: 5,
    meetingType: "온라인",
    region: "",
    subject: "",
    ageRange: "",
    gender: "무관",
    isPublic: "Y",
  });
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

    if (!localStorage.getItem("accessToken")) {
      showToast("로그인이 필요합니다.", "error");
      setTimeout(() => navigate("/login"), 600);
      return;
    }

    if (form.meetingType !== "온라인" && !form.region) {
      showToast("오프라인/혼합 모임은 구역을 선택해야 합니다.", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await createGroup({
        title: form.title,
        description: form.description || null,
        maxMembers: Number(form.maxMembers),
        meetingType: form.meetingType,
        region: form.region || null,
        subject: form.subject || null,
        ageRange: form.ageRange || null,
        gender: form.gender || "무관",
        isPublic: form.isPublic || "Y",
      });

      showToast("스터디 그룹이 생성되었습니다.", "success");
      const newId = res.data.data.groupId;
      setTimeout(() => navigate(`/groups/${newId}`), 600);
    } catch (err) {
      showToast(
        err.response?.data?.msg || "그룹 생성에 실패했습니다.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-narrow">
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>그룹 생성</h2>

      <form onSubmit={handleSubmit} className="card form-card">
        <label>
          제목
          <input
            name="title"
            value={form.title}
            onChange={onChange}
            required
            maxLength={100}
          />
        </label>

        <label>
          설명
          <textarea
            name="description"
            value={form.description}
            onChange={onChange}
            rows={4}
            maxLength={1000}
          />
        </label>

        <label>
          정원 (2~50)
          <input
            type="number"
            name="maxMembers"
            min={2}
            max={50}
            value={form.maxMembers}
            onChange={onChange}
            required
          />
        </label>

        <label>
          모임 방식
          <select
            name="meetingType"
            value={form.meetingType}
            onChange={onChange}
            required
          >
            <option value="온라인">온라인</option>
            <option value="오프라인">오프라인</option>
            <option value="혼합">혼합</option>
          </select>
        </label>

        <label>
          구역
          <select name="region" value={form.region} onChange={onChange}>
            <option value="">선택 안 함 (온라인 가능)</option>
            {Array.from({ length: 26 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={`${n}구`}>
                {n}구
              </option>
            ))}
          </select>
        </label>

        <label>
          주제
          <input
            name="subject"
            value={form.subject}
            onChange={onChange}
            placeholder="중등수학, 고등국어 등"
          />
        </label>

        <label>
          연령대
          <select name="ageRange" value={form.ageRange} onChange={onChange}>
            <option value="">선택 안 함</option>
            <option value="무관">무관</option>
            <option value="10대">10대</option>
            <option value="20대">20대</option>
            <option value="30대">30대</option>
            <option value="40대">40대</option>
            <option value="50대 이상">50대 이상</option>
          </select>
        </label>

        <label>
          성별
          <select name="gender" value={form.gender} onChange={onChange}>
            <option value="무관">무관</option>
            <option value="남">남</option>
            <option value="여">여</option>
          </select>
        </label>

        <label>
          공개 여부
          <select name="isPublic" value={form.isPublic} onChange={onChange}>
            <option value="Y">공개</option>
            <option value="N">비공개</option>
          </select>
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "생성 중..." : "그룹 만들기"}
        </button>

        <Link
          to="/groups"
          style={{ textAlign: "center", color: "var(--text-muted)" }}
        >
          목록으로
        </Link>
      </form>

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "success" })}
      />
    </div>
  );
}
