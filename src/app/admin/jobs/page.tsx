export const dynamic = "force-dynamic";

import { supabase } from "@/lib/supabase";
import { JobsTable } from "./jobs-table";

export default async function JobsPage() {
  const { data: jobs } = await supabase
    .from("jobs")
    .select("*, users:created_by(name)")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Jobs</h2>
        <p className="text-muted-foreground">
          Review, approve, and manage job postings.
        </p>
      </div>
      <JobsTable initialJobs={jobs || []} />
    </div>
  );
}
