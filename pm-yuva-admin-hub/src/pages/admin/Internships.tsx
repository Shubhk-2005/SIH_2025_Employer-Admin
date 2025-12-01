import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import StatusBadge from '@/components/admin/StatusBadge';
import InternshipDetailDialog from '@/components/admin/InternshipDetailDialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

type InternshipStatus = 'pending' | 'approved' | 'rejected' | 'closed';

const mockInternships = [
  {
    id: 1,
    title: 'Full Stack Developer Intern',
    employer: 'Tech Solutions Pvt Ltd',
    sector: 'Technology',
    city: 'Bangalore',
    mode: 'On-site',
    status: 'pending' as InternshipStatus,
    created: '2025-01-15',
  },
  {
    id: 2,
    title: 'Marketing Intern',
    employer: 'Brand Masters',
    sector: 'Marketing',
    city: 'Mumbai',
    mode: 'Hybrid',
    status: 'approved' as InternshipStatus,
    created: '2025-01-14',
  },
  {
    id: 3,
    title: 'Data Analyst Intern',
    employer: 'Analytics Corp',
    sector: 'Data Science',
    city: 'Pune',
    mode: 'Remote',
    status: 'pending' as InternshipStatus,
    created: '2025-01-14',
  },
  {
    id: 4,
    title: 'Graphic Designer',
    employer: 'Creative Studios',
    sector: 'Design',
    city: 'Delhi',
    mode: 'On-site',
    status: 'approved' as InternshipStatus,
    created: '2025-01-13',
  },
  {
    id: 5,
    title: 'Content Writer',
    employer: 'Media House Ltd',
    sector: 'Content',
    city: 'Hyderabad',
    mode: 'Remote',
    status: 'rejected' as InternshipStatus,
    created: '2025-01-13',
  },
];

const AdminInternships = () => {
  const [filter, setFilter] = useState<'all' | InternshipStatus>('all');
  const [internships, setInternships] = useState(mockInternships);
  const [selectedInternship, setSelectedInternship] = useState<typeof mockInternships[0] | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredInternships =
    filter === 'all' ? internships : internships.filter((i) => i.status === filter);

  const handleViewInternship = (internship: typeof mockInternships[0]) => {
    setSelectedInternship(internship);
    setDialogOpen(true);
  };

  const handleApprove = (id: number) => {
    setInternships(internships.map(int => 
      int.id === id ? { ...int, status: 'approved' as InternshipStatus } : int
    ));
    toast.success('Internship approved successfully');
  };

  const handleReject = (id: number) => {
    setInternships(internships.map(int => 
      int.id === id ? { ...int, status: 'rejected' as InternshipStatus } : int
    ));
    toast.error('Internship rejected');
  };

  const handleClose = (id: number) => {
    setInternships(internships.map(int => 
      int.id === id ? { ...int, status: 'closed' as InternshipStatus } : int
    ));
    toast.success('Internship closed');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Internships</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Review and manage internship postings
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {(['all', 'pending', 'approved', 'rejected', 'closed'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`
                px-3 py-1 rounded-full text-xs font-medium border transition-colors
                ${
                  filter === status
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }
              `}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {/* Table */}
        {/* Mobile View - Cards */}
        <div className="grid gap-4 md:hidden">
          {filteredInternships.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
              <p className="text-sm text-muted-foreground">No internships found with {filter} status.</p>
            </div>
          ) : (
            filteredInternships.map((internship) => (
              <div 
                key={internship.id} 
                className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 space-y-4 transition-all duration-200 active:scale-[0.99] active:shadow-none"
              >
                <div className="flex justify-between items-start gap-3">
                  <div className="space-y-1 min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 leading-tight truncate pr-2">{internship.title}</h3>
                    <p className="text-sm text-muted-foreground font-medium truncate">{internship.employer}</p>
                  </div>
                  <div className="shrink-0">
                    <StatusBadge status={internship.status} />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span className="px-2.5 py-1 bg-gray-50 rounded-md border border-gray-100 font-medium text-gray-600">
                    {internship.sector}
                  </span>
                  <span className="px-2.5 py-1 bg-gray-50 rounded-md border border-gray-100 font-medium text-gray-600">
                    {internship.city}
                  </span>
                  <span className="px-2.5 py-1 bg-gray-50 rounded-md border border-gray-100 font-medium text-gray-600">
                    {internship.mode}
                  </span>
                </div>

                {internship.status === 'approved' && (
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="w-fit text-xs bg-green-50 text-green-700 border-green-100">
                      Visible to students
                    </Badge>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-3 border-t border-gray-50 gap-3">
                  <span className="text-xs text-muted-foreground font-medium">{internship.created}</span>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      size="sm" 
                      variant="ghost"
                      className="h-8 text-xs font-medium text-primary hover:bg-blue-50"
                      onClick={() => handleViewInternship(internship)}
                    >
                      View
                    </Button>
                    {internship.status === 'pending' && (
                      <>
                        <Button 
                          size="sm" 
                          className="h-8 text-xs font-medium bg-primary hover:bg-primary-hover"
                          onClick={() => handleApprove(internship.id)}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-xs font-medium text-destructive border-destructive/20 hover:bg-destructive/5"
                          onClick={() => handleReject(internship.id)}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    {internship.status === 'approved' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs font-medium text-gray-600"
                        onClick={() => handleClose(internship.id)}
                      >
                        Close
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop View - Table */}
        <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          {filteredInternships.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-muted-foreground">No internships found with {filter} status.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Employer</TableHead>
                    <TableHead>Sector</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Mode</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInternships.map((internship) => (
                    <TableRow key={internship.id}>
                      <TableCell className="font-medium">
                        <div className="flex flex-col gap-1">
                          {internship.title}
                          {internship.status === 'approved' && (
                            <Badge variant="secondary" className="w-fit text-xs bg-green-50 text-green-700">
                              Visible to students
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{internship.employer}</TableCell>
                      <TableCell>{internship.sector}</TableCell>
                      <TableCell>{internship.city}</TableCell>
                      <TableCell>{internship.mode}</TableCell>
                      <TableCell>
                        <StatusBadge status={internship.status} />
                      </TableCell>
                      <TableCell>{internship.created}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm" 
                            variant="ghost"
                            className="h-8 text-xs text-primary"
                            onClick={() => handleViewInternship(internship)}
                          >
                            View
                          </Button>
                          {internship.status === 'pending' && (
                            <>
                              <Button 
                                size="sm" 
                                className="h-8 text-xs"
                                onClick={() => handleApprove(internship.id)}
                              >
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 text-xs text-destructive"
                                onClick={() => handleReject(internship.id)}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                          {internship.status === 'approved' && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 text-xs"
                              onClick={() => handleClose(internship.id)}
                            >
                              Close
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

      <InternshipDetailDialog
        internship={selectedInternship}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </AdminLayout>
  );
};

export default AdminInternships;
