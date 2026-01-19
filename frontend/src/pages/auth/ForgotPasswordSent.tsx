import { useTranslation } from 'react-i18next';
import { CheckCircle2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ForgotPasswordSent() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950 px-6">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl p-6 text-center">
        <div className="flex items-center justify-center mb-3">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{t('auth.forgotSentTitle')}</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">{t('auth.forgotSentSubtitle')}</p>
        <Link
          to="/login"
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 text-sm hover:from-blue-700 hover:to-indigo-700"
        >
          {isRTL ? null : <ArrowLeft size={16} />}
          <span>{t('auth.backToLogin')}</span>
          {isRTL ? <ArrowLeft size={16} className="scale-x-[-1]" /> : null}
        </Link>
      </div>
    </div>
  );
}
