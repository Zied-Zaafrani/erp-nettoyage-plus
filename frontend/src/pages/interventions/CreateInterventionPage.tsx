import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { Button, Card, Input, Select } from '@/components/ui';
import { interventionsService, sitesService, usersService } from '@/services';
import { CreateInterventionDto } from '@/types';
import { toast } from 'sonner';

const schema = yup.object().shape({
  siteId: yup.string().required('Site is required'),
  agentId: yup.string().required('Agent is required'),
  scheduledDate: yup.string().required('Scheduled date is required').matches(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  scheduledStartTime: yup.string().required('Start time is required').matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format'),
  scheduledEndTime: yup.string().required('End time is required').matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format'),
  notes: yup.string().optional().nullable(),
  scheduleId: yup.string().optional().nullable(),
});

type CreateInterventionForm = {
  siteId: string;
  agentId: string;
  scheduledDate: string;
  scheduledStartTime: string;
  scheduledEndTime: string;
  notes?: string | null;
  scheduleId?: string | null;
};

export default function CreateInterventionPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateInterventionForm>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      siteId: '',
      agentId: '',
      scheduledDate: new Date().toISOString().split('T')[0],
      scheduledStartTime: '09:00',
      scheduledEndTime: '17:00',
      notes: '',
      scheduleId: '',
    },
  });

  const { data: sitesData } = useQuery({
    queryKey: ['sites'],
    queryFn: () => sitesService.getAll({ limit: 1000 }),
  });

  const { data: agentsData } = useQuery({
    queryKey: ['users', 'agents'],
    queryFn: () => usersService.getAll({ role: 'AGENT', limit: 1000 }),
  });

  const createInterventionMutation = useMutation({
    mutationFn: (data: CreateInterventionForm) => {
      console.log('Creating intervention with data:', data);
      const payload: CreateInterventionDto = {
        siteId: data.siteId,
        agentId: data.agentId,
        scheduledDate: data.scheduledDate,
        scheduledStartTime: data.scheduledStartTime,
        scheduledEndTime: data.scheduledEndTime,
        notes: data.notes || undefined,
        scheduleId: data.scheduleId || undefined,
      };
      return interventionsService.create(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interventions'] });
      toast.success(t('interventions.createSuccess'));
      navigate('/interventions');
    },
    onError: (error: any) => {
      console.error('Error creating intervention:', error);
      const errorMsg = error.response?.data?.message || error.message || t('interventions.createError');
      toast.error(errorMsg);
    },
  });

  const onSubmit = (data: CreateInterventionForm) => {
    console.log('Form data before submission:', data);
    createInterventionMutation.mutate(data);
  };

  const siteOptions =
    sitesData?.data?.map((site: any) => ({
      value: site.id,
      label: site.name,
    })) || [];

  const agentOptions =
    agentsData?.data?.map((user: any) => ({
      value: user.id,
      label: user.fullName || user.email,
    })) || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t('interventions.create')}
        </h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          {t('interventions.createSubtitle')}
        </p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name="siteId"
              control={control}
              rules={{ required: 'Site is required' }}
              render={({ field: { value, onChange, onBlur } }) => (
                <div>
                  <Select
                    value={value || ''}
                    onChange={onChange}
                    onBlur={onBlur}
                    label={t('sites.title')}
                    options={siteOptions}
                    error={errors.siteId?.message}
                  />
                </div>
              )}
            />

            <Controller
              name="agentId"
              control={control}
              rules={{ required: 'Agent is required' }}
              render={({ field: { value, onChange, onBlur } }) => (
                <div>
                  <Select
                    value={value || ''}
                    onChange={onChange}
                    onBlur={onBlur}
                    label={t('interventions.form.agents')}
                    options={agentOptions}
                    error={errors.agentId?.message}
                  />
                </div>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name="scheduledDate"
              control={control}
              rules={{ required: 'Scheduled date is required' }}
              render={({ field: { value, onChange, onBlur } }) => (
                <div>
                  <Input
                    type="date"
                    label={t('interventions.form.scheduledDate')}
                    value={value || ''}
                    onChange={onChange}
                    onBlur={onBlur}
                    error={errors.scheduledDate?.message}
                  />
                </div>
              )}
            />

            <Controller
              name="scheduledStartTime"
              control={control}
              rules={{ required: 'Start time is required' }}
              render={({ field: { value, onChange, onBlur } }) => (
                <div>
                  <Input
                    type="time"
                    label={t('interventions.form.startTime')}
                    value={value || ''}
                    onChange={onChange}
                    onBlur={onBlur}
                    error={errors.scheduledStartTime?.message}
                  />
                </div>
              )}
            />
          </div>

          <Controller
            name="scheduledEndTime"
            control={control}
            rules={{ required: 'End time is required' }}
            render={({ field: { value, onChange, onBlur } }) => (
              <div>
                <Input
                  type="time"
                  label={t('interventions.form.endTime')}
                  value={value || ''}
                  onChange={onChange}
                  onBlur={onBlur}
                  error={errors.scheduledEndTime?.message}
                />
              </div>
            )}
          />

          <Controller
            name="notes"
            control={control}
            render={({ field: { value, onChange, onBlur } }) => (
              <Input
                value={value || ''}
                onChange={onChange}
                onBlur={onBlur}
                label={t('interventions.form.notes')}
                placeholder={t('interventions.form.notesPlaceholder')}
                error={errors.notes?.message}
              />
            )}
          />

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/interventions')}
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
