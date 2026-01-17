import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { clientsService } from '@/services';
import { Button, Card, Input, Select } from '@/components/ui';
import { toast } from 'sonner';

const schema = yup.object().shape({
  name: yup.string().required('Client name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().optional(),
  address: yup.string().optional(),
  city: yup.string().optional(),
  postalCode: yup.string().optional(),
  country: yup.string().optional(),
  type: yup
    .string()
    .oneOf(['INDIVIDUAL', 'COMPANY', 'MULTI_SITE'])
    .required('Client type is required'),
});

type CreateClientForm = yup.InferType<typeof schema>;

export default function CreateClientPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateClientForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      type: 'INDIVIDUAL',
    },
  });

  const createClientMutation = useMutation({
    mutationFn: (data: CreateClientForm) => clientsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast.success(t('clients.createSuccess'));
      navigate('/clients');
    },
    onError: (error) => {
      toast.error(error.message || t('clients.createError'));
    },
  });

  const onSubmit = (data: CreateClientForm) => {
    createClientMutation.mutate(data);
  };

  const clientTypeOptions = [
    { value: 'INDIVIDUAL', label: t('clients.type.individual') },
    { value: 'COMPANY', label: t('clients.type.company') },
    { value: 'MULTI_SITE', label: t('clients.type.multisite') },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('clients.create')}</h1>
        <p className="mt-1 text-gray-600">{t('clients.createSubtitle')}</p>
      </div>

      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Client Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">{t('clients.form.name')}</label>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder={t('clients.form.namePlaceholder')} />
                )}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            {/* Client Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700">{t('clients.form.type')}</label>
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={clientTypeOptions}
                  />
                )}
              />
               {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">{t('clients.form.email')}</label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input {...field} type="email" placeholder={t('clients.form.emailPlaceholder')} />
                )}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700">{t('clients.form.phone')}</label>
              <Controller
                name="phone"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder={t('clients.form.phonePlaceholder')} />
                )}
              />
            </div>
          </div>

          {/* Address */}
          <div>
              <label className="block text-sm font-medium text-gray-700">{t('clients.form.address')}</label>
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder={t('clients.form.addressPlaceholder')} />
                )}
              />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700">{t('clients.form.city')}</label>
              <Controller
                name="city"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder={t('clients.form.cityPlaceholder')} />
                )}
              />
            </div>

             {/* Postal Code */}
             <div>
              <label className="block text-sm font-medium text-gray-700">{t('clients.form.postalCode')}</label>
              <Controller
                name="postalCode"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder={t('clients.form.postalCodePlaceholder')} />
                )}
              />
            </div>

             {/* Country */}
             <div>
              <label className="block text-sm font-medium text-gray-700">{t('clients.form.country')}</label>
              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder={t('clients.form.countryPlaceholder')} />
                )}
              />
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => navigate('/clients')}>
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
