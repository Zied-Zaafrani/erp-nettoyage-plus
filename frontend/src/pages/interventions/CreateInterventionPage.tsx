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
  scheduledDate: yup.date().required('Scheduled date is required'),
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
    formState: { errors, isSubmitting },
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
    createInterventionMutation.mutate(data);
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {t('interventions.create')}
        </h1>
        <p className="mt-1 text-gray-600">{t('interventions.createSubtitle')}</p>
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

          <div>
            <Controller
              name="scheduledDate"
              control={control}
              render={({ field }) => (
                <Input
                  type="date"
                  label={t('interventions.form.scheduledDate')}
                  value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : (field.value || '')}
                  onChange={(e) => field.onChange(new Date(e.target.value))}
                  onBlur={field.onBlur}
                />
              )}
            />
            {errors.scheduledDate && (
              <p className="text-red-500 text-sm mt-1">
                {errors.scheduledDate.message}
              </p>
            )}
          </div>

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
