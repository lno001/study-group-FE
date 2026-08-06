import { Link } from "react-router-dom";
import "./Header.css";
import ThemeSwitcher from "./ThemeSwitcher";

export default function Header() {
  const accessToken = localStorage.getItem("accessToken");

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    window.location.href = "/";
  };

  return (
    <header className="site-header">
      <Link to="/" className="site-logo">
        KH 스터디
      </Link>

      <nav className="site-nav">
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
