import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import StatusBadge from './StatusBadge';
import { Calendar, MapPin, Briefcase, Building2, IndianRupee, Clock } from 'lucide-react';

interface InternshipDetailDialogProps {
  internship: {
    id: number;
    title: string;
    employer: string;
    sector: string;
    status: 'pending' | 'approved' | 'rejected' | 'closed';
    created: string;
    description?: string;
    city?: string;
    mode?: string;
    duration?: string;
    stipend?: string;
    skills?: string[];
    requirements?: string[];
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove?: (id: number) => void;
  onReject?: (id: number) => void;
}

const InternshipDetailDialog = ({
  internship,
  open,
  onOpenChange,
  onApprove,
  onReject,
}: InternshipDetailDialogProps) => {
  if (!internship) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold text-gray-900">
                {internship.title}
              </DialogTitle>
              <DialogDescription className="flex items-center gap-2 mt-1">
                <Building2 className="h-4 w-4" />
                {internship.employer}
              </DialogDescription>
            </div>
            <StatusBadge status={internship.status} />
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Key Info Grid */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-gray-500" />
              <span className="text-gray-700">{internship.city || 'Not specified'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Briefcase className="h-4 w-4 text-gray-500" />
              <span className="text-gray-700">{internship.mode || 'On-site'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-gray-700">{internship.duration || '3 months'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <IndianRupee className="h-4 w-4 text-gray-500" />
              <span className="text-gray-700">{internship.stipend || '₹10,000/month'}</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {internship.description || 
                'This is an exciting opportunity to work with our team and gain hands-on experience in the field. You will be working on real projects and learning from experienced professionals.'}
            </p>
          </div>

          {/* Skills */}
          {internship.skills && internship.skills.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {internship.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Requirements */}
          {internship.requirements && internship.requirements.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Requirements</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                {internship.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Meta Info */}
          <div className="flex items-center gap-4 pt-4 border-t border-gray-200 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Posted: {internship.created}</span>
            </div>
            <div className="flex items-center gap-1">
              <Badge variant="outline" className="text-xs">{internship.sector}</Badge>
            </div>
          </div>

          {/* Actions */}
          {internship.status === 'pending' && onApprove && onReject && (
            <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
              <Button
                onClick={() => {
                  onApprove(internship.id);
                  onOpenChange(false);
                }}
                className="flex-1"
              >
                Approve Internship
              </Button>
              <Button
                onClick={() => {
                  onReject(internship.id);
                  onOpenChange(false);
                }}
                variant="outline"
                className="flex-1 text-destructive hover:bg-destructive/10"
              >
                Reject
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InternshipDetailDialog;
