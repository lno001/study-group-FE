export default function Footer() {
  return (
    <footer
      style={{
        marginTop: "auto",
        padding: "24px",
        borderTop: "1px solid var(--border)",
        background: "var(--bg-card)",
        color: "var(--text-muted)",
        fontSize: 14,
        textAlign: "center",
      }}
    >
      <p style={{ margin: "0 0 8px" }}>KH 스터디 그룹 매칭</p>
      <p style={{ margin: "0 0 8px" }}>
        본 사이트는 수업 과제용 스터디 매칭 서비스입니다.
      </p>
      <p style={{ margin: 0, fontSize: 12 }}>
        © {new Date().getFullYear()} KH Study Group. For educational use only.
      </p>
    </footer>
  );
}
