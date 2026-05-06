export const dynamic = "force-dynamic";

import { supabase } from "@/lib/supabase";
import { UsersTable } from "./users-table";

export default async function UsersPage() {
  const { data: users } = await supabase
    .from("users")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Users</h2>
        <p className="text-muted-foreground">
          Manage students, coordinators, and alumni.
        </p>
      </div>
      <UsersTable initialUsers={users || []} />
    </div>
  );
}
