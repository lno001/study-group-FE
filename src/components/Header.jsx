import { Link } from "react-router-dom";
import ThemeSwitcher from "./ThemeSwitcher";

export default function Header() {
  const accessToken = localStorage.getItem("accessToken");

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/";
  };

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 24px",
        borderBottom: "1px solid var(--border)",
        background: "var(--bg-card)",
      }}
    >
      <Link
        to="/"
        style={{
          color: "var(--text)",
          textDecoration: "none",
          fontWeight: 700,
        }}
      >
        KH 스터디
      </Link>

      <nav style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <Link
          to="/groups"
          style={{ color: "var(--text-muted)", textDecoration: "none" }}
        >
          그룹 보기
        </Link>
        <Link
          to="/groups/create"
          style={{ color: "var(--text-muted)", textDecoration: "none" }}
        >
          그룹 생성
        </Link>
        {accessToken ? (
          <>
            <Link
              to="/me"
              style={{ color: "var(--text-muted)", textDecoration: "none" }}
            >
              내 정보
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              style={{ padding: "6px 12px" }}
            >
              로그아웃
            </button>
          </>
        ) : (
          <Link
            to="/login"
            style={{ color: "var(--text-muted)", textDecoration: "none" }}
          >
            로그인
          </Link>
        )}
        <ThemeSwitcher />
      </nav>
    </header>
  );
}
