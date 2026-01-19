import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, Shield, Users, Clock, Sun, Moon, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Button, Input } from '@/components/ui';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useTheme } from '@/contexts/ThemeContext';

// ============================================
// SCHEMA & TYPES
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
  gradient: string;
  icon: string;
}

const DEMO_CREDENTIALS: DemoCredentials[] = [
  { role: 'Admin', email: 'admin@nettoyageplus.com', password: 'Admin123!', gradient: 'from-violet-500 to-purple-600', icon: '👑' },
  { role: 'Agent', email: 'agent@nettoyageplus.com', password: 'Agent123!', gradient: 'from-blue-500 to-cyan-500', icon: '🧹' },
  { role: 'Client', email: 'client@nettoyageplus.com', password: 'Client123!', gradient: 'from-emerald-500 to-teal-500', icon: '🏢' },
  { role: 'Supervisor', email: 'supervisor@nettoyageplus.com', password: 'Supervisor123!', gradient: 'from-amber-500 to-orange-500', icon: '📋' },
];

// ============================================
// ANIMATED ILLUSTRATION COMPONENT
// ============================================

const CleaningIllustration = () => (
  <div className="relative w-full max-w-xs mx-auto">
    {/* Floating cards animation */}
    <div className="relative h-48">
      {/* Main central card */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-20 bg-white/20 backdrop-blur-lg rounded-2xl border border-white/30 shadow-2xl flex items-center justify-center animate-float">
        <div className="text-center">
          <Sparkles className="w-8 h-8 text-white mx-auto mb-1" />
          <span className="text-white/90 text-xs font-medium">Dashboard</span>
        </div>
      </div>
      
      {/* Floating mini cards */}
      <div className="absolute left-4 top-4 w-16 h-16 bg-white/15 backdrop-blur-md rounded-xl border border-white/20 flex items-center justify-center animate-float-delayed">
        <Shield className="w-6 h-6 text-white/80" />
      </div>
      
      <div className="absolute right-4 top-8 w-14 h-14 bg-white/15 backdrop-blur-md rounded-xl border border-white/20 flex items-center justify-center animate-float-slow">
        <Users className="w-5 h-5 text-white/80" />
      </div>
      
      <div className="absolute left-8 bottom-4 w-14 h-14 bg-white/15 backdrop-blur-md rounded-xl border border-white/20 flex items-center justify-center animate-float-slow">
        <Clock className="w-5 h-5 text-white/80" />
      </div>
      
      <div className="absolute right-8 bottom-8 w-12 h-12 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 flex items-center justify-center animate-float-delayed">
        <span className="text-lg">✨</span>
      </div>

      {/* Glowing orbs */}
      <div className="absolute left-1/4 top-1/4 w-3 h-3 bg-cyan-400 rounded-full blur-sm animate-pulse" />
      <div className="absolute right-1/3 bottom-1/3 w-2 h-2 bg-purple-400 rounded-full blur-sm animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute left-1/3 bottom-1/4 w-2 h-2 bg-blue-300 rounded-full blur-sm animate-pulse" style={{ animationDelay: '0.5s' }} />
    </div>
  </div>
);

// ============================================
// FEATURE BADGE COMPONENT
// ============================================

const FeatureBadge = ({ icon, text }: { icon: React.ReactNode; text: string }) => (
  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/20">
    <span className="text-white/90">{icon}</span>
    <span className="text-white/90 text-xs font-medium">{text}</span>
  </div>
);

// ============================================
// LEFT PANEL COMPONENT
// ============================================

const LeftPanel = ({ t }: { t: (key: string) => string }) => (
  <div className="hidden lg:flex lg:w-1/2 flex-col bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 dark:from-slate-900 dark:via-blue-950 dark:to-indigo-950 relative overflow-hidden">
    {/* Background decorations */}
    <div className="absolute inset-0">
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-violet-400/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-400/10 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2" />
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />
    </div>

    {/* Content */}
    <div className="relative z-10 flex flex-col h-full p-8 justify-between">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur-xl border border-white/25 shadow-lg">
          <span className="text-xl">🧹</span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">NettoyagePlus</h1>
          <p className="text-xs text-blue-200/80">{t('auth.managementPlatform')}</p>
        </div>
      </div>

      {/* Center content */}
      <div className="flex-1 flex flex-col items-center justify-center -mt-8">
        {/* Illustration */}
        <CleaningIllustration />
        
        {/* Tagline */}
        <div className="text-center mt-6 max-w-sm">
          <h2 className="text-2xl font-bold text-white mb-2 leading-tight">
            {t('auth.platformHeadline')}
          </h2>
          <p className="text-blue-100/80 text-sm leading-relaxed">
            {t('auth.platformDescription')}
          </p>
        </div>

        {/* Feature badges */}
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          <FeatureBadge icon={<Shield className="w-3.5 h-3.5" />} text={t('auth.featureSecure')} />
          <FeatureBadge icon={<Users className="w-3.5 h-3.5" />} text={t('auth.featureTeam')} />
          <FeatureBadge icon={<Clock className="w-3.5 h-3.5" />} text={t('auth.featureRealtime')} />
        </div>
      </div>

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
  const { theme, toggleTheme } = useTheme();

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = useCallback(async (data: LoginFormData) => {
    try {
      await login(data);
      toast.success(t('auth.loginSuccess'));
      navigate('/dashboard');
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'message' in error
        ? (error as { message: string }).message
        : t('auth.loginError');
      toast.error(errorMessage);
    } finally {
      setDemoLoading(null);
    }
  }, [login, navigate, t]);

  const handleDemoLogin = useCallback(async (credentials: DemoCredentials) => {
    setDemoLoading(credentials.role);
    try {
      setValue('email', credentials.email);
      setValue('password', credentials.password);
      await new Promise((resolve) => setTimeout(resolve, 400));
      await login({ email: credentials.email, password: credentials.password });
      toast.success(t('auth.demoLoginSuccess', { role: credentials.role }));
      navigate('/dashboard');
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'message' in error
        ? (error as { message: string }).message
        : t('auth.loginError');
      toast.error(errorMessage);
    } finally {
      setDemoLoading(null);
    }
  }, [login, navigate, setValue, t]);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* LEFT PANEL */}
      <LeftPanel t={t} />

      {/* RIGHT PANEL - LOGIN FORM */}
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
              {/* Theme toggle */}
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
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('auth.loginTitle')}</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{t('auth.loginSubtitle')}</p>
              </div>

              {/* Login Form */}
              <form
                onSubmit={handleSubmit(onSubmit, (errs) => {
                  const issues = Object.values(errs).map((e) =>
                    typeof e?.message === 'string' ? t(e.message) : t('validation.required')
                  );
                  const id = toast.custom((tItem) => (
                    <div className={`max-w-sm w-full bg-white dark:bg-gray-900 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg shadow-lg p-3 ${tItem.visible ? 'animate-fade-in' : 'animate-fade-out'} animate-shake`}>
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-5 h-5 mt-0.5" />
                        <div>
                          <p className="font-semibold text-sm mb-1">{t('validation.required')}</p>
                          <ul className="list-disc pl-4 text-xs space-y-0.5">
                            {issues.slice(0, 3).map((m, i) => (
                              <li key={i}>{m}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ));
                  setTimeout(() => toast.dismiss(id), 3000);
                })}
                className="space-y-4"
              >
                <Input
                  label={t('auth.email')}
                  type="email"
                  placeholder={t('auth.email')}
                  leftIcon={<Mail size={16} />}
                  error={errors.email?.message ? t(errors.email.message) : undefined}
                  {...register('email')}
                />

                <div>
                  <Input
                    label={t('auth.password')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('auth.password')}
                    leftIcon={<Lock size={16} />}
                    rightIcon={
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    }
                    error={errors.password?.message ? t(errors.password.message) : undefined}
                    {...register('password')}
                  />
                  <div className="mt-1.5 flex justify-end">
                    <Link to="/forgot-password" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">{t('auth.forgotPassword')}</Link>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-lg shadow-blue-500/25 dark:shadow-blue-900/30"
                  size="lg"
                  isLoading={isLoading && !demoLoading}
                >
                  {isLoading && !demoLoading ? t('auth.loggingIn') : (
                    <span className="flex items-center justify-center gap-2">
                      {t('auth.loginButton')}
                      <ArrowRight size={16} />
                    </span>
                  )}
                </Button>
              </form>

              {/* Demo Section */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-3 text-center">{t('auth.demoAccounts')}</p>
                <div className="grid grid-cols-2 gap-2">
                  {DEMO_CREDENTIALS.map((cred) => (
                    <button
                      key={cred.role}
                      onClick={() => handleDemoLogin(cred)}
                      disabled={isLoading || demoLoading !== null}
                      className={`
                        group relative py-2.5 px-3 rounded-lg font-medium text-white text-sm
                        bg-gradient-to-r ${cred.gradient} 
                        hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]
                        transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                        ${demoLoading === cred.role ? 'animate-pulse' : ''}
                      `}
                    >
                      <span className="grid grid-cols-[1.25rem_1fr_1.25rem] items-center w-full">
                        <span className="justify-self-start">{cred.icon}</span>
                        <span className="justify-self-center">{t(`auth.demo${cred.role}`)}</span>
                        <span className="justify-self-end opacity-0 group-hover:opacity-100 transition-opacity">
                          {demoLoading !== cred.role && <ArrowRight size={12} />}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
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
