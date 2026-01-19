import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, ArrowLeft, ArrowRight } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Button, Input } from '@/components/ui';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { authService } from '@/services';

const forgotPasswordSchema = z.object({
  email: z.string().email('validation.email'),
});

type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { theme, toggleTheme } = useTheme();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordData) => {
    setIsSubmitting(true);
    try {
      await authService.forgotPassword(data.email);
      // Navigate to confirmation page on success
      navigate('/forgot-password/sent');
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || t('errors.generic');
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* Left Panel - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 flex-col bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-400/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-400/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col h-full p-8 justify-center items-center">
          <div className="text-center max-w-md">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-xl border border-white/25 shadow-lg mx-auto mb-6">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-3 leading-tight">
              {t('auth.forgotPasswordTitle')}
            </h2>
            <p className="text-blue-100/80 text-sm leading-relaxed">
              {t('auth.forgotPasswordDescription')}
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex flex-col h-full overflow-y-auto">
        <div className="flex-1 flex flex-col px-6 py-6 sm:px-12 lg:px-16">
          {/* Top Bar */}
          <div className="flex items-center justify-between shrink-0">
            <div className="flex lg:hidden items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600">
                <span className="text-lg text-white">🧹</span>
              </div>
              <span className="text-lg font-bold text-gray-900 dark:text-white">NettoyagePlus</span>
            </div>
            <div className={`flex items-center gap-2 ${isRTL ? 'mr-auto' : 'ml-auto'}`}>
              <button
                type="button"
                aria-label="Toggle theme"
                onClick={toggleTheme}
                className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              </button>
              <LanguageSwitcher />
            </div>
          </div>

          {/* Main Content - Centered */}
          <div className="flex-1 flex items-center justify-center py-6">
            <div className="w-full max-w-sm">
              {/* Header */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('auth.forgotPasswordTitle')}</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{t('auth.forgotPasswordSubtitle')}</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Input
                  label={t('auth.email')}
                  type="email"
                  placeholder={t('auth.email')}
                  leftIcon={<Mail size={16} />}
                  error={errors.email?.message ? t(errors.email.message) : undefined}
                  {...register('email')}
                />

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-lg shadow-blue-500/25 dark:shadow-blue-900/30"
                  size="lg"
                  isLoading={isSubmitting}
                >
                  {isSubmitting ? (
                    t('auth.sendingResetLink')
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      {t('auth.sendResetLink')}
                      <ArrowRight size={16} />
                    </span>
                  )}
                </Button>
              </form>

              {/* Back to Login */}
              <div className="mt-6 text-center">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                >
                  {isRTL ? null : <ArrowLeft size={14} />}
                  <span>{t('auth.backToLogin')}</span>
                  {isRTL ? <ArrowLeft size={14} className="scale-x-[-1]" /> : null}
                </Link>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-xs text-gray-400 dark:text-gray-600 shrink-0">
            © 2026 NettoyagePlus. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}
