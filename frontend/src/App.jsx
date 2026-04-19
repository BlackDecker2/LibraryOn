import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import './index.css';

import LoginPage       from './pages/LoginPage';
import RegisterPage    from './pages/RegisterPage';
import PublicFeed      from './pages/PublicFeed';
import EditorDashboard from './pages/EditorDashboard';
import AdminDashboard  from './pages/AdminDashboard';

function PrivateRoute({ children, requireAdmin }) {
  const { user, isAdmin } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (requireAdmin && !isAdmin()) return <Navigate to="/editor" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/"         element={<PublicFeed />} />
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/editor"   element={<PrivateRoute><EditorDashboard /></PrivateRoute>} />
          <Route path="/admin"    element={<PrivateRoute requireAdmin><AdminDashboard /></PrivateRoute>} />
          <Route path="*"         element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
