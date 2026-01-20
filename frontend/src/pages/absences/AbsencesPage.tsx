import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { absencesService } from '@/services';
import { Card, Button, Input, Select } from '@/components/ui';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { AbsenceType } from '@/types';

export default function AbsencesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters State
  const search = searchParams.get('search') || '';
  const typeFilter = searchParams.get('type') || '';
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['absences', { search: debouncedSearch, absenceType: typeFilter }],
    queryFn: () => absencesService.getAll({
      limit: 100,
      search: debouncedSearch || undefined,
      absenceType: typeFilter ? (typeFilter as AbsenceType) : undefined
    }),
  });

  const handleSearchChange = (value: string) => {
    const params = Object.fromEntries(searchParams);
    if (value) params.search = value;
    else delete params.search;
    setSearchParams(params);
  };

  const handleTypeChange = (value: string) => {
    const params = Object.fromEntries(searchParams);
    if (value) params.type = value;
    else delete params.type;
    setSearchParams(params);
  };

  const absenceTypeOptions = [
    { value: 'VACATION', label: t('absences.types.VACATION') },
    { value: 'SICK_LEAVE', label: t('absences.types.SICK_LEAVE') },
    { value: 'UNPAID', label: t('absences.types.UNPAID') },
    { value: 'AUTHORIZED', label: t('absences.types.AUTHORIZED') },
    { value: 'UNAUTHORIZED', label: t('absences.types.UNAUTHORIZED') },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'REJECTED': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'CANCELLED': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      <div className="page-header flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('absences.title')}</h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">{t('absences.subtitle')}</p>
        </div>
        <Button onClick={() => navigate('/absences/create')}>
          {t('absences.create')}
        </Button>
      </div>

      {/* Filters Section */}
      <Card className="p-4 bg-white dark:bg-gray-800">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder={t('common.search')}
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              leftIcon={<Search size={18} />}
            />
          </div>
          <div className="w-full md:w-64">
            <Select
              options={absenceTypeOptions}
              value={typeFilter}
              onChange={(e) => handleTypeChange(e.target.value)}
              placeholder={t('absences.filterByCause')}
            />
          </div>
        </div>
      </Card>

      {isLoading ? (
        <Card className="p-6 text-center text-gray-500 dark:text-gray-400">{t('common.loading')}</Card>
      ) : isError ? (
        <Card className="p-6 text-center text-red-500">{t('common.error')}</Card>
      ) : !data?.data?.length ? (
        <Card className="flex flex-col items-center justify-center py-12 bg-white dark:bg-gray-800">
          <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">{t('absences.title')}</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{t('common.noData')}</p>
        </Card>
      ) : (
        <Card className="p-0 overflow-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('absences.table.agent')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('absences.table.date')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('absences.table.type')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('absences.table.status')}</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {data.data.map((absence: any) => (
                  <tr key={absence.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {absence.agent?.fullName || absence.agent?.email || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(absence.startDate)} - {formatDate(absence.endDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {absence.absenceType}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(absence.status)}`}>
                        {absence.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button size="sm" variant="ghost" onClick={() => navigate(`/absences/${absence.id}`)}>
                        {t('common.details')}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
