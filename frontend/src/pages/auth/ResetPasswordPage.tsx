import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Lock, ArrowRight, CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Button, Input } from '@/components/ui';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useTheme } from '@/contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { authService } from '@/services';

const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, 'validation.passwordMin')
      .regex(/(?=.*[a-z])/, 'validation.passwordLower')
      .regex(/(?=.*[A-Z])/, 'validation.passwordUpper')
      .regex(/(?=.*\d)/, 'validation.passwordNumber'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'validation.passwordMatch',
    path: ['confirmPassword'],
  });

type ResetPasswordData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { theme, toggleTheme } = useTheme();
  const token = searchParams.get('token');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const newPassword = watch('newPassword');

  const onSubmit = async (data: ResetPasswordData) => {
    if (!token) {
      toast.error(t('errors.invalidToken') || 'Invalid or missing reset token');
      return;
    }

    setIsSubmitting(true);
    try {
      await authService.resetPassword(token, data.newPassword);
      setIsSuccess(true);
      toast.success(t('auth.passwordResetSuccess') || 'Password reset successfully');
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || t('errors.generic') || 'Failed to reset password';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="flex h-screen w-full overflow-hidden bg-gray-50 dark:bg-gray-950">
        <div className="w-full flex flex-col h-full overflow-y-auto">
          <div className="flex-1 flex flex-col px-6 py-6 sm:px-12 lg:px-16 items-center justify-center">
            <div className="text-center max-w-md">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900 mx-auto mb-4">
                <Lock className="w-8 h-8 text-red-600 dark:text-red-300" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {t('errors.invalidToken') || 'Invalid Token'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {t('errors.tokenExpired') || 'The reset link is invalid or has expired'}
              </p>
              <Button
                onClick={() => navigate('/forgot-password')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {t('auth.requestNewLink') || 'Request New Link'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="flex h-screen w-full overflow-hidden bg-gray-50 dark:bg-gray-950">
        <div className="hidden lg:flex lg:w-1/2 flex-col bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-400/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-400/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
          </div>

          <div className="relative z-10 flex flex-col h-full p-8 justify-center items-center">
            <div className="text-center max-w-md">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-xl border border-white/25 shadow-lg mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-3 leading-tight">
                {t('auth.passwordResetSuccess') || 'Password Reset Successful'}
              </h2>
              <p className="text-blue-100/80 text-sm leading-relaxed">
                {t('auth.redirectingToLogin') ||
                  'You will be redirected to login page shortly...'}
              </p>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex flex-col h-full overflow-y-auto">
          <div className="flex-1 flex flex-col px-6 py-6 sm:px-12 lg:px-16 items-center justify-center">
            <div className="text-center max-w-md">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900 mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-300" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {t('auth.passwordResetSuccess') || 'Password Reset Successful!'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {t('auth.redirectingToLogin') ||
                  'Redirecting to login page...'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-3 leading-tight">
              {t('auth.resetPasswordTitle') || 'Reset Your Password'}
            </h2>
            <p className="text-blue-100/80 text-sm leading-relaxed">
              {t('auth.resetPasswordDescription') ||
                'Enter a new password to secure your account'}
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
              <span className="text-lg font-bold text-gray-900 dark:text-white">
                NettoyagePlus
              </span>
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

          {/* Form Container */}
          <div className="flex-1 flex items-center justify-center">
            <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-sm">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {t('auth.resetPassword') || 'Reset Password'}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {t('auth.enterNewPassword') ||
                    'Enter your new password below'}
                </p>
              </div>

              {/* New Password Field */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('auth.newPassword') || 'New Password'}
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...register('newPassword')}
                  className={`w-full ${
                    errors.newPassword
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : ''
                  }`}
                  disabled={isSubmitting}
                />
                {errors.newPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {t(errors.newPassword.message as string) ||
                      errors.newPassword.message}
                  </p>
                )}
              </div>

              {/* Password Requirements */}
              {newPassword && (
                <div className="mb-5 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                  <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {t('auth.passwordRequirements') || 'Password requirements:'}
                  </p>
                  <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    <li
                      className={
                        newPassword.length >= 8
                          ? 'text-green-600 dark:text-green-400'
                          : ''
                      }
                    >
                      ✓ {t('validation.passwordMin') ||
                        'At least 8 characters'}
                    </li>
                    <li
                      className={
                        /[A-Z]/.test(newPassword)
                          ? 'text-green-600 dark:text-green-400'
                          : ''
                      }
                    >
                      ✓ {t('validation.passwordUpper') ||
                        'One uppercase letter'}
                    </li>
                    <li
                      className={
                        /[a-z]/.test(newPassword)
                          ? 'text-green-600 dark:text-green-400'
                          : ''
                      }
                    >
                      ✓ {t('validation.passwordLower') ||
                        'One lowercase letter'}
                    </li>
                    <li
                      className={
                        /\d/.test(newPassword)
                          ? 'text-green-600 dark:text-green-400'
                          : ''
                      }
                    >
                      ✓ {t('validation.passwordNumber') || 'One number'}
                    </li>
                  </ul>
                </div>
              )}

              {/* Confirm Password Field */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('auth.confirmPassword') || 'Confirm Password'}
                </label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...register('confirmPassword')}
                  className={`w-full ${
                    errors.confirmPassword
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                      : ''
                  }`}
                  disabled={isSubmitting}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {t(errors.confirmPassword.message as string) ||
                      errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2.5 rounded-lg transition flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    {t('common.processing') || 'Processing...'}
                  </>
                ) : (
                  <>
                    {t('auth.resetPasswordButton') || 'Reset Password'}
                    <ArrowRight size={16} />
                  </>
                )}
              </Button>

              {/* Back to Login Link */}
              <div className="mt-6 text-center">
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {t('auth.rememberPassword') || 'Remember your password?'}{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="text-blue-600 hover:text-blue-700 font-medium transition"
                  >
                    {t('auth.loginHere') || 'Login here'}
                  </button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
