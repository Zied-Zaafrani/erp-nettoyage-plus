import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Plus, Calendar, Trash2 } from 'lucide-react';
import { Button, Card, Input, Select } from '@/components/ui';
import { schedulesService } from '@/services';
import { Schedule, RecurrencePattern, ScheduleStatus } from '@/types';
import { toast } from 'sonner';

export default function SchedulesListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [contractFilter, setContractFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<ScheduleStatus | ''>('');

  const { data: schedulesData = [], isLoading, isError } = useQuery({
    queryKey: ['schedules', contractFilter, statusFilter],
    queryFn: () => schedulesService.getAll({
      contractId: contractFilter || undefined,
      status: (statusFilter as ScheduleStatus) || undefined,
    }),
  });

  const deleteScheduleMutation = useMutation({
    mutationFn: (id: string) => schedulesService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      toast.success(t('schedules.deleteSuccess'));
    },
    onError: (error: any) => {
      toast.error(error.message || t('schedules.deleteError'));
    },
  });

  const statusOptions = [
    { value: '', label: t('common.all') },
    { value: 'ACTIVE', label: t('schedules.statuses.active') },
    { value: 'PAUSED', label: t('schedules.statuses.paused') },
    { value: 'COMPLETED', label: t('schedules.statuses.completed') },
  ];

  const recurrenceLabels: Record<RecurrencePattern, string> = {
    DAILY: t('schedules.recurrence.daily'),
    WEEKLY: t('schedules.recurrence.weekly'),
    BIWEEKLY: t('schedules.recurrence.biweekly'),
    MONTHLY: t('schedules.recurrence.monthly'),
    QUARTERLY: t('schedules.recurrence.quarterly'),
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (isError) {
    return <Card className="p-6 text-center text-red-500">{t('common.error')}</Card>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('schedules.title')}
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            {t('schedules.subtitle')}
          </p>
        </div>
        <Button
          onClick={() => navigate('/schedules/create')}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          {t('schedules.create')}
        </Button>
      </div>

      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Input
            placeholder={t('schedules.form.filterByContract')}
            value={contractFilter}
            onChange={(e) => setContractFilter(e.target.value)}
          />
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ScheduleStatus | '')}
            options={statusOptions}
          />
        </div>
      </Card>

      {schedulesData.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-12">
          <Calendar className="h-16 w-16 text-gray-300" />
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
            {t('schedules.title')}
          </h3>
          <p className="mt-1 text-sm text-gray-500">{t('common.noData')}</p>
        </Card>
      ) : (
        <Card className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
                  {t('schedules.table.contract')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
                  {t('schedules.table.recurrence')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
                  {t('schedules.table.time')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
                  {t('schedules.table.validFrom')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
                  {t('schedules.table.status')}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 dark:text-gray-300 uppercase">
                  {t('common.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {(schedulesData as Schedule[]).map((schedule) => (
                <tr key={schedule.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {schedule.contract?.contractCode || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {recurrenceLabels[schedule.recurrencePattern] || schedule.recurrencePattern}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {schedule.startTime} - {schedule.endTime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {new Date(schedule.validFrom).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      schedule.status === 'ACTIVE'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : schedule.status === 'PAUSED'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}>
                      {t(`schedules.statuses.${schedule.status.toLowerCase()}`)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => navigate(`/schedules/${schedule.id}`)}
                    >
                      {t('common.edit')}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        if (confirm(t('common.confirmDelete'))) {
                          deleteScheduleMutation.mutate(schedule.id);
                        }
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
