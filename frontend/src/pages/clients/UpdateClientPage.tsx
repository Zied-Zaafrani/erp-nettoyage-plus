import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { clientsService } from '@/services';
import { Button, Card, Input, Select } from '@/components/ui';
import { toast } from 'sonner';
import { ArrowLeft, AlertCircle } from 'lucide-react';

const schema = yup.object().shape({
  name: yup.string().required('Client name is required').max(200),
  email: yup.string().email('Invalid email').optional().nullable(),
  phone: yup.string().optional().nullable(),
  address: yup.string().optional().nullable(),
  city: yup.string().optional().nullable(),
  postalCode: yup.string().optional().nullable(),
  country: yup.string().optional().nullable(),
  contactPerson: yup.string().optional().nullable(),
  contactPhone: yup.string().optional().nullable(),
  notes: yup.string().optional().nullable(),
  type: yup
    .string()
    .oneOf(['INDIVIDUAL', 'COMPANY', 'MULTISITE'])
    .required('Client type is required'),
  status: yup
    .string()
    .oneOf(['PROSPECT', 'ACTIVE', 'SUSPENDED', 'ARCHIVED'])
    .optional(),
});

type UpdateClientForm = yup.InferType<typeof schema>;

export default function UpdateClientPage() {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: clientData, isLoading, error } = useQuery({
    queryKey: ['client', id],
    queryFn: () => clientsService.getById(id!),
    enabled: !!id,
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<UpdateClientForm>({
    resolver: yupResolver(schema),
    defaultValues: {
      type: 'INDIVIDUAL',
      status: 'PROSPECT',
    },
  });

  // Update form when client data loads
  useEffect(() => {
    if (clientData) {
      reset({
        name: clientData.name || '',
        email: clientData.email || '',
        phone: clientData.phone || '',
        address: clientData.address || '',
        city: clientData.city || '',
        postalCode: clientData.postalCode || '',
        country: clientData.country || '',
        contactPerson: clientData.contactPerson || '',
        contactPhone: clientData.contactPhone || '',
        notes: clientData.notes || '',
        type: clientData.type || 'INDIVIDUAL',
        status: clientData.status || 'PROSPECT',
      });
    }
  }, [clientData, reset]);

  const updateClientMutation = useMutation({
    mutationFn: (data: UpdateClientForm) => clientsService.update(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      queryClient.invalidateQueries({ queryKey: ['client', id] });
      toast.success(t('clients.updateSuccess'));
      navigate(`/clients/${id}`);
    },
    onError: (error: any) => {
      toast.error(error.message || t('clients.updateError'));
    },
  });

  const onSubmit = (data: UpdateClientForm) => {
    updateClientMutation.mutate(data);
  };

  const clientTypeOptions = [
    { value: 'INDIVIDUAL', label: t('clients.type.individual') },
    { value: 'COMPANY', label: t('clients.type.company') },
    { value: 'MULTISITE', label: t('clients.type.multisite') },
  ];

  const clientStatusOptions = [
    { value: 'PROSPECT', label: t('clients.status.prospect') },
    { value: 'ACTIVE', label: t('clients.status.active') },
    { value: 'SUSPENDED', label: t('clients.status.suspended') },
    { value: 'ARCHIVED', label: t('clients.status.archived') },
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

  if (!clientData) {
    return (
      <Card className="p-8 text-center">
        <AlertCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <div className="text-gray-600">{t('clients.notFound')}</div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(`/clients/${id}`)}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('clients.edit')}</h1>
          <p className="mt-1 text-gray-600">{clientData.name}</p>
        </div>
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

            {/* Client Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700">{t('common.status')}</label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    options={clientStatusOptions}
                  />
                )}
              />
              {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>}
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

            {/* Contact Person */}
            <div>
              <label className="block text-sm font-medium text-gray-700">{t('clients.form.contactPerson')}</label>
              <Controller
                name="contactPerson"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder={t('clients.form.contactPersonPlaceholder')} />
                )}
              />
            </div>

            {/* Contact Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700">{t('clients.form.contactPhone')}</label>
              <Controller
                name="contactPhone"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder={t('clients.form.contactPhonePlaceholder')} />
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

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700">{t('common.notes')}</label>
            <Controller
              name="notes"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  placeholder={t('common.notesPlaceholder')}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}
            />
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-6 border-t">
            <Button
              type="submit"
              disabled={isSubmitting || !isDirty || updateClientMutation.isPending}
            >
              {updateClientMutation.isPending ? t('common.saving') : t('common.save')}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(`/clients/${id}`)}
            >
              {t('common.cancel')}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
