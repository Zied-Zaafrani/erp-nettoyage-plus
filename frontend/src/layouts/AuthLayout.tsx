import { Outlet, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Layout for authentication pages (login, register, etc.)
 * Redirects to dashboard if already authenticated
 */
export default function AuthLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const { t, i18n } = useTranslation();
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
    <div className="flex min-h-screen" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      {/* Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 p-12 text-white">
        <div className={`flex flex-col justify-between w-full ${isRTL ? 'text-right' : 'text-left'}`} style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
          <div>
            {/* Logo */}
            <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                <span className="text-2xl">🧹</span>
              </div>
              <span className="text-2xl font-bold">NettoyagePlus</span>
            </div>
          </div>

          <div className="space-y-6">
            <h1 className="text-4xl font-bold leading-tight">
              {t('landing.title')}
              <br />
              {t('landing.titleLine2')}
            </h1>
            <p className="text-lg text-primary-100">
              {t('landing.description')}
            </p>

            {/* Features */}
            <div className="space-y-4">
              <Feature icon="📊" text={t('landing.feature1')} isRTL={isRTL} />
              <Feature icon="📅" text={t('landing.feature2')} isRTL={isRTL} />
              <Feature icon="👥" text={t('landing.feature3')} isRTL={isRTL} />
              <Feature icon="✅" text={t('landing.feature4')} isRTL={isRTL} />
            </div>
          </div>

          <div className="text-sm text-primary-200">
            {t('landing.copyright')}
          </div>
        </div>
      </div>

      {/* Auth forms panel */}
      <div className="flex w-full items-center justify-center bg-white dark:bg-gray-950 p-8 lg:w-1/2">
        <div className={`w-full max-w-md ${isRTL ? 'text-right' : 'text-left'}`} style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

// Feature item component
function Feature({ icon, text, isRTL }: { icon: string; text: string; isRTL: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
      <span className="text-xl">{icon}</span>
      <span className="text-primary-100">{text}</span>
    </div>
  );
}
