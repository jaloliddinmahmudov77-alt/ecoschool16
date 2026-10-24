import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AdminLayout } from './components/admin/AdminLayout'
import { PublicLayout } from './components/layout/PublicLayout'
import { Loader } from './components/ui/States'
import { I18nProvider } from './i18n'
import { AuthProvider } from './lib/auth'
import { SettingsProvider } from './lib/settings'
import HomePage from './pages/HomePage'

const AboutPage = lazy(() => import('./pages/AboutPage'))
const StepsPage = lazy(() => import('./pages/StepsPage'))
const StepDetailPage = lazy(() => import('./pages/StepDetailPage'))
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'))
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage'))
const AchievementsPage = lazy(() => import('./pages/AchievementsPage'))
const GalleryPage = lazy(() => import('./pages/GalleryPage'))
const NewsPage = lazy(() => import('./pages/NewsPage'))
const NewsDetailPage = lazy(() => import('./pages/NewsDetailPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))

const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage'))
const DashboardAdmin = lazy(() => import('./pages/admin/DashboardAdmin'))
const SettingsAdmin = lazy(() => import('./pages/admin/SettingsAdmin'))
const StatsAdmin = lazy(() => import('./pages/admin/StatsAdmin'))
const StepsAdmin = lazy(() => import('./pages/admin/StepsAdmin'))
const MessagesAdmin = lazy(() => import('./pages/admin/MessagesAdmin'))
const resources = () => import('./pages/admin/resources')
const ProjectsAdmin = lazy(() => resources().then((m) => ({ default: m.ProjectsAdmin })))
const NewsAdmin = lazy(() => resources().then((m) => ({ default: m.NewsAdmin })))
const GalleryAdmin = lazy(() => resources().then((m) => ({ default: m.GalleryAdmin })))
const AchievementsAdmin = lazy(() => resources().then((m) => ({ default: m.AchievementsAdmin })))
const EvidenceAdmin = lazy(() => resources().then((m) => ({ default: m.EvidenceAdmin })))

export default function App() {
  return (
    <I18nProvider>
      <AuthProvider>
        <SettingsProvider>
          <BrowserRouter>
            <Suspense fallback={<Loader className="min-h-screen" />}>
              <Routes>
                <Route element={<PublicLayout />}>
                  <Route index element={<HomePage />} />
                  <Route path="biz-haqimizda" element={<AboutPage />} />
                  <Route path="7-qadam" element={<StepsPage />} />
                  <Route path="7-qadam/:number" element={<StepDetailPage />} />
                  <Route path="loyihalar" element={<ProjectsPage />} />
                  <Route path="loyihalar/:slug" element={<ProjectDetailPage />} />
                  <Route path="yutuqlar" element={<AchievementsPage />} />
                  <Route path="galereya" element={<GalleryPage />} />
                  <Route path="yangiliklar" element={<NewsPage />} />
                  <Route path="yangiliklar/:slug" element={<NewsDetailPage />} />
                  <Route path="aloqa" element={<ContactPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
                <Route path="admin/login" element={<AdminLoginPage />} />
                <Route path="admin" element={<AdminLayout />}>
                  <Route index element={<DashboardAdmin />} />
                  <Route path="sozlamalar" element={<SettingsAdmin />} />
                  <Route path="statistika" element={<StatsAdmin />} />
                  <Route path="7-qadam" element={<StepsAdmin />} />
                  <Route path="loyihalar" element={<ProjectsAdmin />} />
                  <Route path="yangiliklar" element={<NewsAdmin />} />
                  <Route path="galereya" element={<GalleryAdmin />} />
                  <Route path="yutuqlar" element={<AchievementsAdmin />} />
                  <Route path="dalillar" element={<EvidenceAdmin />} />
                  <Route path="xabarlar" element={<MessagesAdmin />} />
                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
        </SettingsProvider>
      </AuthProvider>
    </I18nProvider>
  )
}
