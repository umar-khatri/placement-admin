"use client";

import { useState } from "react";
import { Report } from "@/lib/supabase";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type ReportWithDetails = Report & {
  reporter?: { name: string; email: string };
  reported_user?: { name: string; email: string };
  reported_job?: { title: string; company: string };
};

export function ReportsTable({ initialReports }: { initialReports: ReportWithDetails[] }) {
  const [reports, setReports] = useState<ReportWithDetails[]>(initialReports);

  const handleResolve = async (id: string) => {
    const { error } = await supabase
      .from("reports")
      .update({ status: "resolved" })
      .eq("id", id);

    if (error) {
      toast.error("Failed to resolve report");
      return;
    }

    setReports(reports.map((r) => (r.id === id ? { ...r, status: "resolved" } : r)));
    toast.success("Report marked as resolved");
  };

  return (
    <div className="rounded-md border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Reported By</TableHead>
            <TableHead>Target</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report) => (
            <TableRow key={report.id}>
              <TableCell>
                <div className="font-medium">{report.reporter?.name || 'Unknown'}</div>
                <div className="text-xs text-muted-foreground">{report.reporter?.email}</div>
              </TableCell>
              <TableCell>
                {report.reported_user ? (
                  <div>
                    <span className="text-xs font-semibold uppercase text-blue-600 mr-2">User</span>
                    {report.reported_user.name}
                  </div>
                ) : report.reported_job ? (
                  <div>
                    <span className="text-xs font-semibold uppercase text-purple-600 mr-2">Job</span>
                    {report.reported_job.title} ({report.reported_job.company})
                  </div>
                ) : (
                  <span className="text-muted-foreground">Unknown Target</span>
                )}
              </TableCell>
              <TableCell className="max-w-[300px] truncate" title={report.reason}>
                {report.reason}
              </TableCell>
              <TableCell>
                <Badge variant={report.status === "resolved" ? "secondary" : "destructive"}>
                  {report.status}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}
              </TableCell>
              <TableCell className="text-right">
                {report.status === "pending" && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="gap-2"
                    onClick={() => handleResolve(report.id)}
                  >
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Resolve
                  </Button>
                )}
                {report.status === "resolved" && (
                  <span className="text-sm text-muted-foreground mr-4">Resolved</span>
                )}
              </TableCell>
            </TableRow>
          ))}
          {reports.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No reports found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
