import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { RoleRoute } from './components/auth/RoleRoute';
import { DashboardLayout } from './layouts/DashboardLayout';

const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Organization = lazy(() => import('./pages/Organization').then(m => ({ default: m.Organization })));
const Technology = lazy(() => import('./pages/Technology').then(m => ({ default: m.Technology })));
const TechnologyDetail = lazy(() => import('./pages/TechnologyDetail').then(m => ({ default: m.TechnologyDetail })));
const ResearchDetail = lazy(() => import('./pages/ResearchDetail').then(m => ({ default: m.ResearchDetail })));
const Research = lazy(() => import('./pages/Research').then(m => ({ default: m.Research })));
const AI = lazy(() => import('./pages/AI').then(m => ({ default: m.AI })));
const Innovation = lazy(() => import('./pages/Innovation').then(m => ({ default: m.Innovation })));
const InnovationDetail = lazy(() => import('./pages/InnovationDetail').then(m => ({ default: m.InnovationDetail })));
const Products = lazy(() => import('./pages/Products').then(m => ({ default: m.Products })));
const ProductDetail = lazy(() => import('./pages/ProductDetail').then(m => ({ default: m.ProductDetail })));
const Projects = lazy(() => import('./pages/Projects').then(m => ({ default: m.Projects })));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail').then(m => ({ default: m.ProjectDetail })));
const Developers = lazy(() => import('./pages/Developers').then(m => ({ default: m.Developers })));
const Community = lazy(() => import('./pages/Community').then(m => ({ default: m.Community })));
const CommunityPostDetail = lazy(() => import('./pages/CommunityPostDetail').then(m => ({ default: m.CommunityPostDetail })));
const Services = lazy(() => import('./pages/Services').then(m => ({ default: m.Services })));
const ServiceDetail = lazy(() => import('./pages/ServiceDetail').then(m => ({ default: m.ServiceDetail })));
const CaseStudies = lazy(() => import('./pages/CaseStudies').then(m => ({ default: m.CaseStudies })));
const News = lazy(() => import('./pages/News').then(m => ({ default: m.News })));
const Academy = lazy(() => import('./pages/Academy').then(m => ({ default: m.Academy })));
const CourseDetail = lazy(() => import('./pages/CourseDetail').then(m => ({ default: m.CourseDetail })));
const CourseLearn = lazy(() => import('./pages/CourseLearn').then(m => ({ default: m.CourseLearn })));
const Library = lazy(() => import('./pages/Library').then(m => ({ default: m.Library })));
const LibraryDetail = lazy(() => import('./pages/LibraryDetail').then(m => ({ default: m.LibraryDetail })));
const Publications = lazy(() => import('./pages/Publications').then(m => ({ default: m.Publications })));
const KnowledgeCenter = lazy(() => import('./pages/KnowledgeCenter').then(m => ({ default: m.KnowledgeCenter })));
const MediaCenter = lazy(() => import('./pages/MediaCenter').then(m => ({ default: m.MediaCenter })));
const GlobalCenter = lazy(() => import('./pages/GlobalCenter').then(m => ({ default: m.GlobalCenter })));
const PersonalIdentity = lazy(() => import('./pages/PersonalIdentity').then(m => ({ default: m.PersonalIdentity })));
const Documentation = lazy(() => import('./pages/Documentation').then(m => ({ default: m.Documentation })));
const Careers = lazy(() => import('./pages/Careers').then(m => ({ default: m.Careers })));
const Contact = lazy(() => import('./pages/Contact').then(m => ({ default: m.Contact })));
const SearchPage = lazy(() => import('./pages/Search').then(m => ({ default: m.SearchPage })));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail').then(m => ({ default: m.VerifyEmail })));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword').then(m => ({ default: m.ForgotPassword })));
const ResetPassword = lazy(() => import('./pages/ResetPassword').then(m => ({ default: m.ResetPassword })));
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })));
const Register = lazy(() => import('./pages/Register').then(m => ({ default: m.Register })));
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const DashboardAnalyticsPage = lazy(() => import('./pages/dashboard/DashboardAnalyticsPage').then(m => ({ default: m.DashboardAnalyticsPage })));
const DashboardCoursesPage = lazy(() => import('./pages/dashboard/DashboardCoursesPage').then(m => ({ default: m.DashboardCoursesPage })));
const DashboardAssignmentsPage = lazy(() => import('./pages/dashboard/DashboardAssignmentsPage').then(m => ({ default: m.DashboardAssignmentsPage })));
const DashboardProgressPage = lazy(() => import('./pages/dashboard/DashboardProgressPage').then(m => ({ default: m.DashboardProgressPage })));
const DashboardLearningPage = lazy(() => import('./pages/dashboard/DashboardLearningPage').then(m => ({ default: m.DashboardLearningPage })));
const DashboardCertificatesPage = lazy(() => import('./pages/dashboard/DashboardCertificatesPage').then(m => ({ default: m.DashboardCertificatesPage })));
const DashboardResearchPage = lazy(() => import('./pages/dashboard/DashboardResearchPage').then(m => ({ default: m.DashboardResearchPage })));
const DashboardProjectsPage = lazy(() => import('./pages/dashboard/DashboardProjectsPage').then(m => ({ default: m.DashboardProjectsPage })));
const DashboardLibraryPage = lazy(() => import('./pages/dashboard/DashboardLibraryPage').then(m => ({ default: m.DashboardLibraryPage })));
const DashboardNotificationsPage = lazy(() => import('./pages/dashboard/DashboardNotificationsPage').then(m => ({ default: m.DashboardNotificationsPage })));
const DashboardMessagesPage = lazy(() => import('./pages/dashboard/DashboardMessagesPage').then(m => ({ default: m.DashboardMessagesPage })));
const DashboardOrdersPage = lazy(() => import('./pages/dashboard/DashboardOrdersPage').then(m => ({ default: m.DashboardOrdersPage })));
const DashboardSettingsPage = lazy(() => import('./pages/dashboard/DashboardSettingsPage').then(m => ({ default: m.DashboardSettingsPage })));
const DashboardProfilePage = lazy(() => import('./pages/dashboard/DashboardProfilePage').then(m => ({ default: m.DashboardProfilePage })));
const DashboardSectionPage = lazy(() => import('./pages/dashboard/DashboardSectionPage').then(m => ({ default: m.DashboardSectionPage })));
const AdminPortal = lazy(() => import('./pages/AdminPortal').then(m => ({ default: m.AdminPortal })));

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              <Suspense
                fallback={
                  <div className="flex min-h-[60vh] items-center justify-center bg-slate-950">
                    <div className="flex items-center gap-3 text-sm font-mono text-brand-400">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
                      Loading CADELIBORA...
                    </div>
                  </div>
                }
              >
                <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/organization" element={<Organization />} />
                <Route path="/technology" element={<Technology />} />
                <Route path="/technology/:slug" element={<TechnologyDetail />} />
                <Route path="/research" element={<Research />} />
                <Route path="/research/:slug" element={<ResearchDetail />} />
                <Route path="/ai" element={<AI />} />
                <Route path="/innovation" element={<Innovation />} />
                <Route path="/innovation/:id" element={<InnovationDetail />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:id" element={<ProjectDetail />} />
                <Route path="/developers" element={<Developers />} />
                <Route path="/community" element={<Community />} />
                <Route path="/community/posts/:id" element={<CommunityPostDetail />} />
                <Route path="/services" element={<Services />} />
                <Route path="/services/:id" element={<ServiceDetail />} />
                <Route path="/case-studies" element={<CaseStudies />} />
                <Route path="/news" element={<News />} />
                <Route path="/academy" element={<Academy />} />
                <Route path="/academy/courses/:slug" element={<CourseDetail />} />
                <Route
  path="/academy/courses/:slug/learn"
  element={
    <ProtectedRoute>
      <DashboardLayout>
        <CourseLearn />
      </DashboardLayout>
    </ProtectedRoute>
  }
/>
                <Route path="/library" element={<Library />} />
                <Route path="/library/:id" element={<LibraryDetail />} />
                <Route path="/publications" element={<Publications />} />
                <Route path="/knowledge" element={<KnowledgeCenter />} />
                <Route path="/media" element={<MediaCenter />} />
                <Route path="/global" element={<GlobalCenter />} />
                <Route path="/personal" element={<PersonalIdentity />} />
                <Route path="/docs" element={<Documentation />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/about/contact" element={<Contact />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Dashboard Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <Dashboard />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/analytics"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <DashboardAnalyticsPage />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/courses"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <DashboardCoursesPage />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/learning"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <DashboardLearningPage />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/assignments"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <DashboardAssignmentsPage />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/progress"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <DashboardProgressPage />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/certificates"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <DashboardCertificatesPage />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/research"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <DashboardResearchPage />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/projects"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <DashboardProjectsPage />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/library"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <DashboardLibraryPage />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/notifications"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <DashboardNotificationsPage />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/messages"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <DashboardMessagesPage />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/orders"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <DashboardOrdersPage />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/settings"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <DashboardSettingsPage />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/profile"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <DashboardProfilePage />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/dashboard/:section"
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <DashboardSectionPage />
                      </DashboardLayout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/*"
                  element={
                    <RoleRoute allowedRoles={['ADMIN']}>
                      <AdminPortal />
                    </RoleRoute>
                  }
                />
                <Route
                  path="/super-admin/*"
                  element={
                    <RoleRoute allowedRoles={['SUPER_ADMIN']}>
                      <AdminPortal superAdmin />
                    </RoleRoute>
                  }
                />
                </Routes>
              </Suspense>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
