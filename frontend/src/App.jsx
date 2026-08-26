import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { PublicLayout } from './layouts/PublicLayout';
import { AuthLayout } from './layouts/AuthLayout';
import { HomePage } from './features/home/HomePage';
import { AboutPage } from './features/about/AboutPage';
import { LoginPage } from './features/auth/LoginPage';
import { JoinPage } from './features/join/JoinPage';
import { ContactPage } from './features/contact/ContactPage';
import { OnboardingPage } from './features/auth/OnboardingPage';
import { ForgotPasswordPage } from './features/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './features/auth/ResetPasswordPage';

// Placeholder components for routes not yet implemented
const PlaceholderPage = ({ title }) => (
  <div className="pt-32 pb-24 px-8 max-w-[1280px] mx-auto min-h-[60vh] flex flex-col justify-center items-center text-center">
    <h1 className="text-4xl font-heading font-black text-navy dark:text-white mb-4">{title}</h1>
    <p className="text-gray-500">This page is currently under construction for Phase 4+.</p>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            
            {/* The user requested to keep Navbar on JoinPage only */}
            <Route path="/join" element={<JoinPage />} />
            
            <Route path="/about" element={<AboutPage />} />
            <Route path="/projects" element={<PlaceholderPage title="Projects Archive" />} />
            <Route path="/projects/:id" element={<PlaceholderPage title="Project Details" />} />
            <Route path="/research" element={<PlaceholderPage title="Research Publications" />} />
            <Route path="/research/:id" element={<PlaceholderPage title="Research Details" />} />
            <Route path="/sub-groups" element={<PlaceholderPage title="Sub-Groups" />} />
            <Route path="/sub-groups/:id" element={<PlaceholderPage title="Sub-Group Details" />} />
            <Route path="/events" element={<PlaceholderPage title="Events Calendar" />} />
            <Route path="/events/:id" element={<PlaceholderPage title="Event Details" />} />
            <Route path="/blog" element={<PlaceholderPage title="Blog & News" />} />
            <Route path="/blog/:id" element={<PlaceholderPage title="Blog Post" />} />
            <Route path="/resources" element={<PlaceholderPage title="Resources" />} />
            <Route path="/members" element={<PlaceholderPage title="Members Directory" />} />
            <Route path="/contact" element={<ContactPage />} />
            
            <Route path="*" element={<PlaceholderPage title="404 - Page Not Found" />} />
          </Route>

          {/* Authentication & Onboarding Forms without Navigation */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/onboard" element={<OnboardingPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
