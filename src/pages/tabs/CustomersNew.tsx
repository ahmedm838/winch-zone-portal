import { useState } from "react";
import { UploadBox } from "../../components/UploadBox";
import { supabase } from "../../lib/supabase";
import { uploadToBucket } from "./_shared";

export default function CustomersNew() {
  const [name, setName] = useState("");
  const [cr, setCr] = useState("");
  const [tax, setTax] = useState("");
  const [crFile, setCrFile] = useState<File | null>(null);
  const [taxFile, setTaxFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  function validate() {
    if (!name.trim()) return "Name is required.";
    if (cr && !/^[0-9]{1,6}$/.test(cr)) return "Commercial Register must be max 6 digits.";
    if (tax && !/^[0-9]{3}-[0-9]{3}-[0-9]{3}$/.test(tax)) return "Tax ID must be ###-###-###.";
    return null;
  }

  async function onSave() {
    const v = validate();
    if (v) {
      setMsg(v);
      return;
    }

    setBusy(true);
    setMsg(null);
    try {
      const { data: u } = await supabase.auth.getUser();
      const uid = u.user?.id;
      if (!uid) throw new Error("Not logged in");

      const { data: inserted, error } = await supabase
        .from("customers")
        .insert({
          name: name.trim(),
          commercial_register_no: cr || null,
          tax_id_no: tax || null,
          created_by: uid,
        })
        .select("id")
        .single();

      if (error) throw error;
      const customerId = inserted.id as string;

      let crUrl: string | null = null;
      let taxUrl: string | null = null;

      if (crFile) crUrl = await uploadToBucket("customer_docs", `${customerId}/commercial_register_${crFile.name}`, crFile);
      if (taxFile) taxUrl = await uploadToBucket("customer_docs", `${customerId}/tax_id_${taxFile.name}`, taxFile);

      if (crUrl || taxUrl) {
        const { error: upErr } = await supabase
          .from("customers")
          .update({
            commercial_register_copy_url: crUrl,
            tax_id_copy_url: taxUrl,
          })
          .eq("id", customerId);

        if (upErr) throw upErr;
      }

      setName("");
      setCr("");
      setTax("");
      setCrFile(null);
      setTaxFile(null);
      setMsg("Customer saved.");
    } catch (err: any) {
      setMsg(err?.message ?? "Failed to save");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xl font-semibold text-slate-900 dark:text-slate-100">New customer</div>
        <div className="text-xs text-slate-500">Admin only. Upload Commercial Register / Tax files (photo/pdf).</div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-slate-700 dark:text-slate-200">Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2" />
        </div>
        <div>
          <label className="text-sm text-slate-700 dark:text-slate-200">Commercial Register No. (max 6 digits)</label>
          <input value={cr} onChange={(e) => setCr(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2" />
        </div>
        <div>
          <label className="text-sm text-slate-700 dark:text-slate-200">Tax ID No. (###-###-###)</label>
          <input value={tax} onChange={(e) => setTax(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-3 py-2" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <UploadBox label="Commercial Register Copy" accept="image/*,application/pdf" onFiles={(f) => setCrFile(f[0] ?? null)} hint="Photo/PDF" />
        <UploadBox label="Tax ID Copy" accept="image/*,application/pdf" onFiles={(f) => setTaxFile(f[0] ?? null)} hint="Photo/PDF" />
      </div>

      {msg ? <div className="text-sm text-slate-700 dark:text-slate-200">{msg}</div> : null}

      <button
        disabled={busy}
        onClick={onSave}
        className="rounded-xl px-4 py-2 text-sm bg-slate-900 text-white hover:opacity-90 disabled:opacity-60"
      >
        {busy ? "Saving..." : "Save customer"}
      </button>
    </div>
  );
}
