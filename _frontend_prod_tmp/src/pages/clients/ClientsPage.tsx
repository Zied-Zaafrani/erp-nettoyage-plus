import { Building2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui';

export default function ClientsPage() {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="page-title">{t('clients.title')}</h1>
          <p className="page-subtitle">{t('clients.subtitle')}</p>
        </div>
      </div>
      
      <Card className="flex flex-col items-center justify-center py-12">
        <Building2 className="h-16 w-16 text-gray-300" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">{t('clients.title')}</h3>
        <p className="mt-1 text-sm text-gray-500">
          {t('common.noData')}
        </p>
      </Card>
    </div>
  );
}
