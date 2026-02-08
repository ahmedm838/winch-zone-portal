import { useEffect, useState } from "react";
import { getMyRole, RoleName } from "../lib/auth";

export function RoleGate({
  allow,
  children,
  fallback,
}: {
  allow: RoleName[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const [role, setRole] = useState<RoleName | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyRole()
      .then(setRole)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 text-slate-600 dark:text-slate-300">Loading...</div>;
  if (!role || !allow.includes(role)) return <>{fallback ?? <div className="p-6">No access.</div>}</>;
  return <>{children}</>;
}
