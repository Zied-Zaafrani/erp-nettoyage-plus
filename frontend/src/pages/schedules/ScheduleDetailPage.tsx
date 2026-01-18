import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Button, Card, Input, Select } from '@/components/ui';
import { schedulesService, contractsService } from '@/services';
import { UpdateScheduleDto } from '@/types';
import { toast } from 'sonner';

const schema = yup.object().shape({
  contractId: yup.string(),
  siteId: yup.string(),
  zoneId: yup.string().optional(),
  recurrencePattern: yup.string(),
  startTime: yup.string().matches(/^([01]\d|2[0-3]):([0-5]\d)$/),
  endTime: yup.string().matches(/^([01]\d|2[0-3]):([0-5]\d)$/),
  validFrom: yup.string(),
  validUntil: yup.string().optional(),
  status: yup.string(),
  notes: yup.string().optional(),
});

type UpdateScheduleForm = yup.InferType<typeof schema>;

export default function ScheduleDetailPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: scheduleData, isLoading } = useQuery({
    queryKey: ['schedules', id],
    queryFn: () => schedulesService.getById(id!),
    enabled: !!id,
  });

  const { data: contractsData } = useQuery({
    queryKey: ['contracts'],
    queryFn: () => contractsService.getAll({ limit: 1000 }),
  });

  const { control, handleSubmit, formState: { isSubmitting }, reset } = useForm<UpdateScheduleForm>({
    resolver: yupResolver(schema),
    defaultValues: scheduleData || {},
  });

  useQuery({
    queryKey: ['schedule-load', scheduleData?.id],
    queryFn: () => {
      if (scheduleData) {
        reset({
          contractId: scheduleData.contractId,
          siteId: scheduleData.siteId,
          zoneId: scheduleData.zoneId,
          recurrencePattern: scheduleData.recurrencePattern,
          startTime: scheduleData.startTime,
          endTime: scheduleData.endTime,
          validFrom: scheduleData.validFrom,
          validUntil: scheduleData.validUntil,
          status: scheduleData.status,
          notes: scheduleData.notes,
        });
      }
      return null;
    },
    enabled: !!scheduleData,
  });

  const updateScheduleMutation = useMutation({
    mutationFn: (data: UpdateScheduleForm) =>
      schedulesService.update(id!, data as UpdateScheduleDto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      toast.success(t('schedules.updateSuccess'));
      navigate('/schedules');
    },
    onError: (error: any) => {
      toast.error(error.message || t('schedules.updateError'));
    },
  });

  const deleteScheduleMutation = useMutation({
    mutationFn: () => schedulesService.delete(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      toast.success(t('schedules.deleteSuccess'));
      navigate('/schedules');
    },
    onError: (error: any) => {
      toast.error(error.message || t('schedules.deleteError'));
    },
  });

  const onSubmit = (data: UpdateScheduleForm) => {
    updateScheduleMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (!scheduleData) {
    return <Card className="p-6 text-center text-red-500">{t('common.notFound')}</Card>;
  }

  const contractOptions = contractsData?.data?.map((contract: any) => ({
    value: contract.id,
    label: contract.contractCode,
  })) || [];

  const recurrenceOptions = [
    { value: 'DAILY', label: t('schedules.recurrence.daily') },
    { value: 'WEEKLY', label: t('schedules.recurrence.weekly') },
    { value: 'BIWEEKLY', label: t('schedules.recurrence.biweekly') },
    { value: 'MONTHLY', label: t('schedules.recurrence.monthly') },
    { value: 'QUARTERLY', label: t('schedules.recurrence.quarterly') },
  ];

  const statusOptions = [
    { value: 'ACTIVE', label: t('schedules.statuses.active') },
    { value: 'PAUSED', label: t('schedules.statuses.paused') },
    { value: 'COMPLETED', label: t('schedules.statuses.completed') },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('schedules.details')}
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            {t('schedules.detailsSubtitle')}
          </p>
        </div>
        <Button
          variant="danger"
          onClick={() => {
            if (confirm(t('common.confirmDelete'))) {
              deleteScheduleMutation.mutate();
            }
          }}
        >
          {t('common.delete')}
        </Button>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name="contractId"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Select
                  value={value}
                  onChange={onChange}
                  options={contractOptions}
                  label={t('schedules.form.contract')}
                />
              )}
            />

            <Controller
              name="recurrencePattern"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Select
                  value={value}
                  onChange={onChange}
                  options={recurrenceOptions}
                  label={t('schedules.form.recurrence')}
                />
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name="startTime"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Input
                  type="time"
                  value={value}
                  onChange={onChange}
                  label={t('schedules.form.startTime')}
                />
              )}
            />

            <Controller
              name="endTime"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Input
                  type="time"
                  value={value}
                  onChange={onChange}
                  label={t('schedules.form.endTime')}
                />
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name="validFrom"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Input
                  type="date"
                  value={value}
                  onChange={onChange}
                  label={t('schedules.form.validFrom')}
                />
              )}
            />

            <Controller
              name="validUntil"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Input
                  type="date"
                  value={value || ''}
                  onChange={onChange}
                  label={t('schedules.form.validUntil')}
                />
              )}
            />
          </div>

          <Controller
            name="status"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Select
                value={value}
                onChange={onChange}
                options={statusOptions}
                label={t('schedules.form.status')}
              />
            )}
          />

          <Controller
            name="notes"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Input
                value={value || ''}
                onChange={onChange}
                label={t('schedules.form.notes')}
              />
            )}
          />

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/schedules')}
            >
              {t('common.cancel')}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? t('common.saving') : t('common.save')}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
