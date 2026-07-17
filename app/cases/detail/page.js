"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { getCurrentProfile } from "@/lib/auth";
import { RecruitBadge, RECRUIT_LIST } from "@/components/StatusParts";
import { Header } from "@/components/Nav";

function DetailInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [profile, setProfile] = useState(undefined);
  const [item, setItem] = useState(null);
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    (async () => {
      const p = await getCurrentProfile();
      if (!p) {
        router.replace("/login/");
        return;
      }
      setProfile(p);

      const { data } = await supabase
        .from("cases")
        .select("*, clients(name)")
        .eq("id", id)
        .single();

      setItem(data);
    })();
  }, [id, router]);

  const changeStatus = async (newStatus) => {
    await supabase
      .from("cases")
      .update({ recruit_status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", id);
    setItem((prev) => ({ ...prev, recruit_status: newStatus }));
    setShowPicker(false);
  };

  const deleteCase = async () => {
    if (!confirm("この案件を削除しますか？")) return;
    await supabase.from("cases").delete().eq("id", id);
    router.replace("/cases/");
  };

  if (!profile || !item) {
    return <div className="p-6 text-center text-sm text-slateg">読み込み中...</div>;
  }

  return (
    <div className="min-h-screen pb-6">
      <Header
        title="案件詳細"
        backHref="/cases/"
        right={
          profile.role === "admin" && (
            <>
              <button onClick={() => router.push(`/cases/new/?edit=${id}`)} className="flex h-9 w-9 items-center justify-center rounded-full active:bg-gray-100">
                <Pencil size={17} color="#1F2328" />
              </button>
              <button onClick={deleteCase} className="flex h-9 w-9 items-center justify-center rounded-full active:bg-gray-100">
                <Trash2 size={17} color="#D62839" />
              </button>
            </>
          )
        }
      />

      <div className="p-4">
        <div className="rounded-2xl border border-inkline bg-white p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <RecruitBadge status={item.recruit_status} />
            {profile.role === "admin" && (
              <button onClick={() => setShowPicker(true)} className="h-8 rounded-full border border-primary px-3 text-xs font-bold text-primary">
                募集状況を変更
              </button>
            )}
          </div>
          <h2 className="mt-3 text-lg font-bold text-ink">{item.title}</h2>
        </div>

        <div className="mt-3 divide-y divide-inkline rounded-2xl border border-inkline bg-white">
          <Row label="更新日" value={item.updated_at ? new Date(item.updated_at).toLocaleDateString("ja-JP") : "-"} mono />
          <Row label="取引先" value={item.clients?.name ?? "-"} />
          <Row label="商流制限" value={item.flow_restriction || "（なし）"} />
          <Row label="業務内容" value={item.work_content || "（なし）"} multiline />
          <Row label="稼働場所" value={item.work_location || "-"} />
          <Row label="稼働開始日" value={item.start_date || "-"} mono />
          <Row label="稼働時間" value={item.work_hours || "-"} />
          <Row label="稼働日数" value={item.work_days || "-"} />
          <Row label="単価" value={item.unit_price || "-"} />
          <Row label="交通費" value={item.transportation || "-"} />
          <Row label="募集人数" value={item.recruit_count || "-"} />
          <Row label="採用フロー" value={item.hiring_flow || "（なし）"} multiline />
          <Row label="その他" value={item.other_notes || "（なし）"} multiline />
          <Row label="案件担当者" value={item.assignee_name || "-"} />
          <Row label="担当者のメール" value={item.assignee_email || "-"} />
          <Row label="担当者のライン" value={item.assignee_line || "-"} />
          <Row label="担当者の電話番号" value={item.assignee_phone || "-"} mono />
        </div>
      </div>

      {showPicker && (
        <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/40" onClick={() => setShowPicker(false)}>
          <div className="w-full max-w-[480px] rounded-t-2xl bg-white p-4 pb-6" onClick={(e) => e.stopPropagation()}>
            <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-300" />
            <h3 className="mb-3 text-sm font-bold text-ink">募集状況を選択</h3>
            <div className="flex flex-col gap-2">
              {RECRUIT_LIST.map((s) => (
                <button key={s} onClick={() => changeStatus(s)} className="flex h-12 items-center justify-between rounded-xl border px-4" style={{ borderColor: item.recruit_status === s ? "#D62839" : "#E4E5E8" }}>
                  <RecruitBadge status={s} />
                  {item.recruit_status === s && <Check size={16} color="#D62839" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, mono, multiline }) {
  return (
    <div className="flex items-start justify-between gap-3 px-4 py-3">
      <span className="shrink-0 pt-0.5 text-xs font-bold text-slateg">{label}</span>
      <span className={`text-right text-sm text-ink ${mono ? "font-mono" : ""} ${multiline ? "whitespace-pre-wrap" : ""}`}>
        {value}
      </span>
    </div>
  );
}

export default function DetailPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-sm text-slateg">読み込み中...</div>}>
      <DetailInner />
    </Suspense>
  );
}
