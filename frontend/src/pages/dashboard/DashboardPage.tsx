import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Users,
  Building2,
  FileText,
  CheckCircle,
  Clock,
  CalendarCheck,
  ArrowRight,
  Lock,
  BarChart3,
} from 'lucide-react';
import { Card, CardHeader, CardContent, Badge } from '@/components/ui';
import { dashboardService } from '@/services';
import { useAuth } from '@/contexts/AuthContext';

// ============================================
// DASHBOARD PAGE - PHASE 1 MVP
// ============================================

export default function DashboardPage() {
  const { t } = useTranslation();
  const { hasRole } = useAuth();
  
  // Check if user can access management features
  const canManage = hasRole(['SUPER_ADMIN', 'SUPERVISOR']);
  
  // Fetch today's interventions
  const { data: todayInterventions, isLoading: interventionsLoading } = useQuery({
    queryKey: ['dashboard', 'interventions', 'today'],
    queryFn: dashboardService.getInterventionsToday,
  });

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">{t('dashboard.title')}</h1>
          <p className="page-subtitle">
            {t('dashboard.subtitle')}
          </p>
        </div>
      </div>

      {/* Quick Navigation Cards - Phase 1 (Admin/Supervisor Only) */}
      {canManage && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <QuickNavCard
            title={t('nav.clients')}
            count={t('common.viewAll')}
            icon={<Building2 className="h-6 w-6" />}
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
            href="/clients"
          />
          <QuickNavCard
            title={t('nav.sites')}
            count={t('common.viewAll')}
            icon={<FileText className="h-6 w-6" />}
            iconBg="bg-green-100"
            iconColor="text-green-600"
            href="/sites"
          />
          <QuickNavCard
            title={t('nav.contracts')}
            count={t('common.viewAll')}
            icon={<FileText className="h-6 w-6" />}
            iconBg="bg-purple-100"
            iconColor="text-purple-600"
            href="/contracts"
          />
          <QuickNavCard
            title={t('nav.interventions')}
            count={t('common.viewAll')}
            icon={<CheckCircle className="h-6 w-6" />}
            iconBg="bg-orange-100"
            iconColor="text-orange-600"
            href="/interventions"
          />
        </div>
      )}

      {/* Main content grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Today's interventions */}
        <Card>
          <CardHeader
            title={t('dashboard.todayInterventionsTitle')}
            subtitle={`${todayInterventions?.length || 0} ${t('dashboard.scheduledForToday')}`}
            action={
              <Link 
                to="/interventions"
                className="flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
              >
                {t('common.viewAll')}
                <ArrowRight size={16} />
              </Link>
            }
          />
          <CardContent>
            {interventionsLoading ? (
              <LoadingSkeleton rows={4} />
            ) : todayInterventions && todayInterventions.length > 0 ? (
              <div className="space-y-3">
                {todayInterventions.slice(0, 5).map((intervention) => (
                  <InterventionItem key={intervention.id} intervention={intervention} t={t} />
                ))}
              </div>
            ) : (
              <EmptyMessage
                icon={<CalendarCheck className="h-8 w-8" />}
                message={t('dashboard.noInterventionsScheduled')}
              />
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader
            title={t('dashboard.quickActions')}
            subtitle={t('dashboard.commonTasks')}
          />
          <CardContent>
            <div className="space-y-2">
              <Link
                to="/schedules"
                className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                    <CalendarCheck className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">{t('nav.schedules')}</span>
                </div>
                <ArrowRight size={20} className="text-gray-400 dark:text-gray-500" />
              </Link>
              <Link
                to="/users"
                className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">{t('nav.users')}</span>
                </div>
                <ArrowRight size={20} className="text-gray-400 dark:text-gray-500" />
              </Link>
              <Link
                to="/absences"
                className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100">
                    <Clock className="h-5 w-5 text-yellow-600" />
                  </div>
                  <span className="font-medium text-gray-900 dark:text-white">{t('nav.absences')}</span>
                </div>
                <ArrowRight size={20} className="text-gray-400 dark:text-gray-500" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* PHASE 2 - Advanced Reports & Analytics - LOCKED */}
      <Card className="relative overflow-hidden opacity-60 pointer-events-none">
        <div className="absolute top-4 right-4 z-10">
          <Badge className="bg-primary-600 text-white font-semibold px-3 py-1 text-xs">
            PHASE 2
          </Badge>
        </div>
        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Lock size={20} className="text-gray-400 dark:text-gray-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('dashboard.advancedReports')}</h3>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('dashboard.availableInPhase2')}</p>
            </div>
          </div>
        </div>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center gap-3 mb-2">
                <BarChart3 className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Completion Rate</span>
              </div>
              <p className="text-2xl font-bold text-gray-400 dark:text-gray-500">--</p>
            </div>
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center gap-3 mb-2">
                <BarChart3 className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Performance Score</span>
              </div>
              <p className="text-2xl font-bold text-gray-400 dark:text-gray-500">--</p>
            </div>
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center gap-3 mb-2">
                <BarChart3 className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Quality Score</span>
              </div>
              <p className="text-2xl font-bold text-gray-400 dark:text-gray-500">--</p>
            </div>
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center gap-3 mb-2">
                <BarChart3 className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Revenue Analysis</span>
              </div>
              <p className="text-2xl font-bold text-gray-400 dark:text-gray-500">--</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================
// SUB-COMPONENTS
// ============================================

interface QuickNavCardProps {
  title: string;
  count: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  href: string;
}

function QuickNavCard({ title, count, icon, iconBg, iconColor, href }: QuickNavCardProps) {
  return (
    <Link to={href}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{title}</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{count}</p>
          </div>
          <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${iconBg} ${iconColor}`}>
            {icon}
          </div>
        </div>
      </Card>
    </Link>
  );
}

interface InterventionItemProps {
  intervention: {
    id: string;
    scheduledStartTime: string;
    scheduledEndTime: string;
    status: string;
    zone?: { name: string; site?: { name: string } };
    site?: { name: string };
    agent?: { firstName: string; lastName: string };
  };
  t: (key: string) => string;
}

function InterventionItem({ intervention, t }: InterventionItemProps) {
  const statusColors: Record<string, string> = {
    scheduled: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    missed: 'bg-gray-100 text-gray-800',
  };

  return (
    <div className="flex items-center justify-between rounded-lg border border-gray-100 dark:border-gray-700 p-3 hover:bg-gray-50 dark:hover:bg-gray-800">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
          <CheckCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {intervention.site?.name || intervention.zone?.site?.name || t('dashboard.unknownSite')}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {intervention.agent?.firstName} {intervention.agent?.lastName}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {intervention.scheduledStartTime} - {intervention.scheduledEndTime}
          </p>
        </div>
        <Badge className={statusColors[intervention.status] || 'bg-gray-100 text-gray-800'}>
          {intervention.status.replace('_', ' ')}
        </Badge>
      </div>
    </div>
  );
}

function LoadingSkeleton({ rows }: { rows: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="h-10 w-10 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyMessage({ icon, message }: { icon: React.ReactNode; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="mb-3 text-gray-400 dark:text-gray-500">{icon}</div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{message}</p>
    </div>
  );
}
