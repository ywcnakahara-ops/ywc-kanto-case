"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (signInError) {
      setError("メールアドレスまたはパスワードが正しくありません。");
      return;
    }
    router.replace("/cases/");
  };

  return (
    <div className="flex min-h-screen flex-col justify-center px-6 py-10">
      <div className="mx-auto w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-sm">
            <ShieldCheck size={28} color="#fff" />
          </div>
          <h1 className="text-lg font-bold text-ink">Y.W.C.関東case</h1>
          <p className="mt-1 text-xs text-slateg">案件管理システム</p>
        </div>

        <form
          onSubmit={handleLogin}
          className="rounded-2xl border border-inkline bg-white p-5 shadow-sm"
        >
          <label className="mb-1.5 block text-xs font-bold text-slateg">
            メールアドレス
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4 h-11 w-full rounded-xl border border-inkline px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
          <label className="mb-1.5 block text-xs font-bold text-slateg">
            パスワード
          </label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-5 h-11 w-full rounded-xl border border-inkline px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
          />

          {error && <p className="mb-3 text-xs font-bold text-primary">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="h-12 w-full rounded-xl bg-primary text-sm font-bold text-white active:opacity-90 disabled:opacity-50"
          >
            {loading ? "ログイン中..." : "ログイン"}
          </button>
        </form>
        <p className="mt-3 text-center text-[10px] text-slateg">
          アカウントは管理者が発行します。ログインできない場合は管理者にご連絡ください。
        </p>
      </div>
    </div>
  );
}
