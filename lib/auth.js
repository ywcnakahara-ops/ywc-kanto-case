"use client";

import { supabase } from "./supabaseClient";

// 現在ログイン中のユーザーと、users_profileテーブルのロール情報を取得する。
// 未ログインの場合は null を返す。
export async function getCurrentProfile() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile, error } = await supabase
    .from("users_profile")
    .select("id, name, role, client_id, clients(name)")
    .eq("id", user.id)
    .single();

  if (error || !profile) {
    return { id: user.id, email: user.email, role: null, client_id: null };
  }

  return {
    id: user.id,
    email: user.email,
    name: profile.name,
    role: profile.role,
    client_id: profile.client_id,
    clientName: profile.clients?.name ?? null,
  };
}

export async function signOut() {
  await supabase.auth.signOut();
}
