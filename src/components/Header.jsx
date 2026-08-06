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
        gap: 12,
        flexWrap: "wrap",
        position: relative;
        overflow: visible; /* 메뉴가 잘리지 않게 */
        z-index: 100;
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

      <nav
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Link to="/groups">
          <button type="button" className="header-btn">
            그룹 목록
          </button>
        </Link>
        <Link to="/groups/create">
          <button type="button" className="header-btn">
            그룹 생성
          </button>
        </Link>
        {accessToken ? (
          <>
            <Link to="/me">
              <button type="button" className="header-btn">
                내 정보
              </button>
            </Link>
            <button
              type="button"
              className="header-btn header-btn-outline"
              onClick={handleLogout}
            >
              로그아웃
            </button>
          </>
        ) : (
          <Link to="/login">
            <button type="button" className="header-btn">
              로그인
            </button>
          </Link>
        )}
        <ThemeSwitcher />
      </nav>
    </header>
  );
}
