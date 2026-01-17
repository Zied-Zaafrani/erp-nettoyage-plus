import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { contractsService, clientsService, sitesService } from '@/services';
import { Button, Card, Input, Select } from '@/components/ui';
import { toast } from 'sonner';
import { ArrowLeft, AlertCircle } from 'lucide-react';

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
  status: yup.string().oneOf(['DRAFT', 'ACTIVE', 'SUSPENDED', 'COMPLETED', 'TERMINATED']).required('Status is required'),
  notes: yup.string().optional().nullable(),
  pricing: yup.object().optional().nullable(),
  serviceScope: yup.object().optional().nullable(),
});

type UpdateContractForm = yup.InferType<typeof schema>;

export default function UpdateContractPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: contractData, isLoading, error } = useQuery({
    queryKey: ['contract', id],
    queryFn: () => contractsService.getById(id!),
    enabled: !!id,
  });

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<UpdateContractForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      type: 'PERMANENT',
      status: 'DRAFT',
    },
  });

  // Update form when contract data loads
  useEffect(() => {
    if (contractData) {
      reset({
        clientId: contractData.clientId || '',
        siteId: contractData.siteId || '',
        type: contractData.type || 'PERMANENT',
        frequency: contractData.frequency || undefined,
        startDate: new Date(contractData.startDate),
        endDate: contractData.endDate ? new Date(contractData.endDate) : null,
        status: contractData.status || 'DRAFT',
        notes: contractData.notes || '',
        pricing: contractData.pricing || null,
        serviceScope: contractData.serviceScope || null,
      });
    }
  }, [contractData, reset]);

  const selectedClientId = watch('clientId');
  const selectedType = watch('type');

  const { data: clientsData } = useQuery({
    queryKey: ['clients'],
    queryFn: () => clientsService.getAll({ limit: 1000 }),
  });

  const { data: sitesData } = useQuery({
    queryKey: ['sites', selectedClientId],
    queryFn: () => sitesService.getAll({ clientId: selectedClientId, limit: 1000 }),
    enabled: !!selectedClientId,
  });

  const updateContractMutation = useMutation({
    mutationFn: (data: UpdateContractForm) => contractsService.update(id!, data as any),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      queryClient.invalidateQueries({ queryKey: ['contract', id] });
      toast.success(t('contracts.updateSuccess'));
      navigate(`/contracts/${id}`);
    },
    onError: (error: any) => {
      toast.error(error.message || t('contracts.updateError'));
    },
  });

  const onSubmit = (data: UpdateContractForm) => {
    updateContractMutation.mutate(data);
  };

  const clientOptions = clientsData?.data?.map(client => ({ value: client.id, label: client.name })) || [];
  const siteOptions = sitesData?.data?.map(site => ({ value: site.id, label: site.name })) || [];

  const contractTypeOptions = [
    { value: 'PERMANENT', label: t('contracts.type.permanent') },
    { value: 'ONE_TIME', label: t('contracts.type.one_time') },
  ];

  const contractStatusOptions = [
    { value: 'DRAFT', label: t('contracts.status.draft') },
    { value: 'ACTIVE', label: t('contracts.status.active') },
    { value: 'SUSPENDED', label: t('contracts.status.suspended') },
    { value: 'COMPLETED', label: t('contracts.status.completed') },
    { value: 'TERMINATED', label: t('contracts.status.terminated') },
  ];

  const contractFrequencyOptions = [
    { value: 'DAILY', label: t('contracts.frequency.daily') },
    { value: 'WEEKLY', label: t('contracts.frequency.weekly') },
    { value: 'BIWEEKLY', label: t('contracts.frequency.biweekly') },
    { value: 'MONTHLY', label: t('contracts.frequency.monthly') },
    { value: 'QUARTERLY', label: t('contracts.frequency.quarterly') },
    { value: 'CUSTOM', label: t('contracts.frequency.custom') },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-gray-500">{t('common.loading')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-8 text-center">
        <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
        <div className="text-red-600">{t('common.error')}</div>
      </Card>
    );
  }

  if (!contractData) {
    return (
      <Card className="p-8 text-center">
        <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <div className="text-gray-600">{t('contracts.notFound')}</div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(`/contracts/${id}`)}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('contracts.edit')}</h1>
          <p className="mt-1 text-gray-600">{contractData.contractCode}</p>
        </div>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Client */}
            <div>
              <label className="block text-sm font-medium text-gray-700">{t('common.client')}</label>
              <Controller
                name="clientId"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={clientOptions}
                    disabled={true}
                  />
                )}
              />
              {errors.clientId && <p className="text-red-500 text-sm mt-1">{errors.clientId.message}</p>}
            </div>

            {/* Site */}
            <div>
              <label className="block text-sm font-medium text-gray-700">{t('sites.title')}</label>
              <Controller
                name="siteId"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={siteOptions}
                    disabled={!selectedClientId}
                  />
                )}
              />
              {errors.siteId && <p className="text-red-500 text-sm mt-1">{errors.siteId.message}</p>}
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700">{t('contracts.form.type')}</label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={contractTypeOptions}
                  />
                )}
              />
              {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700">{t('common.status')}</label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={contractStatusOptions}
                  />
                )}
              />
              {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>}
            </div>

            {/* Frequency (for PERMANENT contracts) */}
            {selectedType === 'PERMANENT' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('contracts.form.frequency')}</label>
                <Controller
                  name="frequency"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      options={contractFrequencyOptions}
                    />
                  )}
                />
                {errors.frequency && <p className="text-red-500 text-sm mt-1">{errors.frequency.message}</p>}
              </div>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700">{t('contracts.form.startDate')}</label>
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="date"
                    value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                    onChange={(e) => field.onChange(new Date(e.target.value))}
                  />
                )}
              />
              {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>}
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700">{t('contracts.form.endDate')}</label>
              <Controller
                name="endDate"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="date"
                    value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                    onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : null)}
                  />
                )}
              />
              {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate.message}</p>}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('common.notes')}</label>
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <textarea
                  placeholder={t('common.notesPlaceholder')}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={field.value ?? ''}
                  onChange={(e) => field.onChange(e.target.value)}
                  onBlur={field.onBlur}
                  name={field.name}
                />
              )}
            />
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-6 border-t">
            <Button
              type="submit"
              disabled={isSubmitting || !isDirty || updateContractMutation.isPending}
            >
              {updateContractMutation.isPending ? t('common.saving') : t('common.save')}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/contracts/${id}`)}
            >
              {t('common.cancel')}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
