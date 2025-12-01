// src/pages/employer/EmployerApplications.tsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { backendRequest } from "@/services/backend";
import { EmployerNavbar } from "@/components/employer/EmployerNavbar";
import { EmployerFooter } from "@/components/employer/EmployerFooter";

interface Application {
  id: string;
  internship_id: string;
  student_uid: string;
  status: string; // "applied" | "under_review" | "shortlisted" | "rejected" | "selected"
}

export default function EmployerApplications() {
  const { id } = useParams<{ id: string }>(); // internship_id
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await backendRequest<Application[]>(
          `/employer/internships/${id}/applications`,
          { method: "GET" }
        );
        setApplications(data || []);
      } catch (err: any) {
        toast({
          title: "Error",
          description:
            err?.message || "Failed to load applications for this internship.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id, toast]);

  const updateStatus = async (appId: string, newStatus: string) => {
    try {
      const updated = await backendRequest<Application>(
        `/employer/applications/${appId}`,
        {
          method: "PATCH",
          body: JSON.stringify({ status: newStatus }),
        }
      );
      setApplications((prev) =>
        prev.map((a) => (a.id === appId ? updated : a))
      );
      toast({
        title: "Status updated",
        description: `Application status changed to ${newStatus}.`,
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description:
          err?.message || "Failed to update application status.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <EmployerNavbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6 md:py-8">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
              Applicants
            </h1>
            <Button variant="outline" onClick={() => navigate(-1)}>
              Back
            </Button>
          </div>
          <Card className="border border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base md:text-lg">
                Applications for this Internship
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-sm text-slate-500">Loading applications...</p>
              ) : applications.length === 0 ? (
                <p className="text-sm text-slate-500 py-4">
                  No applications have been received yet.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-left text-xs text-slate-500">
                        <th className="py-2 pr-4 font-medium">Applicant</th>
                        <th className="py-2 pr-4 font-medium">Status</th>
                        <th className="py-2 pr-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applications.map((app) => (
                        <tr
                          key={app.id}
                          className="border-b border-slate-100 last:border-0"
                        >
                          <td className="py-2 pr-4 text-slate-900">
                            {app.student_uid}
                          </td>
                          <td className="py-2 pr-4 text-slate-700 capitalize">
                            {app.status.replace("_", " ")}
                          </td>
                          <td className="py-2 pr-4">
                            <div className="flex flex-wrap gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 px-2 text-[11px]"
                                onClick={() =>
                                  updateStatus(app.id, "under_review")
                                }
                              >
                                Under review
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 px-2 text-[11px]"
                                onClick={() =>
                                  updateStatus(app.id, "shortlisted")
                                }
                              >
                                Shortlist
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 px-2 text-[11px]"
                                onClick={() =>
                                  updateStatus(app.id, "selected")
                                }
                              >
                                Select
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 px-2 text-[11px] text-red-600 border-red-200 hover:border-red-300"
                                onClick={() =>
                                  updateStatus(app.id, "rejected")
                                }
                              >
                                Reject
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <EmployerFooter />
    </div>
  );
}
