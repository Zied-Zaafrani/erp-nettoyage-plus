import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Button, Input } from '@/components/ui';
import LanguageSwitcher from '@/components/LanguageSwitcher';

// ============================================
// VALIDATION SCHEMA
// ============================================

const loginSchema = z.object({
  email: z.string().email('validation.email'),
  password: z.string().min(1, 'validation.required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

// ============================================
// LOGIN PAGE
// ============================================

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      await login(data);
      toast.success(t('auth.loginSuccess'));
      navigate('/dashboard');
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'message' in error 
        ? (error as { message: string }).message 
        : t('auth.loginError');
      toast.error(errorMessage);
    }
  };

  return (
    <div className="space-y-6">
      {/* Language Switcher */}
      <div className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'}`}>
        <LanguageSwitcher />
      </div>

      {/* Header */}
      <div className="text-center lg:text-left">
        <div className="mb-4 flex items-center justify-center gap-2 lg:hidden">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600">
            <span className="text-xl text-white">🧹</span>
          </div>
          <span className="text-xl font-bold text-gray-900">{t('common.appName')}</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">{t('auth.loginTitle')}</h1>
        <p className="mt-2 text-sm text-gray-600">
          {t('auth.loginSubtitle')}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          label={t('auth.email')}
          type="email"
          placeholder={t('auth.email')}
          leftIcon={<Mail size={18} />}
          error={errors.email?.message ? t(errors.email.message) : undefined}
          {...register('email')}
        />

        <div>
          <Input
            label={t('auth.password')}
            type={showPassword ? 'text' : 'password'}
            placeholder={t('auth.password')}
            leftIcon={<Lock size={18} />}
            rightIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
            error={errors.password?.message ? t(errors.password.message) : undefined}
            {...register('password')}
          />
          <div className="mt-2 flex justify-end">
            <button
              type="button"
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              {t('auth.forgotPassword')}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          isLoading={isLoading}
        >
          {isLoading ? t('auth.loggingIn') : t('auth.loginButton')}
        </Button>
      </form>

      {/* Demo credentials hint */}
      <div className="rounded-lg bg-gray-50 p-4">
        <p className="text-xs text-gray-500">
          <strong>Demo:</strong> admin@nettoyageplus.com / Admin123!
        </p>
      </div>
    </div>
  );
}
