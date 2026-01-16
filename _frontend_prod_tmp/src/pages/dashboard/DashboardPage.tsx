import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  Users,
  Building2,
  FileText,
  CheckCircle,
  Clock,
  TrendingUp,
  AlertCircle,
  CalendarCheck,
} from 'lucide-react';
import { Card, CardHeader, CardContent, Badge } from '@/components/ui';
import { dashboardService } from '@/services';
import { formatDistanceToNow } from 'date-fns';

// ============================================
// DASHBOARD PAGE
// ============================================

export default function DashboardPage() {
  const { t } = useTranslation();
  
  // Fetch dashboard summary
  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: dashboardService.getSummary,
  });

  // Fetch today's interventions
  const { data: todayInterventions, isLoading: interventionsLoading } = useQuery({
    queryKey: ['dashboard', 'interventions', 'today'],
    queryFn: dashboardService.getInterventionsToday,
  });

  // Fetch recent activity
  const { data: recentActivity, isLoading: activityLoading } = useQuery({
    queryKey: ['dashboard', 'activity'],
    queryFn: dashboardService.getRecentActivity,
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

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={t('dashboard.todayInterventions')}
          value={summary?.totalInterventions || 0}
          subtitle={`${summary?.completedInterventions || 0} ${t('dashboard.completedInterventions')}`}
          icon={<CheckCircle className="h-6 w-6" />}
          iconBg="bg-primary-100"
          iconColor="text-primary-600"
          isLoading={summaryLoading}
        />
        <StatCard
          title={t('dashboard.completionRate')}
          value={`${summary?.completionRate || 0}%`}
          subtitle={t('dashboard.thisMonth')}
          icon={<TrendingUp className="h-6 w-6" />}
          iconBg="bg-success-100"
          iconColor="text-success-600"
          isLoading={summaryLoading}
        />
        <StatCard
          title={t('dashboard.totalClients')}
          value={summary?.activeClients || 0}
          subtitle={`${summary?.totalClients || 0} ${t('common.results')}`}
          icon={<Building2 className="h-6 w-6" />}
          iconBg="bg-secondary-100"
          iconColor="text-secondary-600"
          isLoading={summaryLoading}
        />
        <StatCard
          title={t('dashboard.activeContracts')}
          value={summary?.activeContracts || 0}
          subtitle={`${summary?.totalContracts || 0} ${t('common.results')}`}
          icon={<FileText className="h-6 w-6" />}
          iconBg="bg-warning-100"
          iconColor="text-warning-600"
          isLoading={summaryLoading}
        />
      </div>

      {/* Main content grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Today's interventions */}
        <Card>
          <CardHeader
            title={t('dashboard.todayInterventionsTitle')}
            subtitle={`${todayInterventions?.length || 0} ${t('dashboard.scheduledForToday')}`}
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

        {/* Recent activity */}
        <Card>
          <CardHeader
            title={t('dashboard.recentActivityTitle')}
            subtitle={t('dashboard.latestUpdates')}
          />
          <CardContent>
            {activityLoading ? (
              <LoadingSkeleton rows={5} />
            ) : recentActivity && recentActivity.length > 0 ? (
              <div className="space-y-4">
                {recentActivity.slice(0, 6).map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
            ) : (
              <EmptyMessage
                icon={<Clock className="h-8 w-8" />}
                message={t('dashboard.noActivityMessage')}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {summary?.availableAgents || 0}
            </p>
            <p className="text-sm text-gray-500">
              {t('dashboard.availableOf')} {summary?.totalAgents || 0}
            </p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-yellow-100">
            <Clock className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {summary?.pendingInterventions || 0}
            </p>
            <p className="text-sm text-gray-500">{t('dashboard.pendingInterventionsLabel')}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {summary?.completedInterventions || 0}
            </p>
            <p className="text-sm text-gray-500">{t('dashboard.completedThisMonth')}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">0</p>
            <p className="text-sm text-gray-500">{t('dashboard.issuesReported')}</p>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ============================================
// SUB-COMPONENTS
// ============================================

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  isLoading?: boolean;
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  iconBg,
  iconColor,
  isLoading,
}: StatCardProps) {
  return (
    <Card>
      <div className="flex items-center gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${iconBg} ${iconColor}`}>
          {icon}
        </div>
        <div>
          {isLoading ? (
            <div className="h-8 w-16 animate-pulse rounded bg-gray-200" />
          ) : (
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          )}
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-xs text-gray-400">{subtitle}</p>
        </div>
      </div>
    </Card>
  );
}

interface InterventionItemProps {
  intervention: {
    id: string;
    scheduledStartTime: string;
    scheduledEndTime: string;
    status: string;
    zone?: { name: string; site?: { name: string } };
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
    <div className="flex items-center justify-between rounded-lg border border-gray-100 p-3 hover:bg-gray-50">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
          <CheckCircle className="h-5 w-5 text-gray-600" />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">
            {intervention.zone?.name || t('dashboard.unknownZone')}
          </p>
          <p className="text-xs text-gray-500">
            {intervention.zone?.site?.name || t('dashboard.unknownSite')}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm text-gray-600">
            {intervention.scheduledStartTime} - {intervention.scheduledEndTime}
          </p>
          <p className="text-xs text-gray-400">
            {intervention.agent?.firstName} {intervention.agent?.lastName}
          </p>
        </div>
        <Badge className={statusColors[intervention.status] || 'bg-gray-100 text-gray-800'}>
          {intervention.status.replace('_', ' ')}
        </Badge>
      </div>
    </div>
  );
}

interface ActivityItemProps {
  activity: {
    id: string;
    type: string;
    action: string;
    description: string;
    timestamp: string;
    userName?: string;
  };
}

function ActivityItem({ activity }: ActivityItemProps) {
  const typeIcons: Record<string, React.ReactNode> = {
    intervention: <CheckCircle className="h-4 w-4 text-green-600" />,
    absence: <Clock className="h-4 w-4 text-yellow-600" />,
    checklist: <FileText className="h-4 w-4 text-blue-600" />,
  };

  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
        {typeIcons[activity.type] || <AlertCircle className="h-4 w-4 text-gray-600" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900">{activity.description}</p>
        <p className="text-xs text-gray-500">
          {activity.userName && `${activity.userName} · `}
          {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
        </p>
      </div>
    </div>
  );
}

function LoadingSkeleton({ rows }: { rows: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="h-10 w-10 animate-pulse rounded-lg bg-gray-200" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyMessage({ icon, message }: { icon: React.ReactNode; message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-8 text-center">
      <div className="mb-3 text-gray-400">{icon}</div>
      <p className="text-sm text-gray-500">{message}</p>
    </div>
  );
}
