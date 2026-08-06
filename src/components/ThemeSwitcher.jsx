import { useEffect, useRef, useState } from "react";
import { getTheme, setTheme, THEMES } from "../utils/theme";

const labels = {
  light: "라이트",
  dark: "다크",
  neon: "네온",
};

export default function ThemeSwitcher() {
  const [theme, setThemeState] = useState(getTheme());
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const change = (t) => {
    setTheme(t);
    setThemeState(t);
    setOpen(false);
  };

  // 바깥 클릭 시 닫기
  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="theme-switcher" ref={ref}>
      <button
        type="button"
        className="header-btn header-btn-outline"
        onClick={() => setOpen((v) => !v)}
      >
        화면 테마
      </button>

      {open && (
        <ul className="theme-menu">
          {THEMES.map((t) => (
            <li key={t}>
              <button
                type="button"
                className={`theme-menu-item ${theme === t ? "active" : ""}`}
                onClick={() => change(t)}
              >
                {labels[t]}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
