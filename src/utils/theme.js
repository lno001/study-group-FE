export const THEMES = ["light", "dark", "neon"];

export function getTheme() {
  return localStorage.getItem("theme") || "neon";
}

export function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}

export function initTheme() {
  setTheme(getTheme());
}
