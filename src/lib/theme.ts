const KEY = "wz_theme";

export function initTheme() {
  const saved = localStorage.getItem(KEY);
  const isDark = saved ? saved === "dark" : true;
  if (!saved) localStorage.setItem(KEY, "dark");
  document.documentElement.classList.toggle("dark", !!isDark);
}

export function getTheme(): "dark" | "light" {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function toggleTheme() {
  const next = getTheme() === "dark" ? "light" : "dark";
  document.documentElement.classList.toggle("dark", next === "dark");
  localStorage.setItem(KEY, next);
}
