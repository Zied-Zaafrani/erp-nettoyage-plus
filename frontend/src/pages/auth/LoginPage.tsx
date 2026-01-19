import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import Lottie from 'lottie-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Button, Input } from '@/components/ui';
import LanguageSwitcher from '@/components/LanguageSwitcher';

// ============================================
// TYPES & CONSTANTS
// ============================================

const loginSchema = z.object({
  email: z.string().email('validation.email'),
  password: z.string().min(1, 'validation.required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface DemoCredentials {
  role: 'Admin' | 'Agent' | 'Client' | 'Supervisor';
  email: string;
  password: string;
  color: string;
}

const DEMO_CREDENTIALS: DemoCredentials[] = [
  {
    role: 'Admin',
    email: 'admin@nettoyageplus.com',
    password: 'Admin123!',
    color: 'bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-800',
  },
  {
    role: 'Agent',
    email: 'agent@nettoyageplus.com',
    password: 'Agent123!',
    color: 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800',
  },
  {
    role: 'Client',
    email: 'client@nettoyageplus.com',
    password: 'Client123!',
    color: 'bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800',
  },
  {
    role: 'Supervisor',
    email: 'supervisor@nettoyageplus.com',
    password: 'Supervisor123!',
    color: 'bg-orange-600 hover:bg-orange-700 dark:bg-orange-700 dark:hover:bg-orange-800',
  },
];

// ============================================
// PLACEHOLDER ANIMATION (will be replaced with real Lottie)
// ============================================

const CleaningAnimation = () => (
  <div className="relative w-full h-full flex items-center justify-center">
    <div className="text-center">
      {/* Animated cleaning icon */}
      <div className="mb-8 inline-block">
        <div className="relative w-32 h-32">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full opacity-20 animate-pulse" />
          <div className="absolute inset-4 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full opacity-10 animate-pulse animation-delay-100" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl animate-bounce">🧹</span>
          </div>
        </div>
      </div>
      <p className="text-sm text-gray-400 dark:text-gray-500">Professional Cleaning Management</p>
    </div>
  </div>
);

// ============================================
// LOGIN PAGE COMPONENT
// ============================================

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [demoLoading, setDemoLoading] = useState<string | null>(null);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // ============================================
  // HANDLERS
  // ============================================

  const onSubmit = useCallback(async (data: LoginFormData) => {
    try {
      await login(data);
      toast.success(t('auth.loginSuccess'));
      navigate('/dashboard');
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === 'object' && 'message' in error
          ? (error as { message: string }).message
          : t('auth.loginError');
      toast.error(errorMessage);
    } finally {
      setDemoLoading(null);
    }
  }, [login, navigate, t]);

  const handleDemoLogin = useCallback(
    async (credentials: DemoCredentials) => {
      setDemoLoading(credentials.role);
      try {
        // Auto-fill the form
        setValue('email', credentials.email);
        setValue('password', credentials.password);

        // Small delay for UX feedback
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Auto-submit
        await login({
          email: credentials.email,
          password: credentials.password,
        });

        toast.success(t('auth.demoLoginSuccess', { role: credentials.role }));
        navigate('/dashboard');
      } catch (error: unknown) {
        const errorMessage =
          error && typeof error === 'object' && 'message' in error
            ? (error as { message: string }).message
            : t('auth.loginError');
        toast.error(errorMessage);
      } finally {
        setDemoLoading(null);
      }
    },
    [login, navigate, setValue, t]
  );

  return (
    <div className="flex min-h-screen w-full bg-white dark:bg-gray-950">
      {/* ========================================
          LEFT PANEL - ANIMATION & HEADLINE
          ======================================== */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 dark:from-blue-900 dark:via-blue-800 dark:to-blue-900 p-12 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />

        <div className="relative z-10 flex flex-col justify-between h-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md border border-white/30">
              <span className="text-2xl">🧹</span>
            </div>
            <span className="text-2xl font-bold text-white">NettoyagePlus</span>
          </div>

          {/* Animation */}
          <div className="flex-1 flex items-center justify-center">
            <CleaningAnimation />
          </div>

          {/* Headline */}
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-white leading-tight">
              {t('auth.platformHeadline')}
            </h1>
            <p className="text-lg text-blue-100">
              {t('auth.platformDescription')}
            </p>
          </div>
        </div>
      </div>

      {/* ========================================
          RIGHT PANEL - LOGIN FORM
          ======================================== */}
      <div className="w-full lg:w-1/2 flex flex-col justify-between p-8 lg:p-12">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-8">
          {/* Logo on mobile */}
          <div className="flex lg:hidden items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 dark:bg-blue-700">
              <span className="text-xl text-white">🧹</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              {t('common.appName')}
            </span>
          </div>

          {/* Language Switcher */}
          <div className={`${isRTL ? 'mr-auto' : 'ml-auto'}`}>
            <LanguageSwitcher />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {t('auth.loginTitle')}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {t('auth.loginSubtitle')}
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mb-8">
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
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
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
                  className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  {t('auth.forgotPassword')}
                </button>
              </div>
            </div>

            {/* Sign In Button - Blue Gradient */}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-700 dark:to-blue-800 dark:hover:from-blue-800 dark:hover:to-blue-900 text-white font-semibold transition-all duration-300"
              size="lg"
              isLoading={isLoading && !demoLoading}
            >
              {isLoading && !demoLoading ? (
                <>
                  <span className="inline-block mr-2">⏳</span>
                  {t('auth.loggingIn')}
                </>
              ) : (
                <>
                  {t('auth.loginButton')}
                  <ArrowRight size={18} className="ml-2 inline-block" />
                </>
              )}
            </Button>
          </form>

          {/* Demo Accounts Section */}
          <div className="pt-8 border-t border-gray-200 dark:border-gray-700">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
              {t('auth.demoAccounts')}
            </p>

            {/* 2x2 Grid Demo Buttons */}
            <div className="grid grid-cols-2 gap-3">
              {DEMO_CREDENTIALS.map((cred) => (
                <button
                  key={cred.role}
                  onClick={() => handleDemoLogin(cred)}
                  disabled={isLoading || demoLoading !== null}
                  className={`
                    relative p-3 rounded-lg font-semibold text-white 
                    transition-all duration-300 transform hover:scale-105 
                    disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none
                    ${cred.color}
                    ${demoLoading === cred.role ? 'ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-950 opacity-80' : ''}
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-950
                  `}
                >
                  {demoLoading === cred.role ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="inline-block animate-spin">⏳</span>
                      <span className="text-xs">{t('auth.demologgingInAs', { role: cred.role })}</span>
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2 text-sm">
                      <span>{t(`auth.demo${cred.role}`)}</span>
                      <ArrowRight size={14} />
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Demo Info */}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
              💡 {t('auth.demoAccounts')}: Click any button above to log in with demo credentials
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-400 dark:text-gray-500 mt-8">
          <p>© 2026 NettoyagePlus. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
