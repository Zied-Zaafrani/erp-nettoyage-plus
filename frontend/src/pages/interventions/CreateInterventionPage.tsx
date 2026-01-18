import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { Button, Card, Input, Select } from '@/components/ui';
import { interventionsService, contractsService, sitesService, usersService } from '@/services';
import { CreateInterventionDto } from '@/types';
import { toast } from 'sonner';

type CreateInterventionForm = {
  contractId: string;
  siteId: string;
  scheduledDate: string;
  scheduledStartTime: string;
  scheduledEndTime: string;
  assignedAgentIds: string[];
  assignedZoneChiefId?: string | null;
  assignedTeamChiefId?: string | null;
  notes?: string | null;
};

export default function CreateInterventionPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<CreateInterventionForm>({
    mode: 'onChange',
    defaultValues: {
      contractId: '',
      siteId: '',
      scheduledDate: new Date().toISOString().split('T')[0],
      scheduledStartTime: '09:00',
      scheduledEndTime: '17:00',
      assignedAgentIds: [],
      assignedZoneChiefId: '',
      assignedTeamChiefId: '',
      notes: '',
    },
  });

  const selectedContractId = watch('contractId');

  const { data: contractsData } = useQuery({
    queryKey: ['contracts'],
    queryFn: () => contractsService.getAll({ limit: 1000 }),
  });

  const { data: sitesData } = useQuery({
    queryKey: ['sites', { contractId: selectedContractId }],
    queryFn: () => sitesService.getAll({ limit: 1000 }),
    enabled: !!selectedContractId,
  });

  const { data: agentsData } = useQuery({
    queryKey: ['users', 'agents'],
    queryFn: () => usersService.getAll({ role: 'AGENT', limit: 1000 }),
  });

  const { data: zoneChiefsData } = useQuery({
    queryKey: ['users', 'zone-chiefs'],
    queryFn: () => usersService.getAll({ role: 'ZONE_CHIEF' as any, limit: 1000 }),
  });

  const { data: teamChiefsData } = useQuery({
    queryKey: ['users', 'team-chiefs'],
    queryFn: () => usersService.getAll({ role: 'TEAM_CHIEF' as any, limit: 1000 }),
  });

  const createInterventionMutation = useMutation({
    mutationFn: (data: CreateInterventionForm) => {
      console.log('Creating intervention with data:', data);
      const payload: CreateInterventionDto = {
        contractId: data.contractId,
        siteId: data.siteId,
        scheduledDate: data.scheduledDate,
        scheduledStartTime: data.scheduledStartTime,
        scheduledEndTime: data.scheduledEndTime,
        assignedAgentIds: data.assignedAgentIds.filter(Boolean),
        assignedZoneChiefId: data.assignedZoneChiefId || undefined,
        assignedTeamChiefId: data.assignedTeamChiefId || undefined,
        notes: data.notes || undefined,
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

  const contractOptions =
    contractsData?.data?.map((contract: any) => ({
      value: contract.id,
      label: `${contract.contractCode || 'N/A'} - ${contract.client?.name || 'N/A'}`,
    })) || [];

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

  const zoneChiefOptions =
    zoneChiefsData?.data?.map((user: any) => ({
      value: user.id,
      label: user.fullName || user.email,
    })) || [];

  const teamChiefOptions =
    teamChiefsData?.data?.map((user: any) => ({
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
          {/* Step 1: Contract & Site Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name="contractId"
              control={control}
              rules={{ required: 'Contract is required' }}
              render={({ field: { value, onChange, onBlur } }) => (
                <div>
                  <Select
                    value={value || ''}
                    onChange={onChange}
                    onBlur={onBlur}
                    label={t('contracts.title')}
                    options={contractOptions}
                    error={errors.contractId?.message}
                  />
                </div>
              )}
            />

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
                    disabled={!selectedContractId}
                    error={errors.siteId?.message}
                  />
                </div>
              )}
            />
          </div>

          {/* Step 2: Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          </div>

          {/* Step 3: Agents Assignment */}
          <Controller
            name="assignedAgentIds"
            control={control}
            rules={{ required: 'At least one agent is required' }}
            render={({ field: { value, onChange, onBlur } }) => (
              <div>
                <Select
                  value={value || []}
                  onChange={onChange}
                  onBlur={onBlur}
                  label={t('interventions.form.agents')}
                  options={agentOptions}
                  multiple
                  error={errors.assignedAgentIds?.message}
                />
              </div>
            )}
          />

          {/* Step 4: Chiefs (Optional) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name="assignedZoneChiefId"
              control={control}
              render={({ field: { value, onChange, onBlur } }) => (
                <Select
                  value={value || ''}
                  onChange={onChange}
                  onBlur={onBlur}
                  label={t('interventions.form.zoneChief')}
                  options={zoneChiefOptions}
                />
              )}
            />

            <Controller
              name="assignedTeamChiefId"
              control={control}
              render={({ field: { value, onChange, onBlur } }) => (
                <Select
                  value={value || ''}
                  onChange={onChange}
                  onBlur={onBlur}
                  label={t('interventions.form.teamChief')}
                  options={teamChiefOptions}
                />
              )}
            />
          </div>

          {/* Step 5: Notes */}
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
