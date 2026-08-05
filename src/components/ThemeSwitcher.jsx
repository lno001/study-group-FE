import { getTheme, setTheme, THEMES } from "../utils/theme";
import { useState } from "react";

const labels = {
  light: "라이트",
  dark: "다크",
  neon: "네온",
};

export default function ThemeSwitcher() {
  const [theme, setThemeState] = useState(getTheme());

  const change = (t) => {
    setTheme(t);
    setThemeState(t);
  };

  return (
    <div style={{ display: "flex", gap: 8 }}>
      {THEMES.map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => change(t)}
          style={{
            opacity: theme === t ? 1 : 0.5,
            background: theme === t ? "var(--primary)" : "var(--bg-card)",
            color: theme === t ? "#fff" : "var(--text)",
            border: "1px solid var(--border)",
          }}
        >
          {labels[t]}
        </button>
      ))}
    </div>
  );
}
