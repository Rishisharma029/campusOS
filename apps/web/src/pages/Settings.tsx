import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useRole } from '../context/RoleContext';
import { useToast } from '../components/ui/Toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Tabs, TabList, TabTrigger, TabContent } from '../components/ui/Tabs';
import { Sun, Moon, Laptop, Lock } from 'lucide-react';
import { useForm } from 'react-hook-form';

export const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { currentRole } = useRole();
  const { toast } = useToast();

  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: `${currentRole} User`,
      email: `${currentRole.toLowerCase().replace(/\s+/g, '')}@university.edu`,
    },
  });

  const onSubmitProfile = (_data: any) => {
    toast('Profile Saved', 'Personal settings updated successfully.', 'success');
  };

  // Mock System Audit Logs
  const auditLogs = [
    { event: 'User logged in', user: `${currentRole} User`, ip: '192.168.1.104', date: '2026-07-08 17:12:04' },
    { event: 'Leave request submitted', user: 'Prof. Meera Deshmukh', ip: '192.168.1.102', date: '2026-07-07 14:30:20' },
    { event: 'Exam schedule published', user: 'Admin User', ip: '192.168.1.100', date: '2026-07-06 10:00:15' },
    { event: 'Fee invoice RCP1002 printed', user: 'Diya Sharma', ip: '192.168.1.155', date: '2026-07-06 09:12:00' },
  ];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 font-display m-0 leading-tight">
          System Settings
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Modify personal preferences, toggle light & dark templates, and view system audits.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Navigation Sidebar Tabs */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="profile">
            <TabList>
              <TabTrigger value="profile">Profile Details</TabTrigger>
              <TabTrigger value="appearance">Appearance Mode</TabTrigger>
              <TabTrigger value="notifications">Alert Preferences</TabTrigger>
              <TabTrigger value="audit">System Audit Logs</TabTrigger>
            </TabList>

            {/* Tab 1: Profile Details */}
            <TabContent value="profile" className="max-w-xl">
              <Card>
                <CardHeader>
                  <div>
                    <CardTitle>Profile Details</CardTitle>
                    <CardDescription>View and edit your personal information</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <form onSubmit={handleSubmit(onSubmitProfile)} className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input label="Display Name" {...register('name')} />
                      <Input label="Email Address" type="email" {...register('email')} />
                    </div>
                    <Input label="Current Portal Role" readOnly value={currentRole} containerClassName="opacity-80" />

                    <div className="flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800 pt-4 mt-2">
                      <Button type="submit">Save Settings</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabContent>

            {/* Tab 2: Appearance */}
            <TabContent value="appearance" className="max-w-xl">
              <Card>
                <CardHeader>
                  <div>
                    <CardTitle>Visual Theme</CardTitle>
                    <CardDescription>Select dark or light templates</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 flex flex-col gap-5 text-xs">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Light Option */}
                    <button
                      onClick={() => theme === 'dark' && toggleTheme()}
                      className={`p-5 rounded-2xl border flex flex-col items-center gap-3 transition-all cursor-pointer
                        ${theme === 'light'
                          ? 'border-blue-600 bg-blue-50/20 text-blue-600 dark:text-blue-400 font-semibold shadow-premium'
                          : 'border-slate-200 dark:border-slate-800 bg-surface hover:bg-slate-50/40 text-slate-600'
                        }
                      `}
                    >
                      <Sun size={24} className={theme === 'light' ? 'text-blue-600' : 'text-slate-400'} />
                      <span>Light Theme</span>
                    </button>

                    {/* Dark Option */}
                    <button
                      onClick={() => theme === 'light' && toggleTheme()}
                      className={`p-5 rounded-2xl border flex flex-col items-center gap-3 transition-all cursor-pointer
                        ${theme === 'dark'
                          ? 'border-blue-600 bg-blue-50/20 text-blue-600 dark:text-blue-400 font-semibold shadow-premium'
                          : 'border-slate-200 dark:border-slate-800 bg-surface hover:bg-slate-50/40 text-slate-600'
                        }
                      `}
                    >
                      <Moon size={24} className={theme === 'dark' ? 'text-blue-400' : 'text-slate-450'} />
                      <span>Dark Theme</span>
                    </button>
                  </div>

                  <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl text-slate-500 flex items-center gap-2">
                    <Laptop size={14} className="text-slate-400" />
                    <span>The theme is applied to headers, sidebars, charts, modals, and tables.</span>
                  </div>
                </CardContent>
              </Card>
            </TabContent>

            {/* Tab 3: Alert Preferences */}
            <TabContent value="notifications" className="max-w-xl">
              <Card>
                <CardHeader>
                  <div>
                    <CardTitle>System Notifications</CardTitle>
                    <CardDescription>Select channels for receiving push alerts</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 flex flex-col gap-4 text-xs">
                  <div className="flex items-center gap-3 p-3 border border-slate-100 dark:border-slate-800 rounded-xl">
                    <input type="checkbox" defaultChecked className="rounded text-blue-600 w-4 h-4" />
                    <div>
                      <span className="font-semibold block text-slate-800 dark:text-slate-200">In-App Announcements Banner</span>
                      <span className="text-[10px] text-slate-400">Receive popup notification drawer alerts</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border border-slate-100 dark:border-slate-800 rounded-xl">
                    <input type="checkbox" defaultChecked className="rounded text-blue-600 w-4 h-4" />
                    <div>
                      <span className="font-semibold block text-slate-800 dark:text-slate-200">Email Newsletters</span>
                      <span className="text-[10px] text-slate-400">Send copies of invoices and timetables to registered emails</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 border border-slate-100 dark:border-slate-800 rounded-xl">
                    <input type="checkbox" className="rounded text-blue-600 w-4 h-4" />
                    <div>
                      <span className="font-semibold block text-slate-800 dark:text-slate-200">System Sound Cues</span>
                      <span className="text-[10px] text-slate-400">Play alert tones upon new receipts or exam schedules</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabContent>

            {/* Tab 4: System Audit Logs */}
            <TabContent value="audit" className="max-w-3xl">
              <Card>
                <CardHeader>
                  <div>
                    <CardTitle>Security Logs</CardTitle>
                    <CardDescription>Audit ledger of processed system triggers</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {auditLogs.map((log, idx) => (
                      <div key={idx} className="p-4 flex items-center justify-between text-xs gap-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 rounded-lg">
                            <Lock size={14} />
                          </div>
                          <div>
                            <span className="font-bold text-slate-800 dark:text-slate-200 block">{log.event}</span>
                            <span className="text-[10px] text-slate-400 mt-0.5 block">Triggered by: {log.user}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant="secondary" className="font-mono text-[9px] mb-0.5">{log.ip}</Badge>
                          <span className="text-[9px] text-slate-400 block">{log.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
