import { Outlet, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Layout for authentication pages (login, register, etc.)
 * Redirects to dashboard if already authenticated
 */
export default function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const { i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      <Outlet />
    </div>
  );
}
