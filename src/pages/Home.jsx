import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  return (
    <div className="home">
      <div className="card home-notice">
        <strong className="home-notice-title">안내</strong>
        <p className="home-notice-text">
          이 도메인(limbusinfo.com)은 예전에 게임 정보 사이트로 사용되었습니다.
          현재는 <strong>수업 과제용 스터디 그룹 매칭 사이트</strong>로 운영
          중이며, 게임 정보와는 무관합니다.
        </p>
      </div>

      <h1 className="home-title">KH 스터디 그룹 매칭</h1>
      <p className="home-subtitle">
        함께 공부할 스터디 그룹을 만들거나 찾아보세요.
      </p>

      <div className="home-actions">
        <Link to="/login">
          <button type="button">로그인</button>
        </Link>
        <Link to="/groups/create">
          <button type="button">그룹 생성</button>
        </Link>
        <Link to="/groups">
          <button type="button" className="btn-secondary">
            그룹 목록
          </button>
        </Link>
      </div>
    </div>
  );
}
