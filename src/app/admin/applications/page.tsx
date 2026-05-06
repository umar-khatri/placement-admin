export const dynamic = "force-dynamic";

import { supabase } from "@/lib/supabase";
import { ApplicationsTable } from "./applications-table";

export default async function ApplicationsPage() {
  const { data: applications } = await supabase
    .from("applications")
    .select(`
      *,
      users ( name, email ),
      jobs ( title, company )
    `)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Applications</h2>
        <p className="text-muted-foreground">
          View all job applications and filter by status.
        </p>
      </div>
      <ApplicationsTable initialApplications={applications || []} />
    </div>
  );
}
