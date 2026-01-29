// src/container/ViewScenariosCommon/ScenarioChat/chatUtils.js

export const sanitizeMessage = (text = "") => {
  const s = String(text ?? "");
  return s
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\u0000", "") // remove null bytes safely (no regex)
    .trim();
};

export const formatTime = (isoOrDate) => {
  if (!isoOrDate) return "";
  try {
    const d = new Date(isoOrDate);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
};

export const initials = (name = "") => {
  const s = String(name ?? "").trim();
  if (!s) return "?";
  return s
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
};

export const titleCase = (s = "") =>
  String(s ?? "")
    .toLowerCase()
    .split("_")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

export const channelPrettyName = (ch) => {
  if (!ch) return "";
  if (ch.display_name) return ch.display_name; // if backend provides
  if (ch.scope === "ALL") return "All Members";
  // scope looks like "RED_TEAM" or "BLUE_TEAM"
  const team = String(ch.scope || "")
    .replace("_TEAM", "")
    .replaceAll("_", " ")
    .trim();
  return `My Team (${titleCase(team)} Team)`;
};


export const teamKeyFromScope = (scope = "") => {
  const s = String(scope || "").toUpperCase();
  if (s.includes("RED")) return "RED";
  if (s.includes("BLUE")) return "BLUE";
  if (s.includes("YELLOW")) return "YELLOW";
  if (s.includes("PURPLE")) return "PURPLE";
  return "WHITE";
};

export const hashColor = (name = "") => {
  const palette = ["#22d3ee", "#a78bfa", "#60a5fa", "#f472b6", "#34d399"];
  let sum = 0;
  const s = String(name ?? "");
  for (let i = 0; i < s.length; i++) sum += s.charCodeAt(i);
  return palette[sum % palette.length];
};

