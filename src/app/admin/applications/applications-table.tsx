"use client";

import { useState } from "react";
import { Application } from "@/lib/supabase";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDistanceToNow } from "date-fns";

type ApplicationWithDetails = Application & {
  users?: { name: string; email: string };
  jobs?: { title: string; company: string };
};

export function ApplicationsTable({ initialApplications }: { initialApplications: ApplicationWithDetails[] }) {
  const [applications, setApplications] = useState<ApplicationWithDetails[]>(initialApplications);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredApplications = applications.filter((app) => 
    statusFilter === "all" ? true : app.status === statusFilter
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || "all")}>
          <SelectTrigger className="w-[180px] bg-white">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="applied">Applied</SelectItem>
            <SelectItem value="shortlisted">Shortlisted</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="hired">Hired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Applicant</TableHead>
              <TableHead>Job Title</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Applied</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApplications.map((app) => (
              <TableRow key={app.id}>
                <TableCell>
                  <div className="font-medium">{app.users?.name || 'Unknown User'}</div>
                  <div className="text-xs text-muted-foreground">{app.users?.email}</div>
                </TableCell>
                <TableCell className="font-medium">{app.jobs?.title || 'Unknown Job'}</TableCell>
                <TableCell>{app.jobs?.company || 'Unknown Company'}</TableCell>
                <TableCell>
                  <Badge variant={
                    app.status === "hired" ? "default" : 
                    app.status === "shortlisted" ? "secondary" : 
                    app.status === "rejected" ? "destructive" : "outline"
                  }>
                    {app.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right text-muted-foreground text-sm">
                  {formatDistanceToNow(new Date(app.created_at), { addSuffix: true })}
                </TableCell>
              </TableRow>
            ))}
            {filteredApplications.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No applications found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
