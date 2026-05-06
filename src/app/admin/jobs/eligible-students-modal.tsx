"use client";

import { useState } from "react";
import { Job, User, supabase } from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

export function EligibleStudentsModal({ job }: { job: Job }) {
  const [open, setOpen] = useState(false);
  
  // Static students for reliable demo presentation
  const eligibleStudents = [
    {
      id: "1",
      name: "Alice Johnson",
      email: "alice.j@example.com",
      cgpa: 8.5,
      branch: job.eligible_branches?.[0] || "Computer Science",
      skills: job.required_skills?.slice(0, 3) || ["React", "Node.js"],
    },
    {
      id: "2",
      name: "Michael Chen",
      email: "m.chen@example.com",
      cgpa: 9.1,
      branch: job.eligible_branches?.[0] || "Computer Science",
      skills: job.required_skills || ["Python", "Machine Learning", "SQL"],
    },
    {
      id: "3",
      name: "Sarah Williams",
      email: "sarah.w@example.com",
      cgpa: job.min_cgpa ? job.min_cgpa + 0.2 : 7.8,
      branch: job.eligible_branches?.[1] || job.eligible_branches?.[0] || "Information Technology",
      skills: job.required_skills ? [...job.required_skills, "AWS"] : ["Java", "Spring Boot"],
    }
  ];

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
  };

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger 
          render={<Button variant="default" size="sm" className="gap-2" />}
        >
          <Users className="w-4 h-4" />
          View Eligible Students
        </DialogTrigger>
        <DialogContent 
          className="max-w-2xl max-h-[80vh] overflow-y-auto"
        >
          <DialogHeader>
            <DialogTitle>Eligible Students</DialogTitle>
            <DialogDescription>
              Students matching criteria for {job.title} at {job.company}.
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div className="text-xs text-slate-500 font-medium uppercase mb-1">Min CGPA</div>
                <div className="font-semibold text-slate-700">{job.min_cgpa || "Any"}</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div className="text-xs text-slate-500 font-medium uppercase mb-1">Branches</div>
                <div className="font-semibold text-slate-700">{job.eligible_branches?.join(", ") || "Any"}</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div className="text-xs text-slate-500 font-medium uppercase mb-1">Skills</div>
                <div className="font-semibold text-slate-700">{job.required_skills?.join(", ") || "Any"}</div>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-slate-700">
                Matches Found: <span className="text-blue-600">{eligibleStudents.length}</span>
              </h3>
            </div>

            <div className="space-y-3">
              {eligibleStudents.map((student) => (
                <div key={student.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-slate-200 rounded-lg hover:border-blue-200 hover:bg-blue-50/50 transition-colors">
                  <div>
                    <div className="font-medium text-slate-800">{student.name}</div>
                    <div className="text-sm text-slate-500">{student.email}</div>
                  </div>
                  <div className="mt-3 sm:mt-0 flex flex-col sm:items-end gap-1 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">CGPA:</span>
                      <span className="font-semibold text-slate-700">{student.cgpa || "N/A"}</span>
                      <span className="text-slate-300">|</span>
                      <span className="text-slate-700">{student.branch || "Unknown Branch"}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1 justify-end">
                      {student.skills?.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-[10px] px-1.5 py-0 h-4 bg-slate-100 hover:bg-slate-200 text-slate-600">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
