import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { contractsService, clientsService, sitesService } from '@/services';
import { Button, Card, Input, Select } from '@/components/ui';
import { toast } from 'sonner';

const schema = yup.object().shape({
  clientId: yup.string().required('Client is required'),
  siteId: yup.string().required('Site is required'),
  type: yup.string().oneOf(['PERMANENT', 'ONE_TIME']).required('Contract type is required'),
  frequency: yup.string().when('type', {
    is: 'PERMANENT',
    then: (baseSchema) => baseSchema.oneOf(['DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY', 'QUARTERLY', 'CUSTOM']).required('Frequency is required'),
    otherwise: (baseSchema) => baseSchema.optional(),
  }),
  startDate: yup.date().required('Start date is required'),
  endDate: yup.date().optional().nullable(),
  notes: yup.string().optional(),
});

type CreateContractForm = yup.InferType<typeof schema>;

export default function CreateContractPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<CreateContractForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      type: 'PERMANENT',
    },
  });
  
  const selectedClientId = watch('clientId');
  const selectedType = watch('type');

  const { data: clientsData, isLoading: isClientsLoading, error: clientsError } = useQuery({
    queryKey: ['clients'],
    queryFn: () => clientsService.getAll({ limit: 1000 }), // Fetch all clients
  });

  const { data: sitesData } = useQuery({
    queryKey: ['sites', selectedClientId],
    queryFn: () => sitesService.getAll({ clientId: selectedClientId, limit: 1000 }),
    enabled: !!selectedClientId,
  });

  // Compute options before useEffect
  const clientOptions = (clientsData?.data || []).map(client => ({ 
    value: client.id, 
    label: client.name 
  }));
  
  const siteOptions = (sitesData?.data || []).map(site => ({ 
    value: site.id, 
    label: site.name 
  }));

  // Debug: Log clients data
  useEffect(() => {
    console.log('CreateContractPage - clientsData:', clientsData);
    console.log('CreateContractPage - clientsError:', clientsError);
    console.log('CreateContractPage - isClientsLoading:', isClientsLoading);
    console.log('CreateContractPage - clientOptions:', clientOptions);
  }, [clientsData, clientsError, isClientsLoading, clientOptions]);

  const createContractMutation = useMutation({
    mutationFn: (data: any) => contractsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      toast.success(t('contracts.createSuccess'));
      navigate('/contracts');
    },
    onError: (error: any) => {
      toast.error(error.message || t('contracts.createError'));
    },
  });

  const onSubmit = (data: CreateContractForm) => {
    // Convert dates to ISO strings for API
    const submitData = {
      ...data,
      startDate: data.startDate instanceof Date ? data.startDate.toISOString().split('T')[0] : data.startDate,
      endDate: data.endDate instanceof Date ? data.endDate.toISOString().split('T')[0] : data.endDate || null,
    };
    createContractMutation.mutate(submitData);
  };
  
  const contractTypeOptions = [
    { value: 'PERMANENT', label: t('contracts.type.permanent') },
    { value: 'ONE_TIME', label: t('contracts.type.one_time') },
  ]
  const contractFrequencyOptions = [
    { value: 'DAILY', label: t('contracts.frequency.daily') },
    { value: 'WEEKLY', label: t('contracts.frequency.weekly') },
    { value: 'BIWEEKLY', label: t('contracts.frequency.biweekly') },
    { value: 'MONTHLY', label: t('contracts.frequency.monthly') },
    { value: 'QUARTERLY', label: t('contracts.frequency.quarterly') },
    { value: 'CUSTOM', label: t('contracts.frequency.custom') },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('contracts.create')}</h1>
        <p className="mt-1 text-gray-600">{t('contracts.createSubtitle')}</p>
      </div>

      {clientsError && (
        <Card className="p-4 bg-red-50 border border-red-200">
          <p className="text-red-700 text-sm">
            Error loading clients: {clientsError instanceof Error ? clientsError.message : 'Unknown error'}
          </p>
        </Card>
      )}

      {clientsData && clientsData.data && clientsData.data.length === 0 && (
        <Card className="p-4 bg-yellow-50 border border-yellow-200">
          <p className="text-yellow-700 text-sm">
            No clients found in database. Please create a client first.
          </p>
        </Card>
      )}

      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name="clientId"
              control={control}
              render={({ field }) => (
                <Select 
                  {...field} 
                  label={t('clients.title')} 
                  options={clientOptions}
                  disabled={isClientsLoading}
                  helperText={isClientsLoading ? 'Loading clients...' : undefined}
                />
              )}
            />
            <Controller
              name="siteId"
              control={control}
              render={({ field }) => (
                <Select {...field} label={t('sites.title')} options={siteOptions} disabled={!selectedClientId} />
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <Select 
                  {...field}
                  label={t('contracts.form.type')}
                  options={contractTypeOptions}
                />
              )}
            />
            {selectedType === 'PERMANENT' && (
              <Controller
                name="frequency"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label={t('contracts.form.frequency')}
                    options={contractFrequencyOptions}
                  />
                )}
              />
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name="startDate"
              control={control}
              render={({ field }) => (
                <Input 
                  type="date" 
                  label={t('contracts.form.startDate')}
                  value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : (field.value || '')}
                  onChange={(e) => field.onChange(new Date(e.target.value))}
                  onBlur={field.onBlur}
                />
              )}
            />
            <Controller
              name="endDate"
              control={control}
              render={({ field }) => (
                <Input 
                  type="date" 
                  label={t('contracts.form.endDate')}
                  value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : (field.value || '')}
                  onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)}
                  onBlur={field.onBlur}
                />
              )}
            />
          </div>

          <Controller
            name="notes"
            control={control}
            render={({ field }) => (
              <Input {...field} label={t('contracts.form.notes')} />
            )}
          />
          
          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate('/contracts')}>
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
