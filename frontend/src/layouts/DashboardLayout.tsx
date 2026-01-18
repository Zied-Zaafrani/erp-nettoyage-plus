import { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard,
  Users,
  Building2,
  MapPin,
  FileText,
  Calendar,
  CalendarOff,
  ChevronLeft,
  LogOut,
  Menu,
  Bell,
  Search,
  Sun,
  Moon,
  CheckCircle,
} from 'lucide-react';
import { useAuth, ROLE_KEYS } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import clsx from 'clsx';

// ============================================
// NAVIGATION ITEMS
// ============================================

interface NavItem {
  labelKey: string;
  path: string;
  icon: React.ReactNode;
  roles?: string[]; // Roles that can see this item, empty = all
}

const navItems: NavItem[] = [
  { labelKey: 'nav.dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
  { labelKey: 'nav.users', path: '/users', icon: <Users size={20} />, roles: ['SUPER_ADMIN', 'SUPERVISOR'] },
  { labelKey: 'nav.clients', path: '/clients', icon: <Building2 size={20} />, roles: ['SUPER_ADMIN', 'SUPERVISOR'] },
  { labelKey: 'nav.sites', path: '/sites', icon: <MapPin size={20} />, roles: ['SUPER_ADMIN', 'SUPERVISOR'] },
  { labelKey: 'nav.contracts', path: '/contracts', icon: <FileText size={20} />, roles: ['SUPER_ADMIN', 'SUPERVISOR'] },
  { labelKey: 'nav.schedules', path: '/schedules', icon: <Calendar size={20} /> },
  { labelKey: 'nav.interventions', path: '/interventions', icon: <CheckCircle size={20} /> },
  { labelKey: 'nav.absences', path: '/absences', icon: <CalendarOff size={20} /> },
];

// ============================================
// DASHBOARD LAYOUT
// ============================================

export default function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Filter nav items based on user role
  const filteredNavItems = navItems.filter((item) => {
    if (!item.roles || item.roles.length === 0) return true;
    return user?.role && item.roles.includes(user.role);
  });

  // Get current page title
  const currentPage = navItems.find((item) => location.pathname.startsWith(item.path));
  const pageTitle = currentPage ? t(currentPage.labelKey) : t('nav.dashboard');

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed inset-y-0 z-50 flex flex-col border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-700 transition-all duration-300',
          sidebarCollapsed ? 'w-20' : 'w-64',
          isRTL ? 'right-0 border-l' : 'left-0 border-r',
          mobileMenuOpen 
            ? 'translate-x-0' 
            : isRTL 
              ? 'translate-x-full lg:translate-x-0'
              : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-gray-200 dark:border-gray-700 px-4">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 text-white">
                <span className="text-lg">🧹</span>
              </div>
              <span className="font-bold text-gray-900 dark:text-white">NettoyagePlus</span>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:block"
          >
            <ChevronLeft
              size={20}
              className={clsx('transition-transform', sidebarCollapsed && 'rotate-180')}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {filteredNavItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    clsx(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white'
                    )
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.icon}
                  {!sidebarCollapsed && <span>{t(item.labelKey)}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User section */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div
            className={clsx(
              'flex items-center gap-3',
              sidebarCollapsed && 'justify-center'
            )}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-medium text-primary-700">
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </div>
            {!sidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t(ROLE_KEYS[user?.role || 'AGENT'])}</p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className={clsx(
              'mt-4 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 transition-colors',
              sidebarCollapsed && 'justify-center'
            )}
          >
            <LogOut size={20} />
            {!sidebarCollapsed && <span>{t('auth.logout')}</span>}
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main content */}
      <div
        className={clsx(
          'flex-1 transition-all duration-300',
          sidebarCollapsed 
            ? isRTL ? 'lg:mr-20' : 'lg:ml-20' 
            : isRTL ? 'lg:mr-64' : 'lg:ml-64'
        )}
      >
        {/* Top header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 lg:px-6">
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
            >
              <Menu size={24} />
            </button>

            {/* Page title */}
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{pageTitle}</h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <button className="hidden rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 sm:block">
              <Search size={20} />
            </button>

            {/* Notifications */}
            <button className="relative rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">
              <Bell size={20} />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
            </button>

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Theme toggle */}
            <button 
              onClick={toggleTheme}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
