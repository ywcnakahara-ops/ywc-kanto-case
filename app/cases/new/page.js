"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { getCurrentProfile } from "@/lib/auth";
import { RECRUIT_LIST } from "@/components/StatusParts";
import { Header } from "@/components/Nav";

const NEW_CLIENT_VALUE = "__new__";

const EMPTY_FORM = {
  title: "",
  client_id: "",
  recruit_status: "○",
  flow_restriction: "",
  work_content: "",
  work_location: "",
  start_date: "",
  work_hours: "",
  work_days: "",
  unit_price: "",
  transportation: "",
  recruit_count: "",
  hiring_flow: "",
  other_notes: "",
  assignee_name: "",
  assignee_email: "",
  assignee_line: "",
  assignee_phone: "",
};

function FormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const [profile, setProfile] = useState(undefined);
  const [clients, setClients] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [newClientName, setNewClientName] = useState("");
  const [addingClient, setAddingClient] = useState(false);

  const loadClients = async () => {
    const { data } = await supabase.from("clients").select("id, name").order("name");
    setClients(data ?? []);
    return data ?? [];
  };

  useEffect(() => {
    (async () => {
      const p = await getCurrentProfile();
      if (!p || p.role !== "admin") {
        router.replace("/cases/");
        return;
      }
      setProfile(p);

      const clientList = await loadClients();
      if (clientList.length && !editId) {
        setForm((f) => ({ ...f, client_id: clientList[0].id }));
      }

      if (editId) {
        const { data: existing } = await supabase
          .from("cases")
          .select("*")
          .eq("id", editId)
          .single();
        if (existing) setForm({ ...EMPTY_FORM, ...existing });
      }
    })();
  }, [editId, router]);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleClientSelect = (e) => {
    if (e.target.value === NEW_CLIENT_VALUE) {
      setAddingClient(true);
      return;
    }
    setForm({ ...form, client_id: e.target.value });
  };

  const createClient = async () => {
    if (!newClientName.trim()) return;
    const { data, error } = await supabase
      .from("clients")
      .insert({ name: newClientName.trim() })
      .select()
      .single();
    if (error) {
      alert("取引先の追加に失敗しました: " + error.message);
      return;
    }
    await loadClients();
    setForm({ ...form, client_id: data.id });
    setNewClientName("");
    setAddingClient(false);
  };

  const save = async () => {
    if (!form.title || !form.client_id) return;

    const payload = { ...form };
    delete payload.id;
    delete payload.created_at;

    if (editId) {
      await supabase
        .from("cases")
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq("id", editId);
    } else {
      await supabase.from("cases").insert(payload);
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
        <Field label="募集状況">
          <select value={form.recruit_status} onChange={set("recruit_status")} className="input">
            {RECRUIT_LIST.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </Field>

        <Field label="取引先 *">
          <select
            value={addingClient ? NEW_CLIENT_VALUE : (form.client_id ?? "")}
            onChange={handleClientSelect}
            className="input"
          >
            {clients.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
            <option value={NEW_CLIENT_VALUE}>＋ 新しい取引先を追加</option>
          </select>
          {addingClient && (
            <div className="mt-2 flex gap-2">
              <input
                value={newClientName}
                onChange={(e) => setNewClientName(e.target.value)}
                placeholder="取引先名を入力"
                className="input flex-1"
              />
              <button
                onClick={createClient}
                className="h-11 shrink-0 rounded-xl bg-primary px-4 text-sm font-bold text-white"
              >
                追加
              </button>
            </div>
          )}
        </Field>

        <Field label="商流制限">
          <input value={form.flow_restriction ?? ""} onChange={set("flow_restriction")} className="input" />
        </Field>

        <Field label="案件名 *">
          <input value={form.title ?? ""} onChange={set("title")} className="input" />
        </Field>

        <Field label="業務内容">
          <textarea value={form.work_content ?? ""} onChange={set("work_content")} rows={3} className="input resize-none" />
        </Field>

        <Field label="稼働場所">
          <input value={form.work_location ?? ""} onChange={set("work_location")} className="input" />
        </Field>

        <Field label="稼働開始日">
          <input type="date" value={form.start_date ?? ""} onChange={set("start_date")} className="input" />
        </Field>

        <Field label="稼働時間">
          <input value={form.work_hours ?? ""} onChange={set("work_hours")} placeholder="例：9:00〜18:00" className="input" />
        </Field>

        <Field label="稼働日数">
          <input value={form.work_days ?? ""} onChange={set("work_days")} placeholder="例：週5日" className="input" />
        </Field>

        <Field label="単価">
          <input value={form.unit_price ?? ""} onChange={set("unit_price")} placeholder="例：¥300,000〜" className="input" />
        </Field>

        <Field label="交通費">
          <input value={form.transportation ?? ""} onChange={set("transportation")} className="input" />
        </Field>

        <Field label="募集人数">
          <input value={form.recruit_count ?? ""} onChange={set("recruit_count")} placeholder="例：2名" className="input" />
        </Field>

        <Field label="採用フロー">
          <textarea value={form.hiring_flow ?? ""} onChange={set("hiring_flow")} rows={3} className="input resize-none" />
        </Field>

        <Field label="その他">
          <textarea value={form.other_notes ?? ""} onChange={set("other_notes")} rows={3} className="input resize-none" />
        </Field>

        <Field label="案件担当者">
          <input value={form.assignee_name ?? ""} onChange={set("assignee_name")} className="input" />
        </Field>

        <Field label="担当者のメール">
          <input type="email" value={form.assignee_email ?? ""} onChange={set("assignee_email")} className="input" />
        </Field>

        <Field label="担当者のライン">
          <input value={form.assignee_line ?? ""} onChange={set("assignee_line")} className="input" />
        </Field>

        <Field label="担当者の電話番号">
          <input value={form.assignee_phone ?? ""} onChange={set("assignee_phone")} className="input" />
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
          disabled={!form.title || !form.client_id}
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
