import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ textAlign: "center", padding: "48px 16px" }}>
      {/* 도메인 안내 배너 */}
      <div
        className="card"
        style={{
          marginBottom: 32,
          textAlign: "left",
          borderLeft: "4px solid var(--primary)",
        }}
      >
        <strong style={{ color: "var(--primary)" }}>안내</strong>
        <p
          style={{
            margin: "8px 0 0",
            color: "var(--text-muted)",
            lineHeight: 1.5,
          }}
        >
          이 도메인(limbusinfo.com)은 예전에 게임 정보 사이트로 사용되었습니다.
          현재는{" "}
          <strong style={{ color: "var(--text)" }}>
            수업 과제용 스터디 그룹 매칭 사이트
          </strong>
          로 운영 중이며, 게임 정보와는 무관합니다.
        </p>
      </div>

      <h1 style={{ fontSize: 32, marginBottom: 8 }}>KH 스터디 그룹 매칭</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: 40 }}>
        함께 공부할 스터디 그룹을 만들거나 찾아보세요.
      </p>

      <div
        style={{
          display: "flex",
          gap: 12,
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <Link to="/login">
          <button type="button">로그인</button>
        </Link>
        <Link to="/groups/create">
          <button type="button">그룹 생성</button>
        </Link>
        <Link to="/groups">
          <button
            type="button"
            style={{
              background: "var(--bg-card)",
              color: "var(--text)",
              border: "1px solid var(--border)",
            }}
          >
            그룹 목록
          </button>
        </Link>
      </div>
    </div>
  );
}
