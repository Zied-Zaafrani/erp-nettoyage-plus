import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { UserRole } from './types';

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
import ClientDetailPage from './pages/clients/ClientDetailPage';
import CreateClientPage from './pages/clients/CreateClientPage';
import UpdateClientPage from './pages/clients/UpdateClientPage';
import SitesPage from './pages/sites/SitesPage';
import ContractsPage from './pages/contracts/ContractsPage';
import CreateContractPage from './pages/contracts/CreateContractPage';
import ContractDetailPage from './pages/contracts/ContractDetailPage';
import UpdateContractPage from './pages/contracts/UpdateContractPage';
import SchedulesPage from './pages/schedules/SchedulesPage';
import InterventionsPage from './pages/interventions/InterventionsPage';
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

// Role-based Protected Route
function RoleProtectedRoute({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode;
  allowedRoles: UserRole[];
}) {
  const { hasRole } = useAuth();

  if (!hasRole(allowedRoles)) {
    return <Navigate to="/dashboard" replace />;
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
        
        {/* Management Routes - Role Protected */}
        <Route 
          path="/users" 
          element={
            <RoleProtectedRoute allowedRoles={['SUPER_ADMIN', 'SUPERVISOR']}>
              <UsersPage />
            </RoleProtectedRoute>
          } 
        />
        <Route 
          path="/clients" 
          element={
            <RoleProtectedRoute allowedRoles={['SUPER_ADMIN', 'SUPERVISOR']}>
              <ClientsPage />
            </RoleProtectedRoute>
          } 
        />
        <Route 
          path="/clients/create" 
          element={
            <RoleProtectedRoute allowedRoles={['SUPER_ADMIN', 'SUPERVISOR']}>
              <CreateClientPage />
            </RoleProtectedRoute>
          } 
        />
        <Route 
          path="/clients/:id" 
          element={
            <RoleProtectedRoute allowedRoles={['SUPER_ADMIN', 'SUPERVISOR']}>
              <ClientDetailPage />
            </RoleProtectedRoute>
          } 
        />
        <Route 
          path="/clients/:id/edit" 
          element={
            <RoleProtectedRoute allowedRoles={['SUPER_ADMIN', 'SUPERVISOR']}>
              <UpdateClientPage />
            </RoleProtectedRoute>
          } 
        />
        <Route 
          path="/sites" 
          element={
            <RoleProtectedRoute allowedRoles={['SUPER_ADMIN', 'SUPERVISOR']}>
              <SitesPage />
            </RoleProtectedRoute>
          } 
        />
        <Route 
          path="/contracts" 
          element={
            <RoleProtectedRoute allowedRoles={['SUPER_ADMIN', 'SUPERVISOR']}>
              <ContractsPage />
            </RoleProtectedRoute>
          } 
        />
        <Route 
          path="/contracts/create" 
          element={
            <RoleProtectedRoute allowedRoles={['SUPER_ADMIN', 'SUPERVISOR']}>
              <CreateContractPage />
            </RoleProtectedRoute>
          } 
        />
        <Route 
          path="/contracts/:id" 
          element={
            <RoleProtectedRoute allowedRoles={['SUPER_ADMIN', 'SUPERVISOR']}>
              <ContractDetailPage />
            </RoleProtectedRoute>
          } 
        />
        <Route 
          path="/contracts/:id/edit" 
          element={
            <RoleProtectedRoute allowedRoles={['SUPER_ADMIN', 'SUPERVISOR']}>
              <UpdateContractPage />
            </RoleProtectedRoute>
          } 
        />
        <Route path="/schedules" element={<SchedulesPage />} />
        <Route path="/interventions" element={<InterventionsPage />} />
        <Route path="/absences" element={<AbsencesPage />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;
