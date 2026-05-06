export const dynamic = "force-dynamic";

import { supabase } from "@/lib/supabase";
import { ReportsTable } from "./reports-table";

export default async function ReportsPage() {
  const { data: reports } = await supabase
    .from("reports")
    .select(`
      *,
      reporter:reported_by ( name, email ),
      reported_user:reported_user_id ( name, email ),
      reported_job:reported_job_id ( title, company )
    `)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Reports</h2>
        <p className="text-muted-foreground">
          Review and resolve user and job reports.
        </p>
      </div>
      <ReportsTable initialReports={reports || []} />
    </div>
  );
}
