"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ChevronRight, Building2, MapPin } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { getCurrentProfile } from "@/lib/auth";
import { RecruitBadge, RECRUIT_LIST } from "@/components/StatusParts";
import { Header, BottomNav } from "@/components/Nav";

export default function CasesListPage() {
  const router = useRouter();
  const [profile, setProfile] = useState(undefined);
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("全て");

  useEffect(() => {
    (async () => {
      const p = await getCurrentProfile();
      if (!p) {
        router.replace("/login/");
        return;
      }
      setProfile(p);

      const { data, error } = await supabase
        .from("cases")
        .select("id, title, recruit_status, flow_restriction, work_location, unit_price, updated_at, clients(name)")
        .order("updated_at", { ascending: false });

      if (!error && data) setCases(data);
      setLoading(false);
    })();
  }, [router]);

  const filtered = useMemo(() => {
    return cases
      .filter((c) => (status === "全て" ? true : c.recruit_status === status))
      .filter((c) => {
        if (!keyword) return true;
        const k = keyword.toLowerCase();
        return (
          c.title.toLowerCase().includes(k) ||
          (c.clients?.name ?? "").toLowerCase().includes(k)
        );
      });
  }, [cases, status, keyword]);

  if (!profile) {
    return <div className="p-6 text-center text-sm text-slateg">読み込み中...</div>;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header title="案件一覧" />

      <div className="sticky top-14 z-10 bg-inkbg px-3 pb-2 pt-3">
        <div className="flex h-11 items-center gap-2 rounded-xl border border-inkline bg-white px-3">
          <Search size={16} color="#767B85" />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="案件名・取引先で検索"
            className="flex-1 text-sm outline-none"
          />
          {keyword && (
            <button onClick={() => setKeyword("")}>
              <X size={14} color="#767B85" />
            </button>
          )}
        </div>
        <div className="no-scrollbar mt-2 flex gap-2 overflow-x-auto pb-1">
          {["全て", ...RECRUIT_LIST].map((s) => {
            const active = status === s;
            return (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className="h-8 whitespace-nowrap rounded-full border px-3 text-xs font-bold"
                style={{
                  background: active ? "#D62839" : "#fff",
                  color: active ? "#fff" : "#767B85",
                  borderColor: active ? "#D62839" : "#E4E5E8",
                }}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-3 pb-1 text-xs font-bold text-slateg">
        {loading ? "読み込み中..." : `${filtered.length}件の案件`}
      </div>

      <div className="flex flex-1 flex-col gap-3 px-3 pb-6">
        {!loading && filtered.length === 0 && (
          <div className="py-16 text-center text-sm text-slateg">
            該当する案件がありません。
          </div>
        )}
        {filtered.map((c) => (
          <button
            key={c.id}
            onClick={() => router.push(`/cases/detail/?id=${c.id}`)}
            className="rounded-2xl border border-inkline bg-white p-4 text-left shadow-sm active:scale-[0.99]"
          >
            <div className="flex items-center justify-between gap-2">
              <RecruitBadge status={c.recruit_status} />
              <ChevronRight size={16} color="#767B85" />
            </div>
            <div className="mt-2 text-[15px] font-bold leading-snug text-ink">
              {c.title}
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slateg">
              <span className="flex items-center gap-1"><Building2 size={13} /> {c.clients?.name ?? "-"}</span>
              {c.work_location && (
                <span className="flex items-center gap-1"><MapPin size={13} /> {c.work_location}</span>
              )}
            </div>
            {(c.flow_restriction || c.unit_price) && (
              <div className="mt-1 text-xs text-slateg">
                {c.flow_restriction && <span>商流制限：{c.flow_restriction}　</span>}
                {c.unit_price && <span>単価：{c.unit_price}</span>}
              </div>
            )}
          </button>
        ))}
      </div>

      <BottomNav active="list" role={profile.role} />
    </div>
  );
}
