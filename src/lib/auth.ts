import { supabase } from "./supabase";

export type RoleName = "admin" | "user";

export async function signOut() {
  await supabase.auth.signOut();
}

export async function getMyRole(): Promise<RoleName | null> {
  const { data: u } = await supabase.auth.getUser();
  const user = u.user;
  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("role_id, roles(name)")
    .eq("user_id", user.id)
    .single();

  if (error) {
    const { data: p2 } = await supabase.from("profiles").select("role_id").eq("user_id", user.id).single();
    if (!p2) return null;
    return p2.role_id === 1 ? "admin" : "user";
  }

  const name = (data as any)?.roles?.name as RoleName | undefined;
  if (name) return name;
  return (data as any)?.role_id === 1 ? "admin" : "user";
}
