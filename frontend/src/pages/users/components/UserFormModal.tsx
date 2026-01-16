import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { Modal, Button, Input } from '@/components/ui';
import { usersService } from '@/services';
import { User, UserRole, CreateUserDto, UpdateUserDto } from '@/types';
import { ROLE_KEYS } from '@/contexts/AuthContext';

// ============================================
// VALIDATION SCHEMAS
// ============================================

const createUserSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  role: z.enum(['SUPER_ADMIN', 'SUPERVISOR', 'AGENT', 'CLIENT']),
});

const updateUserSchema = z.object({
  email: z.string().email('Please enter a valid email').optional(),
  firstName: z.string().min(1, 'First name is required').optional(),
  lastName: z.string().min(1, 'Last name is required').optional(),
  phone: z.string().optional(),
  role: z.enum(['SUPER_ADMIN', 'SUPERVISOR', 'AGENT', 'CLIENT']).optional(),
  status: z.enum(['ACTIVE', 'SUSPENDED', 'ARCHIVED']).optional(),
});

type CreateUserFormData = z.infer<typeof createUserSchema>;
type UpdateUserFormData = z.infer<typeof updateUserSchema>;

// ============================================
// USER FORM MODAL
// ============================================

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user: User | null;
}

export default function UserFormModal({
  isOpen,
  onClose,
  onSuccess,
  user,
}: UserFormModalProps) {
  const isEditing = !!user;
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUserFormData | UpdateUserFormData>({
    resolver: zodResolver(isEditing ? updateUserSchema : createUserSchema),
    defaultValues: isEditing
      ? {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone || '',
          role: user.role,
          status: user.status,
        }
      : {
          email: '',
          password: '',
          firstName: '',
          lastName: '',
          phone: '',
          role: 'AGENT' as UserRole,
        },
  });

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateUserDto) => usersService.create(data),
    onSuccess: () => {
      toast.success(t('users.createSuccess'));
      reset();
      onSuccess();
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || t('common.error'));
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserDto }) =>
      usersService.update(id, data),
    onSuccess: () => {
      toast.success(t('users.updateSuccess'));
      onSuccess();
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || t('common.error'));
    },
  });

  const onSubmit = (data: CreateUserFormData | UpdateUserFormData) => {
    if (isEditing) {
      updateMutation.mutate({ id: user.id, data: data as UpdateUserDto });
    } else {
      createMutation.mutate(data as CreateUserDto);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditing ? t('users.editUser') : t('users.addUser')}
      description={
        isEditing
          ? t('users.subtitle')
          : t('users.subtitle')
      }
      footer={
        <>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            isLoading={isLoading}
          >
            {isEditing ? t('common.save') : t('users.addUser')}
          </Button>
        </>
      }
    >
      <form className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label={t('users.firstName')}
            placeholder={t('users.firstName')}
            error={(errors as Record<string, { message?: string }>).firstName?.message}
            {...register('firstName')}
            required
          />
          <Input
            label={t('users.lastName')}
            placeholder={t('users.lastName')}
            error={(errors as Record<string, { message?: string }>).lastName?.message}
            {...register('lastName')}
            required
          />
        </div>

        <Input
          label={t('auth.email')}
          type="email"
          placeholder={t('auth.email')}
          error={(errors as Record<string, { message?: string }>).email?.message}
          {...register('email')}
          required
        />

        {!isEditing && (
          <Input
            label={t('auth.password')}
            type="password"
            placeholder={t('auth.password')}
            error={(errors as Record<string, { message?: string }>).password?.message}
            {...register('password')}
            required
          />
        )}

        <Input
          label={t('users.phone')}
          type="tel"
          placeholder={t('users.phone')}
          error={(errors as Record<string, { message?: string }>).phone?.message}
          {...register('phone')}
        />

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            {t('users.role')} <span className="text-danger-500">*</span>
          </label>
          <select
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            {...register('role')}
          >
            {Object.entries(ROLE_KEYS).map(([value, translationKey]) => (
              <option key={value} value={value}>
                {t(translationKey)}
              </option>
            ))}
          </select>
          {(errors as Record<string, { message?: string }>).role && (
            <p className="mt-1 text-xs text-danger-600">
              {(errors as Record<string, { message?: string }>).role?.message}
            </p>
          )}
        </div>

        {isEditing && (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
              {t('users.status')}
            </label>
            <select
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              {...register('status')}
            >
              <option value="ACTIVE">{t('common.active')}</option>
              <option value="SUSPENDED">{t('common.suspended')}</option>
              <option value="ARCHIVED">{t('common.archived')}</option>
            </select>
          </div>
        )}
      </form>
    </Modal>
  );
}
