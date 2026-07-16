"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, ShieldCheck, Users } from "lucide-react";
import { getCurrentProfile, signOut } from "@/lib/auth";
import { Header, BottomNav } from "@/components/Nav";

export default function MePage() {
  const router = useRouter();
  const [profile, setProfile] = useState(undefined);

  useEffect(() => {
    (async () => {
      const p = await getCurrentProfile();
      if (!p) {
        router.replace("/login/");
        return;
      }
      setProfile(p);
    })();
  }, [router]);

  if (!profile) {
    return <div className="p-6 text-center text-sm text-slateg">読み込み中...</div>;
  }

  const handleLogout = async () => {
    await signOut();
    router.replace("/login/");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header title="マイページ" />
      <div className="p-4">
        <div className="flex items-center gap-3 rounded-2xl border border-inkline bg-white p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FDEEEF]">
            {profile.role === "admin" ? (
              <ShieldCheck size={22} color="#D62839" />
            ) : (
              <Users size={22} color="#D62839" />
            )}
          </div>
          <div>
            <div className="text-sm font-bold text-ink">
              {profile.role === "admin"
                ? "管理者アカウント"
                : `取引先アカウント（${profile.clientName ?? "-"}）`}
            </div>
            <div className="text-xs text-slateg">{profile.email}</div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-inkline text-sm font-bold text-primary"
        >
          <LogOut size={16} /> ログアウト
        </button>
      </div>
      <div className="mt-auto">
        <BottomNav active="me" role={profile.role} />
      </div>
    </div>
  );
}
