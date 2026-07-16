"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      router.replace(session ? "/cases/" : "/login/");
    });
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center text-sm text-slateg">
      読み込み中...
    </div>
  );
}
