import { useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const AdminSettings = () => {
  const [skillMatch, setSkillMatch] = useState([75]);
  const [locationMatch, setLocationMatch] = useState([60]);
  const [includeRemote, setIncludeRemote] = useState(true);
  const [limitSameState, setLimitSameState] = useState(false);

  const handleSave = () => {
    toast.success('Settings saved successfully!');
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-3xl">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configure recommendation engine parameters
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 md:p-6 space-y-8">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Recommendation Engine Settings
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Adjust how the system matches students with internships. These settings affect the recommendation algorithm.
            </p>

            <div className="space-y-6">
              {/* Skill Match Slider */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <Label htmlFor="skill-match" className="text-sm font-medium text-gray-700">
                    Skill match importance
                  </Label>
                  <span className="text-sm font-semibold text-primary">{skillMatch[0]}%</span>
                </div>
                <Slider
                  id="skill-match"
                  value={skillMatch}
                  onValueChange={setSkillMatch}
                  max={100}
                  step={5}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Higher values prioritize matching student skills with internship requirements
                </p>
              </div>

              {/* Location Match Slider */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <Label htmlFor="location-match" className="text-sm font-medium text-gray-700">
                    Location match importance
                  </Label>
                  <span className="text-sm font-semibold text-primary">{locationMatch[0]}%</span>
                </div>
                <Slider
                  id="location-match"
                  value={locationMatch}
                  onValueChange={setLocationMatch}
                  max={100}
                  step={5}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Higher values prioritize internships in the student's preferred location
                </p>
              </div>

              {/* Remote Toggle */}
              <div className="flex flex-row items-center justify-between py-3 border-t border-gray-100 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="include-remote" className="text-sm font-medium text-gray-700">
                    Include remote internships for all students
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    When enabled, remote opportunities appear in all student recommendations
                  </p>
                </div>
                <Switch
                  id="include-remote"
                  checked={includeRemote}
                  onCheckedChange={setIncludeRemote}
                />
              </div>

              {/* Same State Toggle */}
              <div className="flex flex-row items-center justify-between py-3 border-t border-gray-100 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="limit-state" className="text-sm font-medium text-gray-700">
                    Limit recommendations to same state by default
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    When enabled, students primarily see opportunities in their registered state
                  </p>
                </div>
                <Switch
                  id="limit-state"
                  checked={limitSameState}
                  onCheckedChange={setLimitSameState}
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100">
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
