import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-gray-200 bg-white/50 backdrop-blur">
      <div className="px-4 py-6 md:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
              <span className="text-white font-bold text-sm">PY</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">PM YUVA SETU</p>
              <p className="text-xs text-muted-foreground">Admin Portal</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <Link to="/admin/dashboard" className="hover:text-primary transition-colors">
              Dashboard
            </Link>
            <Link to="/admin/employers" className="hover:text-primary transition-colors">
              Employers
            </Link>
            <Link to="/admin/internships" className="hover:text-primary transition-colors">
              Internships
            </Link>
            <Link to="/admin/students" className="hover:text-primary transition-colors">
              Students
            </Link>
          </div>
          
          <p className="text-xs text-muted-foreground">
            © 2025 PM Yuva Setu. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
