"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { getCurrentProfile } from "@/lib/auth";
import { STATUS_LIST } from "@/components/StatusParts";
import { Header } from "@/components/Nav";

function FormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const [profile, setProfile] = useState(undefined);
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState({
    title: "",
    client_id: "",
    assignee: "",
    status: "未着手",
    start_date: "",
    due_date: "",
    note: "",
  });

  useEffect(() => {
    (async () => {
      const p = await getCurrentProfile();
      if (!p || p.role !== "admin") {
        router.replace("/cases/");
        return;
      }
      setProfile(p);

      const { data: clientList } = await supabase.from("clients").select("id, name");
      setClients(clientList ?? []);
      if (clientList?.length) {
        setForm((f) => ({ ...f, client_id: clientList[0].id }));
      }

      if (editId) {
        const { data: existing } = await supabase
          .from("cases")
          .select("*")
          .eq("id", editId)
          .single();
        if (existing) setForm(existing);
      }
    })();
  }, [editId, router]);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const save = async () => {
    if (!form.title || !form.client_id) return;

    if (editId) {
      await supabase
        .from("cases")
        .update({ ...form, updated_at: new Date().toISOString() })
        .eq("id", editId);
    } else {
      await supabase.from("cases").insert({ ...form });
    }
    router.replace("/cases/");
  };

  if (!profile) {
    return <div className="p-6 text-center text-sm text-slateg">読み込み中...</div>;
  }

  return (
    <div className="min-h-screen pb-24">
      <Header title={editId ? "案件を編集" : "案件を新規作成"} backHref="/cases/" />
      <div className="flex flex-col gap-4 p-4">
        <Field label="案件名 *">
          <input value={form.title ?? ""} onChange={set("title")} className="input" />
        </Field>
        <Field label="取引先 *">
          <select value={form.client_id ?? ""} onChange={set("client_id")} className="input">
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="担当者 *">
          <input value={form.assignee ?? ""} onChange={set("assignee")} className="input" />
        </Field>
        <Field label="ステータス">
          <select value={form.status ?? "未着手"} onChange={set("status")} className="input">
            {STATUS_LIST.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
        <Field label="開始日">
          <input
            type="date"
            value={form.start_date ?? ""}
            onChange={set("start_date")}
            className="input"
          />
        </Field>
        <Field label="納期">
          <input
            type="date"
            value={form.due_date ?? ""}
            onChange={set("due_date")}
            className="input"
          />
        </Field>
        <Field label="備考">
          <textarea
            value={form.note ?? ""}
            onChange={set("note")}
            rows={4}
            className="input resize-none"
          />
        </Field>
      </div>

      <div className="fixed bottom-0 left-1/2 flex w-full max-w-[480px] -translate-x-1/2 gap-2 border-t border-inkline bg-white p-3">
        <button
          onClick={() => router.replace("/cases/")}
          className="h-12 flex-1 rounded-xl border border-inkline text-sm font-bold text-ink"
        >
          キャンセル
        </button>
        <button
          onClick={save}
          disabled={!form.title || !form.assignee}
          className="h-12 flex-1 rounded-xl bg-primary text-sm font-bold text-white disabled:opacity-40"
        >
          保存する
        </button>
      </div>

      <style>{`.input{height:44px;padding:0 12px;border-radius:12px;border:1px solid #E4E5E8;font-size:14px;background:#fff;width:100%;}
      textarea.input{height:auto;padding:10px 12px;}`}</style>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold text-slateg">{label}</span>
      {children}
    </label>
  );
}

export default function NewCasePage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-sm text-slateg">読み込み中...</div>}>
      <FormInner />
    </Suspense>
  );
}
