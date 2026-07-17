"use client";

export const RECRUIT_META = {
  "○": { color: "#2E7D32", text: "#fff", label: "募集中" },
  "△": { color: "#F1A208", text: "#1F2328", label: "要相談" },
  "×": { color: "#C62828", text: "#fff", label: "締切" },
};
export const RECRUIT_LIST = ["○", "△", "×"];

export function RecruitBadge({ status }) {
  const m = RECRUIT_META[status] ?? RECRUIT_META["○"];
  return (
    <span
      style={{ background: m.color, color: m.text }}
      className="inline-flex items-center justify-center whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide"
    >
      {status}　{m.label}
    </span>
  );
}
