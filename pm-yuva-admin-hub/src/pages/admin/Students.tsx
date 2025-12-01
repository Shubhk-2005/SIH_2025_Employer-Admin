import AdminLayout from '@/components/admin/AdminLayout';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const mockStudents = [
  {
    id: 1,
    name: 'Rahul Verma',
    email: 'rahul.verma@example.com',
    state: 'Maharashtra',
    applications: 8,
    lastActive: '2025-01-15',
  },
  {
    id: 2,
    name: 'Priya Singh',
    email: 'priya.singh@example.com',
    state: 'Karnataka',
    applications: 12,
    lastActive: '2025-01-15',
  },
  {
    id: 3,
    name: 'Amit Kumar',
    email: 'amit.kumar@example.com',
    state: 'Delhi',
    applications: 5,
    lastActive: '2024-01-14',
  },
  {
    id: 4,
    name: 'Sneha Patel',
    email: 'sneha.patel@example.com',
    state: 'Gujarat',
    applications: 15,
    lastActive: '2024-01-14',
  },
  {
    id: 5,
    name: 'Rajesh Sharma',
    email: 'rajesh.sharma@example.com',
    state: 'Rajasthan',
    applications: 3,
    lastActive: '2024-01-13',
  },
];

const AdminStudents = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Students</h1>
          <p className="text-sm text-muted-foreground mt-1">
            View registered student accounts
          </p>
        </div>

        {/* Table */}
        {/* Mobile View - Cards */}
        <div className="grid gap-4 md:hidden">
          {mockStudents.map((student) => (
            <div 
              key={student.id} 
              className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 space-y-4 transition-all duration-200 active:scale-[0.99] active:shadow-none"
            >
              <div className="flex justify-between items-start gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900 truncate pr-2">{student.name}</h3>
                  <p className="text-sm text-muted-foreground font-medium truncate">{student.email}</p>
                </div>
                <span className="shrink-0 text-xs font-medium px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md border border-blue-100">
                  {student.state}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-50">
                <div>
                  <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">Applications</p>
                  <p className="font-semibold text-gray-900 mt-0.5">{student.applications}</p>
                </div>
                <div className="text-right">
                  <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide">Last Active</p>
                  <p className="font-semibold text-gray-900 mt-0.5">{student.lastActive}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View - Table */}
        <div className="hidden md:block bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Applications</TableHead>
                  <TableHead>Last Active</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockStudents.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.state}</TableCell>
                    <TableCell>{student.applications}</TableCell>
                    <TableCell>{student.lastActive}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminStudents;
