import React from 'react';
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Routes } from './routes';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Pages
import Login from './pages/Login';
import Overview from './pages/Overview';
import Users from './pages/Users';
import Members from './pages/Members';
import Subgroups from './pages/Subgroups';
import BlogPosts from './pages/BlogPosts';
import Categories from './pages/Categories';
import News from './pages/News';
import Events from './pages/Events';
import Projects from './pages/Projects';
import Research from './pages/Research';
import Resources from './pages/Resources';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <RouterRoutes>
          {/* Public Login Route */}
          <Route path={Routes.Login.path} element={<Login />} />

          {/* Protected Super Admin Shell */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to={Routes.Overview.path} replace />} />
            <Route path={Routes.Overview.path} element={<Overview />} />
            <Route path={Routes.Users.path} element={<Users />} />
            <Route path={Routes.Members.path} element={<Members />} />
            <Route path={Routes.Subgroups.path} element={<Subgroups />} />
            <Route path={Routes.BlogPosts.path} element={<BlogPosts />} />
            <Route path={Routes.Categories.path} element={<Categories />} />
            <Route path={Routes.News.path} element={<News />} />
            <Route path={Routes.Events.path} element={<Events />} />
            <Route path={Routes.Projects.path} element={<Projects />} />
            <Route path={Routes.Research.path} element={<Research />} />
            <Route path={Routes.Resources.path} element={<Resources />} />
          </Route>

          {/* 404 Route */}
          <Route path={Routes.NotFound.path} element={<NotFound />} />
          <Route path="*" element={<Navigate to={Routes.NotFound.path} replace />} />
        </RouterRoutes>
      </BrowserRouter>
    </AuthProvider>
  );
}
