import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { ThemeProvider } from './context/ThemeContext';
import { RoleProvider, useRole, type UserRole } from './context/RoleContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DatabaseProvider } from './context/DatabaseContext';
import { RealtimeProvider } from './context/RealtimeContext';
import { ToastProvider } from './components/ui/Toast';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { PageSkeleton } from './components/PageSkeleton';
import { ErrorBoundary } from './components/ErrorBoundary';

// Lazy load all pages
const Dashboard = React.lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const Students = React.lazy(() => import('./pages/Students').then(m => ({ default: m.Students })));
const FacultyPage = React.lazy(() => import('./pages/Faculty').then(m => ({ default: m.FacultyPage })));
const Courses = React.lazy(() => import('./pages/Courses').then(m => ({ default: m.Courses })));
const Timetable = React.lazy(() => import('./pages/Timetable').then(m => ({ default: m.Timetable })));
const Attendance = React.lazy(() => import('./pages/Attendance').then(m => ({ default: m.Attendance })));
const Examinations = React.lazy(() => import('./pages/Examinations').then(m => ({ default: m.Examinations })));
const Fees = React.lazy(() => import('./pages/Fees').then(m => ({ default: m.Fees })));
const Library = React.lazy(() => import('./pages/Library').then(m => ({ default: m.Library })));
const Hostel = React.lazy(() => import('./pages/Hostel').then(m => ({ default: m.Hostel })));
const Transport = React.lazy(() => import('./pages/Transport').then(m => ({ default: m.Transport })));
const Placement = React.lazy(() => import('./pages/Placement').then(m => ({ default: m.Placement })));
const Reports = React.lazy(() => import('./pages/Reports').then(m => ({ default: m.Reports })));
const Settings = React.lazy(() => import('./pages/Settings').then(m => ({ default: m.Settings })));
const Assignments = React.lazy(() => import('./pages/Assignments').then(m => ({ default: m.Assignments })));

// V2 Page Extensions
const Login = React.lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));
const DigitalTwin = React.lazy(() => import('./pages/DigitalTwin').then(m => ({ default: m.DigitalTwin })));
const AnalyticsHub = React.lazy(() => import('./pages/AnalyticsHub').then(m => ({ default: m.AnalyticsHub })));
const UnifiedCalendar = React.lazy(() => import('./pages/UnifiedCalendar').then(m => ({ default: m.UnifiedCalendar })));
const DesignSystemDocs = React.lazy(() => import('./pages/DesignSystemDocs').then(m => ({ default: m.DesignSystemDocs })));
const ErrorViews = React.lazy(() => import('./pages/ErrorViews').then(m => ({ default: m.ErrorViews })));

// CampusOS v2.0 Operational & AI Modules
const CampusMap3D = React.lazy(() => import('./pages/CampusMap3D').then(m => ({ default: m.CampusMap3D })));
const EmergencySOS = React.lazy(() => import('./pages/EmergencySOS').then(m => ({ default: m.EmergencySOS })));
const AIDocumentCenter = React.lazy(() => import('./pages/AIDocumentCenter').then(m => ({ default: m.AIDocumentCenter })));
const NoticeBoard = React.lazy(() => import('./pages/NoticeBoard').then(m => ({ default: m.NoticeBoard })));
const Complaints = React.lazy(() => import('./pages/Complaints').then(m => ({ default: m.Complaints })));
const ClubsAndEvents = React.lazy(() => import('./pages/ClubsAndEvents').then(m => ({ default: m.ClubsAndEvents })));
const SecurityCenter = React.lazy(() => import('./pages/SecurityCenter').then(m => ({ default: m.SecurityCenter })));

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const RoleRoute: React.FC<{ children: React.ReactNode; allowedRoles: UserRole[] }> = ({ children, allowedRoles }) => {
  const { isAuthenticated } = useAuth();
  const { currentRole } = useRole();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(currentRole)) return <Navigate to="/" replace />;
  return <>{children}</>;
};

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <RoleProvider>
            <AuthProvider>
              <DatabaseProvider>
                <RealtimeProvider>
                  <ToastProvider>
                    <BrowserRouter basename={window.location.hostname.endsWith('github.io') ? '/campusOS' : '/'}>
                      <Suspense fallback={<PageSkeleton />}>
                        <Routes>
                          {/* Public Auth Gateway */}
                          <Route path="/login" element={<Login />} />

                          {/* Protected ERP Workspace */}
                          <Route
                            path="/"
                            element={
                              <PrivateRoute>
                                <DashboardLayout />
                              </PrivateRoute>
                            }
                          >
                            <Route index element={<Dashboard />} />
                            
                            {/* CampusOS v2.0 New Operational Routes */}
                            <Route path="map" element={<CampusMap3D />} />
                            <Route path="emergency" element={<EmergencySOS />} />
                            <Route path="doc-center" element={<AIDocumentCenter />} />
                            <Route path="noticeboard" element={<NoticeBoard />} />
                            <Route path="complaints" element={<Complaints />} />
                            <Route path="clubs" element={<ClubsAndEvents />} />
                            <Route path="security" element={<SecurityCenter />} />

                            {/* Core ERP Modules */}
                            <Route 
                              path="students" 
                              element={
                                <RoleRoute allowedRoles={['Admin', 'Faculty']}>
                                  <Students />
                                </RoleRoute>
                              } 
                            />
                            <Route 
                              path="faculty" 
                              element={
                                <RoleRoute allowedRoles={['Admin', 'Faculty']}>
                                  <FacultyPage />
                                </RoleRoute>
                              } 
                            />
                            <Route path="departments" element={<Courses />} />
                            <Route path="courses" element={<Courses />} />
                            <Route path="subjects" element={<Courses />} />
                            <Route path="timetable" element={<Timetable />} />
                            <Route path="attendance" element={<Attendance />} />
                            <Route path="examinations" element={<Examinations />} />
                            <Route path="results" element={<Examinations />} />
                            <Route path="assignments" element={<Assignments />} />
                            <Route 
                              path="fees" 
                              element={
                                <RoleRoute allowedRoles={['Admin', 'Accountant', 'Student', 'Parent']}>
                                  <Fees />
                                </RoleRoute>
                              } 
                            />
                            <Route 
                              path="library" 
                              element={
                                <RoleRoute allowedRoles={['Admin', 'Librarian', 'Student', 'Faculty', 'Parent']}>
                                  <Library />
                                </RoleRoute>
                              } 
                            />
                            <Route path="hostel" element={<Hostel />} />
                            <Route path="transport" element={<Transport />} />
                            <Route path="placement" element={<Placement />} />
                            <Route 
                              path="reports" 
                              element={
                                <RoleRoute allowedRoles={['Admin', 'Accountant', 'Librarian', 'Placement Cell', 'Hostel Warden', 'Transport Manager']}>
                                  <Reports />
                                </RoleRoute>
                              } 
                            />
                            <Route path="settings" element={<Settings />} />

                            {/* V2 Protected Portals */}
                            <Route path="twin" element={<DigitalTwin />} />
                            <Route 
                              path="analytics" 
                              element={
                                <RoleRoute allowedRoles={['Admin', 'Faculty', 'Student', 'Parent']}>
                                  <AnalyticsHub />
                                </RoleRoute>
                              } 
                            />
                            <Route path="calendar" element={<UnifiedCalendar />} />
                            <Route path="docs" element={<DesignSystemDocs />} />
                            <Route path="errors" element={<ErrorViews />} />

                            {/* Catch-all redirect to Dashboard */}
                            <Route path="*" element={<Navigate to="/" replace />} />
                          </Route>
                        </Routes>
                      </Suspense>
                    </BrowserRouter>
                  </ToastProvider>
                </RealtimeProvider>
              </DatabaseProvider>
            </AuthProvider>
          </RoleProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
