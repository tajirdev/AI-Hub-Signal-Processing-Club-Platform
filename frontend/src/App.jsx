import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PublicLayout } from './layouts/PublicLayout';
import { HomePage } from './features/home/HomePage';

// Placeholder components for routes not yet implemented
const PlaceholderPage = ({ title }) => (
  <div className="pt-32 pb-24 px-8 max-w-[1280px] mx-auto min-h-[60vh] flex flex-col justify-center items-center text-center">
    <h1 className="text-4xl font-heading font-black text-navy dark:text-white mb-4">{title}</h1>
    <p className="text-gray-500">This page is currently under construction for Phase 4+.</p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<PlaceholderPage title="About Us" />} />
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
          <Route path="/contact" element={<PlaceholderPage title="Contact Us" />} />
          
          {/* Join page (forms) will be built in Part C */}
          <Route path="/join" element={<PlaceholderPage title="Join Application (Part C)" />} />
          
          <Route path="*" element={<PlaceholderPage title="404 - Page Not Found" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
