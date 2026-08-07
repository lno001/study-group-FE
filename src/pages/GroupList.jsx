import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { getGroups, getMyGroups } from "../api/group";
import Pagination from "../components/Pagination";
import Toast from "../components/Toast";
import { formatGroupDate } from "../utils/date";
import "./GroupList.css";

export default function GroupList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const mine = searchParams.get("mine") === "1";

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
      const res = mine
        ? await getMyGroups({ page, size: 10 })
        : await getGroups({ page, size: 10, region, status });
      const data = res.data.data;
      setGroups(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      if (mine && err.response?.status === 401) {
        showToast("로그인이 필요합니다.");
        setTimeout(() => navigate("/login"), 600);
        return;
      }
      showToast(err.response?.data?.msg || "목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [page, region, status, mine]);

  const goMine = () => {
    setPage(0);
    setSearchParams({ mine: "1" });
  };

  const goAll = () => {
    setPage(0);
    setSearchParams({});
  };

  return (
    <div>
      <div className="group-list-header">
        <h2>{mine ? "내 그룹" : "스터디 그룹"}</h2>
        <div className="group-list-header-actions">
          {mine ? (
            <button type="button" className="btn-secondary" onClick={goAll}>
              전체 목록
            </button>
          ) : (
            <button type="button" className="btn-secondary" onClick={goMine}>
              내 그룹 보기
            </button>
          )}
          <Link to="/groups/create">
            <button type="button">그룹 생성</button>
          </Link>
        </div>
      </div>

      {!mine && (
        <div className="card group-filters">
          <label>
            구역
            <select
              value={region}
              onChange={(e) => {
                setPage(0);
                setRegion(e.target.value);
              }}
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
            >
              <option value="">전체</option>
              <option value="모집중">모집중</option>
              <option value="마감">마감</option>
            </select>
          </label>
        </div>
      )}

      {loading && <p className="muted">불러오는 중...</p>}

      {!loading && groups.length === 0 && (
        <p className="muted">
          {mine ? "참여 중인 그룹이 없습니다." : "등록된 그룹이 없습니다."}
        </p>
      )}

      <div className="group-cards">
        {groups.map((g) => (
          <Link
            key={g.groupId}
            to={`/groups/${g.groupId}`}
            className="group-card-link"
          >
            <div className="card group-card">
              <div className="group-card-top">
                <strong>{g.title}</strong>
                <span className="group-card-status">{g.status}</span>
              </div>
              <p className="group-card-meta">
                {g.meetingType}
                {g.region ? ` · ${g.region}` : ""}
                {g.subject ? ` · ${g.subject}` : ""}
              </p>
              <div className="group-card-sub">
                {g.currentMembers}/{g.maxMembers}명 · 리더 {g.leaderNickname}
                {g.isPublic === "N" ? " · 비공개" : ""}
                {g.createdAt ? ` · ${formatGroupDate(g.createdAt)}` : ""}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <Pagination
        page={page}
        totalPages={totalPages}
        onChange={setPage}
        onError={showToast}
      />

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "success" })}
      />
    </div>
  );
}
