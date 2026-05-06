"use client";

import { useState, Fragment } from "react";
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
import { formatDistanceToNow } from "date-fns";
import { EligibleStudentsModal } from "./jobs/eligible-students-modal";

export function RecentJobsTable({ initialJobs }: { initialJobs: any[] }) {
  const [jobs, setJobs] = useState(initialJobs);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const handleStatusChange = async (id: string, newStatus: "approved" | "rejected") => {
    // ONLY update frontend state for demo purposes as requested
    setJobs(jobs.map((j) => (j.id === id ? { ...j, status: newStatus } : j)));
    toast.success(`Job marked as ${newStatus} (Demo Mode)`);
  };

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Company</TableHead>
          <TableHead>Posted By</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Time</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {jobs && jobs.length > 0 ? (
          jobs.map((job) => (
            <Fragment key={job.id}>
              <TableRow className="cursor-pointer hover:bg-blue-50/30 transition-colors" onClick={() => toggleRow(job.id)}>
                <TableCell className="font-medium">{job.title}</TableCell>
                <TableCell>{job.company}</TableCell>
                <TableCell>{job.users?.name || "Unknown"}</TableCell>
                <TableCell>
                  <Badge 
                    variant={job.status === "approved" ? "default" : job.status === "rejected" ? "destructive" : "secondary"}
                  >
                    {job.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                  {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
                </TableCell>
                <TableCell className="text-right space-x-2 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                  {job.status === "pending" && (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleStatusChange(job.id, "approved")}
                        className="text-green-600 hover:text-green-700"
                      >
                        Approve
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleStatusChange(job.id, "rejected")}
                        className="text-red-600 hover:text-red-700"
                      >
                        Reject
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
              {expandedRows.has(job.id) && (
                <TableRow className="bg-slate-50 border-none">
                  <TableCell colSpan={6} className="text-sm text-slate-600 p-6 whitespace-pre-wrap rounded-b-md">
                    <div className="font-semibold text-slate-800 mb-4 text-base">Job Description</div>
                    <div className="space-y-4">
                      <p>We are looking for an exceptional <strong>{job.title}</strong> to join our rapidly growing team at <strong>{job.company}</strong>. In this role, you will be instrumental in driving our core initiatives and building scalable solutions.</p>
                      
                      <div>
                        <div className="font-medium text-slate-700 mb-1">Key Responsibilities:</div>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Design, develop, and maintain high-performance solutions.</li>
                          <li>Collaborate closely with cross-functional teams to deliver product features.</li>
                          <li>Identify and resolve complex technical issues and performance bottlenecks.</li>
                        </ul>
                      </div>
                      
                      <div>
                        <div className="font-medium text-slate-700 mb-1">Requirements:</div>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Proven track record and professional experience in the relevant domain.</li>
                          <li>Strong analytical and problem-solving skills.</li>
                          <li>Excellent communication and teamwork abilities.</li>
                        </ul>
                      </div>

                      {job.description && (
                        <div className="pt-2 border-t border-slate-200 mt-4">
                          <div className="font-medium text-slate-700 mb-1">Additional Details:</div>
                          <p>{job.description}</p>
                        </div>
                      )}

                      {(job.min_cgpa || job.required_skills || job.eligible_branches) && (
                        <div className="pt-4 border-t border-slate-200 mt-4 bg-blue-50/50 -mx-6 -mb-6 p-6 rounded-b-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div>
                            <div className="text-sm text-blue-900 font-semibold mb-2">Eligibility Criteria</div>
                            <div className="flex flex-wrap items-center gap-3 text-xs">
                              {job.min_cgpa && (
                                <Badge variant="outline" className="bg-white border-blue-200 text-blue-700">Min CGPA: {job.min_cgpa}</Badge>
                              )}
                              {job.eligible_branches && job.eligible_branches.length > 0 && (
                                <Badge variant="outline" className="bg-white border-blue-200 text-blue-700">Branches: {job.eligible_branches.join(", ")}</Badge>
                              )}
                              {job.required_skills && job.required_skills.length > 0 && (
                                <Badge variant="outline" className="bg-white border-blue-200 text-blue-700">Skills: {job.required_skills.join(", ")}</Badge>
                              )}
                            </div>
                          </div>
                          <div className="shrink-0">
                            <EligibleStudentsModal job={job} />
                          </div>
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </Fragment>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
              No recent activity
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
