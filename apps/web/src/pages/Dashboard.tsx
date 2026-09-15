import React from 'react';
import { useRole, type UserRole, allRoles } from '../context/RoleContext';
import { AdminDashboard } from '../components/dashboards/AdminDashboard';
import { StudentDashboard } from '../components/dashboards/StudentDashboard';
import { FacultyDashboard } from '../components/dashboards/FacultyDashboard';
import { AccountantDashboard } from '../components/dashboards/AccountantDashboard';
import { LibrarianDashboard } from '../components/dashboards/LibrarianDashboard';
import { RegistrarDashboard } from '../components/dashboards/RegistrarDashboard';
import { PlacementDashboard } from '../components/dashboards/PlacementDashboard';
import { IndustryDashboard } from '../components/dashboards/IndustryDashboard';
import { HostelWardenDashboard } from '../components/dashboards/HostelWardenDashboard';
import { TransportDashboard } from '../components/dashboards/TransportDashboard';
import { Shield, Layers } from 'lucide-react';
import { useToast } from '../components/ui/Toast';

export const Dashboard: React.FC = () => {
  const { currentRole, setRole } = useRole();
  const { toast } = useToast();

  const handleRoleChange = (role: UserRole) => {
    setRole(role);
    toast('Role Switched', `Active Dashboard updated to ${role} workspace.`, 'info');
  };

  const renderDashboardByRole = () => {
    switch (currentRole) {
      case 'Student':
        return <StudentDashboard />;
      case 'Faculty':
        return <FacultyDashboard />;
      case 'Accountant':
        return <AccountantDashboard />;
      case 'Librarian':
        return <LibrarianDashboard />;
      case 'Registrar':
        return <RegistrarDashboard />;
      case 'Placement Cell':
        return <PlacementDashboard />;
      case 'Industry Portal':
        return <IndustryDashboard />;
      case 'Hostel Warden':
        return <HostelWardenDashboard />;
      case 'Transport Manager':
        return <TransportDashboard />;
      case 'Admin':
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Role Context Quick Switcher Header */}
      <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Shield size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-bold text-white font-display uppercase tracking-wider">
                {currentRole} Dashboard
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-semibold font-mono">
                Active View
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Role-tailored workspace with dedicated KPIs, telemetry, and operations.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="role-quick-switch" className="text-[11px] text-slate-400 flex items-center gap-1 font-medium whitespace-nowrap">
            <Layers size={13} className="text-blue-400" /> Switch Role View:
          </label>
          <select
            id="role-quick-switch"
            aria-label="Switch Role View"
            value={currentRole}
            onChange={(e) => handleRoleChange(e.target.value as UserRole)}
            className="h-8 rounded-xl border border-slate-700 bg-slate-950 px-2.5 text-xs text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            style={{ colorScheme: 'dark' }}
          >
            {allRoles.map((r) => (
              <option key={r} value={r} className="bg-slate-900 text-white py-1">
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Dynamic Role-Specific Dashboard Component */}
      {renderDashboardByRole()}
    </div>
  );
};
