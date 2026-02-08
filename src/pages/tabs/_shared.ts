import { supabase } from "../../lib/supabase";

export type Customer = {
  id: string;
  name: string;
  contact_name: string | null;
  telephone: string | null;
  email: string | null;
  commercial_register_no: string | null;
  tax_id_no: string | null;
  commercial_register_copy_url: string | null;
  tax_id_copy_url: string | null;
  price_list_copy_url: string | null;
};

export type SimpleRow = { id: number; name: string };

export async function fetchCustomers(): Promise<Customer[]> {
  const { data, error } = await supabase
    .from("customers")
    .select("id,name,contact_name,telephone,email,commercial_register_no,tax_id_no,commercial_register_copy_url,tax_id_copy_url,price_list_copy_url")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Customer[];
}

export async function fetchMasters() {
  const [services, vehicles, payments] = await Promise.all([
    supabase.from("services").select("id,name").order("id"),
    supabase.from("vehicles").select("id,name").order("id"),
    supabase.from("payments").select("id,name").order("id"),
  ]);

  if (services.error) throw services.error;
  if (vehicles.error) throw vehicles.error;
  if (payments.error) throw payments.error;

  return {
    services: (services.data ?? []) as SimpleRow[],
    vehicles: (vehicles.data ?? []) as SimpleRow[],
    payments: (payments.data ?? []) as SimpleRow[],
  };
}

export async function uploadToBucket(bucket: string, path: string, file: File) {
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: true,
    contentType: file.type || undefined,
  });
  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}
