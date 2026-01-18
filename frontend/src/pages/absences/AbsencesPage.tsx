import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { absencesService } from '@/services';
import { Card, Button } from '@/components/ui';
import { useNavigate } from 'react-router-dom';

export default function AbsencesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['absences'],
    queryFn: () => absencesService.getAll({ limit: 100 }),
  });

  return (
    <div className="space-y-6">
      <div className="page-header flex justify-between items-center">
        <div>
          <h1 className="page-title">{t('absences.title')}</h1>
          <p className="page-subtitle">{t('absences.subtitle')}</p>
        </div>
        <Button onClick={() => navigate('/absences/create')}>
          {t('absences.create')}
        </Button>
      </div>

      {isLoading ? (
        <Card className="p-6 text-center">{t('common.loading')}</Card>
      ) : isError ? (
        <Card className="p-6 text-center text-red-500">{t('common.error')}</Card>
      ) : !data?.data?.length ? (
        <Card className="flex flex-col items-center justify-center py-12">
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">{t('absences.title')}</h3>
          <p className="mt-1 text-sm text-gray-500">{t('common.noData')}</p>
        </Card>
      ) : (
        <Card className="p-0">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('absences.table.agent')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('absences.table.date')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('absences.table.type')}</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{t('absences.table.status')}</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.data.map((absence: any) => (
                <tr key={absence.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{absence.agent?.fullName || absence.agent?.email || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{absence.date || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{absence.type || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{absence.status || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Button size="sm" variant="outline" onClick={() => navigate(`/absences/${absence.id}`)}>
                      {t('common.details')}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
