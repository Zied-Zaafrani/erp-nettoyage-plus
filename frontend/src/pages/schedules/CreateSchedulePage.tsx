import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { Button, Card, Input, Select } from '@/components/ui';
import { schedulesService, contractsService } from '@/services';
import { CreateScheduleDto, RecurrencePattern } from '@/types';
import { toast } from 'sonner';

const schema = yup.object().shape({
  contractId: yup.string().required('Contract is required'),
  siteId: yup.string().required('Site is required'),
  zoneId: yup.string().optional(),
  recurrencePattern: yup.string().required('Recurrence pattern is required'),
  startTime: yup.string().required('Start time is required').matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format'),
  endTime: yup.string().required('End time is required').matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format'),
  validFrom: yup.string().required('Valid from date is required'),
  validUntil: yup.string().optional(),
  daysOfWeek: yup.string().optional(),
  dayOfMonth: yup.number().optional().min(1).max(31),
  notes: yup.string().optional(),
});

type CreateScheduleForm = yup.InferType<typeof schema>;

export default function CreateSchedulePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { control, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm<CreateScheduleForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      contractId: '',
      siteId: '',
      zoneId: '',
      recurrencePattern: 'DAILY',
      startTime: '09:00',
      endTime: '17:00',
      validFrom: new Date().toISOString().split('T')[0],
      validUntil: '',
      notes: '',
    },
  });

  const contractId = watch('contractId');

  const { data: contractsData } = useQuery({
    queryKey: ['contracts'],
    queryFn: () => contractsService.getAll({ limit: 1000 }),
  });

  const { data: sitesData } = useQuery({
    queryKey: ['sites', { contractId }],
    queryFn: () => contractsService.getById(contractId).then(c => c.sites || []),
    enabled: !!contractId,
  });

  const createScheduleMutation = useMutation({
    mutationFn: (data: CreateScheduleForm) => {
      const daysOfWeek = data.daysOfWeek
        ? data.daysOfWeek.split(',').map(d => parseInt(d.trim(), 10))
        : undefined;

      return schedulesService.create({
        ...data,
        daysOfWeek,
        dayOfMonth: data.dayOfMonth ? parseInt(data.dayOfMonth.toString(), 10) : undefined,
      } as CreateScheduleDto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schedules'] });
      toast.success(t('schedules.createSuccess'));
      navigate('/schedules');
    },
    onError: (error: any) => {
      console.error('Error creating schedule:', error);
      const errorMsg = error.response?.data?.message || error.message || t('schedules.createError');
      toast.error(errorMsg);
    },
  });

  const onSubmit = (data: CreateScheduleForm) => {
    createScheduleMutation.mutate(data);
  };

  const contractOptions = contractsData?.data?.map((contract: any) => ({
    value: contract.id,
    label: contract.contractCode,
  })) || [];

  const siteOptions = sitesData?.map((site: any) => ({
    value: site.id,
    label: site.name,
  })) || [];

  const recurrenceOptions = [
    { value: 'DAILY', label: t('schedules.recurrence.daily') },
    { value: 'WEEKLY', label: t('schedules.recurrence.weekly') },
    { value: 'BIWEEKLY', label: t('schedules.recurrence.biweekly') },
    { value: 'MONTHLY', label: t('schedules.recurrence.monthly') },
    { value: 'QUARTERLY', label: t('schedules.recurrence.quarterly') },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t('schedules.create')}
        </h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          {t('schedules.createSubtitle')}
        </p>
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
                  error={errors.contractId?.message}
                />
              )}
            />

            <Controller
              name="siteId"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Select
                  value={value}
                  onChange={onChange}
                  options={siteOptions}
                  label={t('schedules.form.site')}
                  error={errors.siteId?.message}
                />
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name="recurrencePattern"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Select
                  value={value}
                  onChange={onChange}
                  options={recurrenceOptions}
                  label={t('schedules.form.recurrence')}
                  error={errors.recurrencePattern?.message}
                />
              )}
            />

            <Controller
              name="zoneId"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Input
                  value={value || ''}
                  onChange={onChange}
                  label={t('schedules.form.zone')}
                  placeholder={t('schedules.form.zonePlaceholder')}
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
                  error={errors.startTime?.message}
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
                  error={errors.endTime?.message}
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
                  error={errors.validFrom?.message}
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
                  error={errors.validUntil?.message}
                />
              )}
            />
          </div>

          <Controller
            name="notes"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Input
                value={value || ''}
                onChange={onChange}
                label={t('schedules.form.notes')}
                placeholder={t('schedules.form.notesPlaceholder')}
                error={errors.notes?.message}
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
