import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { absencesService, usersService } from '@/services';
import { Card, Button, Input, Select } from '@/components/ui';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { AbsenceType } from '@/types';
import { toast } from 'sonner';

const schema = yup.object().shape({
  agentId: yup.string().required('Agent is required'),
  absenceType: yup.string().oneOf(['VACATION', 'SICK_LEAVE', 'UNPAID', 'AUTHORIZED', 'UNAUTHORIZED']).required('Type is required'),
  startDate: yup.string().required('Start date is required'),
  endDate: yup.string().required('End date is required'),
  reason: yup.string().optional(),
});

type AbsenceForm = {
  agentId: string;
  absenceType: AbsenceType;
  startDate: string;
  endDate: string;
  reason?: string;
};

export default function AbsenceDetailPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: absenceData, isLoading, isError } = useQuery({
    queryKey: ['absences', id],
    queryFn: () => absencesService.getById(id!),
    enabled: !!id,
  });

  const { data: agentsData } = useQuery({
    queryKey: ['users', 'agents'],
    queryFn: () => usersService.getAll({ role: 'AGENT', limit: 100 }),
  });

  const updateAbsenceMutation = useMutation({
    mutationFn: (data: any) => absencesService.update(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['absences'] });
      toast.success(t('absences.updateSuccess'));
      navigate('/absences');
    },
    onError: (error: any) => {
      toast.error(error.message || t('absences.updateError'));
    },
  });

  const deleteAbsenceMutation = useMutation({
    mutationFn: () => absencesService.delete(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['absences'] });
      toast.success(t('absences.deleteSuccess'));
      navigate('/absences');
    },
    onError: (error: any) => {
      toast.error(error.message || t('absences.deleteError'));
    },
  });

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<AbsenceForm>({
    resolver: yupResolver(schema),
    defaultValues: absenceData || {},
  });

  // Reset form when data is loaded
  useEffect(() => {
    if (absenceData) {
      reset({
        agentId: absenceData.agentId,
        absenceType: absenceData.absenceType,
        startDate: absenceData.startDate,
        endDate: absenceData.endDate,
        reason: absenceData.reason,
      });
    }
  }, [absenceData, reset]);

  const agentOptions =
    agentsData?.data?.map((user: any) => ({
      value: user.id,
      label: user.fullName || user.email,
    })) || [];

  const typeOptions = [
    { value: 'VACATION', label: t('absences.types.vacation') },
    { value: 'SICK_LEAVE', label: t('absences.types.sick_leave') },
    { value: 'UNPAID', label: t('absences.types.unpaid') },
    { value: 'AUTHORIZED', label: t('absences.types.authorized') },
    { value: 'UNAUTHORIZED', label: t('absences.types.unauthorized') },
  ];

  const onSubmit = (data: AbsenceForm) => {
    updateAbsenceMutation.mutate(data);
  };

  if (isLoading) {
    return <Card className="p-6 text-center">{t('common.loading')}</Card>;
  }
  if (isError || !absenceData) {
    return <Card className="p-6 text-center text-red-500">{t('common.error')}</Card>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('absences.details')}
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            {t('absences.detailsSubtitle')}
          </p>
        </div>
        <Button variant="danger" onClick={() => deleteAbsenceMutation.mutate()}>
          {t('common.delete')}
        </Button>
      </div>
      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Controller
            name="agentId"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                label={t('absences.form.agent')}
                options={agentOptions}
                disabled
              />
            )}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name="startDate"
              control={control}
              render={({ field }) => (
                <Input
                  type="date"
                  label={t('absences.form.startDate')}
                  value={field.value || ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  disabled
                />
              )}
            />
            <Controller
              name="endDate"
              control={control}
              render={({ field }) => (
                <Input
                  type="date"
                  label={t('absences.form.endDate')}
                  value={field.value || ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  disabled
                />
              )}
            />
          </div>
          <Controller
            name="absenceType"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                label={t('absences.form.type')}
                options={typeOptions}
                disabled
              />
            )}
          />
          <Controller
            name="reason"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label={t('absences.form.reason')}
                placeholder={t('absences.form.reasonPlaceholder')}
                disabled
              />
            )}
          />
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/absences')}
            >
              {t('common.back')}
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
