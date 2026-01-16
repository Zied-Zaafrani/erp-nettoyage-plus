import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';

// Dashboard Pages
import DashboardPage from './pages/dashboard/DashboardPage';

// Management Pages
import UsersPage from './pages/users/UsersPage';
import ClientsPage from './pages/clients/ClientsPage';
import SitesPage from './pages/sites/SitesPage';
import ContractsPage from './pages/contracts/ContractsPage';
import ZonesPage from './pages/zones/ZonesPage';
import SchedulesPage from './pages/schedules/SchedulesPage';
import InterventionsPage from './pages/interventions/InterventionsPage';
import ChecklistsPage from './pages/checklists/ChecklistsPage';
import AbsencesPage from './pages/absences/AbsencesPage';

// Protected Route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      {/* Dashboard Routes (Protected) */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        
        {/* Management Routes */}
        <Route path="/users" element={<UsersPage />} />
        <Route path="/clients" element={<ClientsPage />} />
        <Route path="/sites" element={<SitesPage />} />
        <Route path="/contracts" element={<ContractsPage />} />
        <Route path="/zones" element={<ZonesPage />} />
        <Route path="/schedules" element={<SchedulesPage />} />
        <Route path="/interventions" element={<InterventionsPage />} />
        <Route path="/checklists" element={<ChecklistsPage />} />
        <Route path="/absences" element={<AbsencesPage />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
