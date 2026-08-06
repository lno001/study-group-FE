import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { deleteGroup, getGroup } from "../api/group";
import {
  applyMember,
  decideMember,
  getMembers,
  getMyMemberStatus,
  kickMember,
  leaveGroup,
} from "../api/member";
import Toast from "../components/Toast";
import { getUserIdFromToken } from "../utils/auth";
import "./GroupDetail.css";

export default function GroupDetail() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [acceptedMembers, setAcceptedMembers] = useState([]);
  const [pendingMembers, setPendingMembers] = useState([]);
  const [myStatus, setMyStatus] = useState(""); // '' | '신청' | '수락'
  const [showMembers, setShowMembers] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: "", type: "success" });

  const myId = getUserIdFromToken();
  const isLeader = group && myId && group.leaderId === myId;
  const isLogin = !!localStorage.getItem("accessToken");

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  const load = async () => {
    setLoading(true);
    try {
      const groupRes = await getGroup(groupId);
      const g = groupRes.data.data;
      setGroup(g);

      const leader = myId && g.leaderId === myId;

      try {
        const acceptedRes = await getMembers(groupId, "수락");
        setAcceptedMembers(acceptedRes.data.data || []);
      } catch {
        setAcceptedMembers([]);
      }

      if (leader) {
        try {
          const pendingRes = await getMembers(groupId, "신청");
          setPendingMembers(pendingRes.data.data || []);
        } catch {
          setPendingMembers([]);
        }
      } else {
        setPendingMembers([]);
      }

      if (localStorage.getItem("accessToken")) {
        try {
          const myRes = await getMyMemberStatus(groupId);
          setMyStatus(myRes.data.data?.status || "");
        } catch {
          setMyStatus("");
        }
      } else {
        setMyStatus("");
      }
    } catch (err) {
      showToast(
        err.response?.data?.msg || "그룹을 불러오지 못했습니다.",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [groupId]);

  const handleApply = async () => {
    if (!isLogin) {
      showToast("로그인이 필요합니다.", "error");
      setTimeout(() => navigate("/login"), 600);
      return;
    }
    try {
      await applyMember(groupId);
      showToast("스터디 신청이 완료되었습니다.", "success");
      load();
    } catch (err) {
      showToast(err.response?.data?.msg || "신청에 실패했습니다.", "error");
    }
  };

  const handleLeaveOrCancel = async () => {
    const isPending = myStatus === "신청";
    const ok = window.confirm(
      isPending
        ? "스터디 신청을 취소할까요?"
        : "정말 이 스터디에서 탈퇴할까요?",
    );
    if (!ok) return;

    try {
      await leaveGroup(groupId);
      showToast(
        isPending ? "신청을 취소했습니다." : "스터디에서 탈퇴했습니다.",
        "success",
      );
      load();
    } catch (err) {
      showToast(err.response?.data?.msg || "처리에 실패했습니다.", "error");
    }
  };

  const handleDecide = async (memberId, status) => {
    try {
      await decideMember(groupId, memberId, status);
      showToast(
        status === "수락" ? "수락했습니다." : "거절했습니다.",
        "success",
      );
      load();
    } catch (err) {
      showToast(err.response?.data?.msg || "처리에 실패했습니다.", "error");
    }
  };

  const handleKick = async (memberId, nickname) => {
    const ok = window.confirm(`정말 "${nickname}" 님을 강퇴할까요?`);
    if (!ok) return;

    try {
      await kickMember(groupId, memberId);
      showToast("멤버를 강퇴했습니다.", "success");
      load();
    } catch (err) {
      showToast(err.response?.data?.msg || "강퇴에 실패했습니다.", "error");
    }
  };

  const handleDeleteGroup = async () => {
    const ok = window.confirm(
      "정말 이 그룹을 삭제할까요? 삭제 후 목록에서 사라집니다.",
    );
    if (!ok) return;

    try {
      await deleteGroup(groupId);
      showToast("그룹이 삭제되었습니다.", "success");
      setTimeout(() => navigate("/groups"), 600);
    } catch (err) {
      showToast(
        err.response?.data?.msg || "그룹 삭제에 실패했습니다.",
        "error",
      );
    }
  };

  if (loading) {
    return <p style={{ color: "var(--text-muted)" }}>불러오는 중...</p>;
  }

  if (!group) {
    return (
      <div>
        <p>그룹 정보가 없습니다.</p>
        <Link to="/groups">목록으로</Link>
      </div>
    );
  }

  const metaList = [
    { label: "모임 방식", value: group.meetingType },
    { label: "구역", value: group.region || "-" },
    { label: "주제", value: group.subject || "-" },
    { label: "인원", value: `${group.currentMembers}/${group.maxMembers}` },
    { label: "연령", value: group.ageRange || "무관" },
    { label: "성별", value: group.gender || "무관" },
    { label: "리더", value: group.leaderNickname },
    { label: "공개", value: group.isPublic === "N" ? "비공개" : "공개" },
  ];

  const sortedMembers = [...acceptedMembers].sort((a, b) => {
    if (a.userId === group.leaderId) return -1;
    if (b.userId === group.leaderId) return 1;

    const aTime = a.joinedAt ? new Date(a.joinedAt).getTime() : 0;
    const bTime = b.joinedAt ? new Date(b.joinedAt).getTime() : 0;
    return aTime - bTime;
  });

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Link
          to="/groups"
          style={{ color: "var(--text-muted)", textDecoration: "none" }}
        >
          ← 목록
        </Link>
      </div>

      <div className="detail-layout">
        <section className="card">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <h2 style={{ margin: 0 }}>{group.title}</h2>
            <span style={{ color: "var(--primary)", fontWeight: 700 }}>
              {group.status}
            </span>
          </div>

          <div className="detail-desc">
            {group.description || "설명이 없습니다."}
          </div>

          <div className="detail-meta">
            {metaList.map((item) => (
              <div key={item.label} className="meta-item">
                <span className="label">{item.label}</span>
                <span className="value">{item.value}</span>
              </div>
            ))}
          </div>

          <div className="detail-actions">
            {/* 그룹장 아님 + 미참여 → 신청 */}
            {group.status === "모집중" && !isLeader && !myStatus && (
              <button type="button" onClick={handleApply}>
                스터디 신청
              </button>
            )}

            {/* 신청 중 → 취소 */}
            {!isLeader && myStatus === "신청" && (
              <button
                type="button"
                onClick={handleLeaveOrCancel}
                style={{
                  background: "var(--bg-card)",
                  color: "var(--text)",
                  border: "1px solid var(--border)",
                }}
              >
                신청 취소
              </button>
            )}

            {/* 수락됨 → 탈퇴 */}
            {!isLeader && myStatus === "수락" && (
              <button
                type="button"
                onClick={handleLeaveOrCancel}
                style={{
                  background: "var(--bg-card)",
                  color: "var(--danger)",
                  border: "1px solid var(--danger)",
                }}
              >
                탈퇴
              </button>
            )}

            {isLeader && (
              <>
                <Link to={`/groups/${groupId}/edit`}>
                  <button type="button">설정 수정</button>
                </Link>
                <button
                  type="button"
                  onClick={handleDeleteGroup}
                  style={{
                    background: "var(--bg-card)",
                    color: "var(--danger)",
                    border: "1px solid var(--danger)",
                  }}
                >
                  그룹 삭제
                </button>
              </>
            )}
          </div>

          {isLeader && (
            <div style={{ marginTop: 24 }}>
              <h3 style={{ marginBottom: 12 }}>
                신청 대기 ({pendingMembers.length})
              </h3>
              {pendingMembers.length === 0 ? (
                <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
                  대기 중인 신청이 없습니다.
                </p>
              ) : (
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  {pendingMembers.map((m) => (
                    <div key={m.memberId} className="member-item">
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 8,
                          alignItems: "center",
                          flexWrap: "wrap",
                        }}
                      >
                        <strong>{m.nickname}</strong>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button
                            type="button"
                            onClick={() => handleDecide(m.memberId, "수락")}
                          >
                            수락
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDecide(m.memberId, "거절")}
                            style={{
                              background: "var(--bg-card)",
                              color: "var(--text)",
                              border: "1px solid var(--border)",
                            }}
                          >
                            거절
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>

        <aside className="member-panel">
          <button
            type="button"
            className="member-toggle"
            onClick={() => setShowMembers((v) => !v)}
          >
            {showMembers
              ? "멤버 닫기"
              : `멤버 목록 (${acceptedMembers.length})`}
          </button>

          {showMembers && (
            <div className="member-list">
              {acceptedMembers.length === 0 ? (
                <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
                  표시할 멤버가 없습니다.
                </p>
              ) : (
                sortedMembers.map((m) => {
                  const isGroupLeader = m.userId === group.leaderId;
                  return (
                    <div key={m.memberId} className="member-item">
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 8,
                          alignItems: "center",
                        }}
                      >
                        <div>
                          <strong>{m.nickname}</strong>
                          {/* 그룹장만 역할 표시, 일반 멤버는 닉네임만 */}
                          {isGroupLeader && (
                            <div
                              style={{
                                color: "var(--text-muted)",
                                fontSize: 12,
                                marginTop: 4,
                              }}
                            >
                              그룹장
                            </div>
                          )}
                        </div>
                        {isLeader && !isGroupLeader && (
                          <button
                            type="button"
                            onClick={() => handleKick(m.memberId, m.nickname)}
                            style={{
                              padding: "6px 10px",
                              background: "var(--bg-card)",
                              color: "var(--danger)",
                              border: "1px solid var(--danger)",
                              fontSize: 12,
                            }}
                          >
                            강퇴
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </aside>
      </div>

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "success" })}
      />
    </div>
  );
}
