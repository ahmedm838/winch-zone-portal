import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const nav = useNavigate();
  const [pw, setPw] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const { error } = await supabase.auth.updateUser({ password: pw });
      if (error) throw error;
      setMsg("Password updated. Please login.");
      setTimeout(() => nav("/"), 800);
    } catch (err: any) {
      setMsg(err?.message ?? "Failed to update password");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md border border-slate-200 dark:border-slate-800 rounded-2xl p-6 bg-white dark:bg-slate-950">
        <div className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Reset password</div>
        <div className="text-xs text-slate-500 mb-6">Enter a new password.</div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-slate-700 dark:text-slate-200">New password</label>
            <input value={pw} onChange={(e) => setPw(e.target.value)} type="password" required minLength={6}
              className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2 text-slate-900 dark:text-slate-100" />
          </div>
          {msg ? <div className="text-sm text-slate-700 dark:text-slate-200">{msg}</div> : null}
          <button disabled={busy} className="w-full rounded-xl px-3 py-2 text-sm bg-slate-900 text-white hover:opacity-90 disabled:opacity-60">
            {busy ? "Please wait..." : "Update password"}
          </button>
        </form>
      </div>
    </div>
  );
}
