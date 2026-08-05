import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getGroups } from "../api/group";
import Toast from "../components/Toast";

export default function GroupList() {
  const [groups, setGroups] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [region, setRegion] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "success" });

  const showToast = (message, type = "error") => {
    setToast({ message, type });
  };

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const res = await getGroups({ page, size: 10, region, status });
      const data = res.data.data;
      setGroups(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      showToast(err.response?.data?.msg || "목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [page, region, status]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <h2 style={{ margin: 0 }}>스터디 그룹</h2>
        <Link to="/groups/create">
          <button type="button">그룹 생성</button>
        </Link>
      </div>

      {/* 필터 */}
      <div
        className="card"
        style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}
      >
        <label>
          구역
          <select
            value={region}
            onChange={(e) => {
              setPage(0);
              setRegion(e.target.value);
            }}
            style={{ marginLeft: 8 }}
          >
            <option value="">전체</option>
            {Array.from({ length: 26 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={`${n}구`}>
                {n}구
              </option>
            ))}
          </select>
        </label>

        <label>
          상태
          <select
            value={status}
            onChange={(e) => {
              setPage(0);
              setStatus(e.target.value);
            }}
            style={{ marginLeft: 8 }}
          >
            <option value="">전체</option>
            <option value="모집중">모집중</option>
            <option value="마감">마감</option>
          </select>
        </label>
      </div>

      {loading && <p style={{ color: "var(--text-muted)" }}>불러오는 중...</p>}

      {!loading && groups.length === 0 && (
        <p style={{ color: "var(--text-muted)" }}>등록된 그룹이 없습니다.</p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {groups.map((g) => (
          <Link
            key={g.groupId}
            to={`/groups/${g.groupId}`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="card" style={{ transition: "border-color 0.15s" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 8,
                }}
              >
                <strong>{g.title}</strong>
                <span style={{ color: "var(--primary)", fontSize: 14 }}>
                  {g.status}
                </span>
              </div>
              <p
                style={{
                  margin: "8px 0",
                  color: "var(--text-muted)",
                  fontSize: 14,
                }}
              >
                {g.meetingType}
                {g.region ? ` · ${g.region}` : ""}
                {g.subject ? ` · ${g.subject}` : ""}
              </p>
              <div style={{ fontSize: 13, color: "var(--text-muted)" }}>
                {g.currentMembers}/{g.maxMembers}명 · 리더 {g.leaderNickname}
                {g.isPublic === "N" ? " · 비공개" : ""}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* 페이징 */}
      {totalPages > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 8,
            marginTop: 24,
          }}
        >
          <button
            type="button"
            disabled={page <= 0}
            onClick={() => setPage((p) => p - 1)}
          >
            이전
          </button>
          <span style={{ lineHeight: "40px", color: "var(--text-muted)" }}>
            {page + 1} / {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages - 1}
            onClick={() => setPage((p) => p + 1)}
          >
            다음
          </button>
        </div>
      )}

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "success" })}
      />
    </div>
  );
}
