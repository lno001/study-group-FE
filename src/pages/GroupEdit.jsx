import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getGroup, updateGroup } from "../api/group";
import { getUserIdFromToken } from "../utils/auth";
import Toast from "../components/Toast";

export default function GroupEdit() {
  const { groupId } = useParams();
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
    status: "모집중",
    isPublic: "Y",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getGroup(groupId);
        const g = res.data.data;
        const myId = getUserIdFromToken();

        if (!myId || g.leaderId !== myId) {
          showToast("그룹 수정 권한이 없습니다.", "error");
          setTimeout(() => navigate(`/groups/${groupId}`), 800);
          return;
        }

        setForm({
          title: g.title || "",
          description: g.description || "",
          maxMembers: g.maxMembers || 5,
          meetingType: g.meetingType || "온라인",
          region: g.region || "",
          subject: g.subject || "",
          ageRange: g.ageRange || "",
          gender: g.gender || "무관",
          status: g.status || "모집중",
          isPublic: g.isPublic || "Y",
        });
      } catch (err) {
        showToast(
          err.response?.data?.msg || "그룹을 불러오지 못했습니다.",
          "error",
        );
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [groupId, navigate]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.meetingType !== "온라인" && !form.region) {
      showToast("오프라인/혼합 모임은 구역을 선택해야 합니다.", "error");
      return;
    }

    setSaving(true);
    try {
      await updateGroup(groupId, {
        title: form.title,
        description: form.description || null,
        maxMembers: Number(form.maxMembers),
        meetingType: form.meetingType,
        region: form.region || null,
        subject: form.subject || null,
        ageRange: form.ageRange || null,
        gender: form.gender,
        status: form.status,
        isPublic: form.isPublic,
      });
      showToast("설정이 수정되었습니다.", "success");
      setTimeout(() => navigate(`/groups/${groupId}`), 600);
    } catch (err) {
      showToast(err.response?.data?.msg || "수정에 실패했습니다.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p style={{ color: "var(--text-muted)" }}>불러오는 중...</p>;
  }

  return (
    <div className="page-narrow">
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>그룹 설정 수정</h2>

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
            <option value="">선택 안 함</option>
            {Array.from({ length: 26 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={`${n}구`}>
                {n}구
              </option>
            ))}
          </select>
        </label>

        <label>
          주제
          <input name="subject" value={form.subject} onChange={onChange} />
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
          <select
            name="gender"
            value={form.gender}
            onChange={onChange}
            required
          >
            <option value="무관">무관</option>
            <option value="남">남</option>
            <option value="여">여</option>
          </select>
        </label>

        <label>
          모집 상태
          <select
            name="status"
            value={form.status}
            onChange={onChange}
            required
          >
            <option value="모집중">모집중</option>
            <option value="마감">마감</option>
          </select>
        </label>

        <label>
          공개 여부
          <select
            name="isPublic"
            value={form.isPublic}
            onChange={onChange}
            required
          >
            <option value="Y">공개</option>
            <option value="N">비공개</option>
          </select>
        </label>

        <button type="submit" disabled={saving}>
          {saving ? "저장 중..." : "저장하기"}
        </button>

        <Link
          to={`/groups/${groupId}`}
          style={{ textAlign: "center", color: "var(--text-muted)" }}
        >
          취소
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
