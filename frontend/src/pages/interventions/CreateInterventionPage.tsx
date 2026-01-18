import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Card, Input, Select } from '@/components/ui';
import { toast } from 'sonner';
import { 
  interventionsService, 
  contractsService, 
  sitesService 
} from '@/services';

const schema = yup.object().shape({
  contractId: yup.string().required('Contract is required'),
  siteId: yup.string().required('Site is required'),
  scheduledDate: yup.string().required('Scheduled date is required'),
  scheduledStartTime: yup
    .string()
    .required('Start time is required')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format: HH:MM'),
  scheduledEndTime: yup
    .string()
    .required('End time is required')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Format: HH:MM'),
  assignedAgentIds: yup
    .array()
    .of(yup.string())
    .min(1, 'At least one agent required'),
  assignedZoneChiefId: yup.string().optional(),
  assignedTeamChiefId: yup.string().optional(),
  notes: yup.string().optional(),
});

type CreateInterventionForm = yup.InferType<typeof schema>;

export default function CreateInterventionPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<CreateInterventionForm>({
    resolver: yupResolver(schema),
  });

  const selectedContractId = watch('contractId');

  const { data: contractsData } = useQuery({
    queryKey: ['contracts'],
    queryFn: () => contractsService.getAll({ limit: 1000 }),
  });

  const { data: sitesData } = useQuery({
    queryKey: ['sites', selectedContractId],
    queryFn: () => 
      sitesService.getAll({ limit: 1000 }),
    enabled: !!selectedContractId,
  });

  const createInterventionMutation = useMutation({
    mutationFn: (data: any) => interventionsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['interventions'] });
      toast.success(t('interventions.createSuccess'));
      navigate('/interventions');
    },
    onError: (error: any) => {
      toast.error(error.message || t('interventions.createError'));
    },
  });

  const onSubmit = (data: CreateInterventionForm) => {
    const payload = {
      ...data,
      assignedAgentIds: Array.isArray(data.assignedAgentIds)
        ? data.assignedAgentIds
        : [data.assignedAgentIds],
      scheduledStartTime: data.scheduledStartTime.slice(0,5),
      scheduledEndTime: data.scheduledEndTime.slice(0,5),
    };
    createInterventionMutation.mutate(payload);
  };

  const contractOptions =
    contractsData?.data?.map((contract) => ({
      value: contract.id,
      label: `${contract.contractCode || 'N/A'} - ${contract.client?.name || 'N/A'}`,
    })) || [];

  const siteOptions =
    sitesData?.data?.map((site) => ({
      value: site.id,
      label: site.name,
    })) || [];

  const agentOptions = [
    { value: '', label: t('common.select') },
  ];

  const zoneChiefOptions = [
    { value: '', label: t('common.select') },
  ];

  const teamChiefOptions = [
    { value: '', label: t('common.select') },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t('interventions.create')}
        </h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">{t('interventions.createSubtitle')}</p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name="contractId"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  label={t('contracts.title')}
                  options={contractOptions}
                />
              )}
            />
            <Controller
              name="siteId"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  label={t('sites.title')}
                  options={siteOptions}
                  disabled={!selectedContractId}
                />
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name="scheduledDate"
              control={control}
              render={({ field }) => (
                <Input
                  type="date"
                  label={t('interventions.form.scheduledDate')}
                  value={field.value || ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />
            <Controller
              name="scheduledStartTime"
              control={control}
              render={({ field }) => (
                <Input
                  type="time"
                  label={t('interventions.form.startTime')}
                  value={field.value || ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />
            <Controller
              name="scheduledEndTime"
              control={control}
              render={({ field }) => (
                <Input
                  type="time"
                  label={t('interventions.form.endTime')}
                  value={field.value || ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />
          </div>

          <Controller
            name="assignedAgentIds"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                value={field.value?.filter((v) => v !== undefined) || []}
                label={t('interventions.form.agents')}
                options={agentOptions}
                multiple
              />
            )}
          />
          <Controller
            name="assignedZoneChiefId"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                label={t('interventions.form.zoneChief')}
                options={zoneChiefOptions}
              />
            )}
          />
          <Controller
            name="assignedTeamChiefId"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                label={t('interventions.form.teamChief')}
                options={teamChiefOptions}
              />
            )}
          />
          <Controller
            name="notes"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label={t('interventions.form.notes')}
                placeholder={t('interventions.form.notesPlaceholder')}
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
