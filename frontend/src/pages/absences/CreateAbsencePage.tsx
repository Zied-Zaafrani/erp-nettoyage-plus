import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { Button, Card, Input, Select } from '@/components/ui';
import { absencesService, usersService } from '@/services';
import { AbsenceType, CreateAbsenceDto } from '@/types';
import { toast } from 'sonner';

const schema = yup.object().shape({
  agentId: yup.string().required('Agent is required'),
  absenceType: yup.string().oneOf(['VACATION', 'SICK_LEAVE', 'UNPAID', 'AUTHORIZED', 'UNAUTHORIZED']).required('Type is required'),
  startDate: yup.string().required('Start date is required').matches(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  endDate: yup.string().required('End date is required').matches(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  reason: yup.string().optional().nullable(),
});

type CreateAbsenceForm = {
  agentId: string;
  absenceType: AbsenceType;
  startDate: string;
  endDate: string;
  reason?: string | null;
};

export default function CreateAbsencePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateAbsenceForm>({
    resolver: yupResolver(schema),
    mode: 'onChange',
    defaultValues: {
      agentId: '',
      absenceType: 'VACATION' as AbsenceType,
      startDate: '',
      endDate: '',
      reason: '',
    },
  });

  const { data: agentsData } = useQuery({
    queryKey: ['users', 'agents'],
    queryFn: () => usersService.getAll({ role: 'AGENT', limit: 100 }),
  });

  const createAbsenceMutation = useMutation({
    mutationFn: (data: CreateAbsenceForm) => {
      console.log('Creating absence with data:', data);
      // Validate dates are in correct format
      if (!/^\d{4}-\d{2}-\d{2}$/.test(data.startDate)) {
        throw new Error('Start date must be in YYYY-MM-DD format');
      }
      if (!/^\d{4}-\d{2}-\d{2}$/.test(data.endDate)) {
        throw new Error('End date must be in YYYY-MM-DD format');
      }
      return absencesService.create(data as CreateAbsenceDto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['absences'] });
      toast.success(t('absences.createSuccess'));
      navigate('/absences');
    },
    onError: (error: any) => {
      console.error('Error creating absence:', error);
      const errorMsg = error.response?.data?.message || error.message || t('absences.createError');
      toast.error(errorMsg);
    },
  });

  const onSubmit = (data: CreateAbsenceForm) => {
    // Double check dates before submission
    console.log('Form data before submission:', data);
    createAbsenceMutation.mutate(data);
  };

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t('absences.create')}
        </h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          {t('absences.createSubtitle')}
        </p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                  label={t('absences.form.agent')}
                  options={agentOptions}
                  error={errors.agentId?.message}
                />
              </div>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Controller
              name="startDate"
              control={control}
              rules={{ required: 'Start date is required' }}
              render={({ field: { value, onChange, onBlur } }) => (
                <div>
                  <Input
                    type="date"
                    label={t('absences.form.startDate')}
                    value={value || ''}
                    onChange={onChange}
                    onBlur={onBlur}
                    error={errors.startDate?.message}
                  />
                </div>
              )}
            />
            <Controller
              name="endDate"
              control={control}
              rules={{ required: 'End date is required' }}
              render={({ field: { value, onChange, onBlur } }) => (
                <div>
                  <Input
                    type="date"
                    label={t('absences.form.endDate')}
                    value={value || ''}
                    onChange={onChange}
                    onBlur={onBlur}
                    error={errors.endDate?.message}
                  />
                </div>
              )}
            />
          </div>

          <Controller
            name="absenceType"
            control={control}
            rules={{ required: 'Type is required' }}
            render={({ field: { value, onChange, onBlur } }) => (
              <div>
                <Select
                  value={value || ''}
                  onChange={onChange}
                  onBlur={onBlur}
                  label={t('absences.form.type')}
                  options={typeOptions}
                  error={errors.absenceType?.message}
                />
              </div>
            )}
          />

          <Controller
            name="reason"
            control={control}
            render={({ field: { value, onChange, onBlur } }) => (
              <Input
                value={value || ''}
                onChange={onChange}
                onBlur={onBlur}
                label={t('absences.form.reason')}
                placeholder={t('absences.form.reasonPlaceholder')}
                error={errors.reason?.message}
              />
            )}
          />

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/absences')}
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
