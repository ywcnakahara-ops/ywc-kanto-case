"use client";

export const STATUS_META = {
  "未着手": { color: "#9AA0A6", text: "#fff" },
  "進行中": { color: "#F1A208", text: "#1F2328" },
  "確認待ち": { color: "#3D6FE0", text: "#fff" },
  "完了": { color: "#2E7D32", text: "#fff" },
  "遅延": { color: "#C62828", text: "#fff" },
};
export const STATUS_LIST = Object.keys(STATUS_META);

export function StatusBadge({ status }) {
  const m = STATUS_META[status] ?? STATUS_META["未着手"];
  return (
    <span
      style={{ background: m.color, color: m.text }}
      className="whitespace-nowrap rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide"
    >
      {status}
    </span>
  );
}

export function DueProgress({ startDate, dueDate }) {
  if (!startDate || !dueDate) return null;
  const start = new Date(startDate).getTime();
  const due = new Date(dueDate).getTime();
  const now = Date.now();
  const total = due - start;
  const elapsed = now - start;
  const ratio = total > 0 ? Math.min(1, Math.max(0, elapsed / total)) : 1;
  const daysLeft = Math.ceil((due - now) / 86400000);
  const overdue = daysLeft < 0;
  const barColor = overdue ? "#C62828" : ratio > 0.75 ? "#F1A208" : "#2E7D32";

  return (
    <div className="mt-2">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#EDEEF0]">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${Math.round(ratio * 100)}%`, background: barColor }}
        />
      </div>
      <div
        className="mt-1 font-mono text-[11px]"
        style={{ color: overdue ? "#C62828" : "#767B85" }}
      >
        {overdue ? `納期超過 ${Math.abs(daysLeft)}日` : `納期まであと ${daysLeft}日`}
      </div>
    </div>
  );
}
