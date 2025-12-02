import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const AdminSettings = () => {
  // Basic admin info
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');

  // Basic platform prefs
  const [sendEmailNotifications, setSendEmailNotifications] = useState(true);
  const [supportEmail, setSupportEmail] = useState('');
  const [studentPortalMessage, setStudentPortalMessage] = useState('');
  const [employerPortalMessage, setEmployerPortalMessage] = useState('');

  // Change password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSave = () => {
    // TODO: Persist these settings to your backend
    toast.success('Settings saved successfully.');
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all password fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New password and confirmation do not match.');
      return;
    }

    // TODO: Implement password update with your auth backend (e.g., Firebase)
    toast.success('Password updated successfully.');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Admin Settings
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your profile, basic preferences and password.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 md:p-6 space-y-8">
          {/* Profile */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Profile
            </h2>
            <p className="text-sm text-muted-foreground">
              Update your basic administrator information.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="admin-name">Name</Label>
                <Input
                  id="admin-name"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  placeholder="Admin Name"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="admin-email">Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@example.com"
                />
              </div>
            </div>
          </section>

          {/* Basic platform settings */}
          <section className="space-y-4 border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Platform Settings
            </h2>
            <p className="text-sm text-muted-foreground">
              Configure essential preferences for the internship portal.
            </p>

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <Label>Send email notifications</Label>
                  <p className="text-xs text-muted-foreground">
                    When enabled, important updates and alerts are sent by email.
                  </p>
                </div>
                <Switch
                  checked={sendEmailNotifications}
                  onCheckedChange={setSendEmailNotifications}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="support-email">Support email</Label>
                <Input
                  id="support-email"
                  type="email"
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  placeholder="support@institution.ac.in"
                />
                <p className="text-xs text-muted-foreground">
                  This email address is shared with students and employers for help.
                </p>
              </div>

              <div className="space-y-1">
                <Label htmlFor="student-portal-message">
                  Student portal message (optional)
                </Label>
                <Textarea
                  id="student-portal-message"
                  rows={3}
                  value={studentPortalMessage}
                  onChange={(e) => setStudentPortalMessage(e.target.value)}
                  placeholder="Short notice or message shown only to students on the portal."
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="employer-portal-message">
                  Employer portal message (optional)
                </Label>
                <Textarea
                  id="employer-portal-message"
                  rows={3}
                  value={employerPortalMessage}
                  onChange={(e) => setEmployerPortalMessage(e.target.value)}
                  placeholder="Short notice or message shown only to employers on the portal."
                />
              </div>
            </div>
          </section>

          {/* Change password */}
          <section className="space-y-4 border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Change Password
            </h2>
            <p className="text-sm text-muted-foreground">
              Update the password for your administrator account.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <Label htmlFor="current-password">Current password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="new-password">New password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="confirm-password">Confirm new password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                type="button"
                variant="destructive"
                onClick={handleChangePassword}
              >
                Update Password
              </Button>
            </div>
          </section>

          {/* Save */}
          <div className="pt-6 border-t border-gray-200 flex justify-end">
            <Button
              onClick={handleSave}
              className="w-full sm:w-auto bg-primary hover:bg-primary-hover"
            >
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
