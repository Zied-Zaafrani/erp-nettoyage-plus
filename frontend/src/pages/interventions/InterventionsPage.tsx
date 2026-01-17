import { useState } from 'react';
import { Plus, Search, Filter, ChevronRight, Calendar, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input, Badge } from '@/components/ui';
import { useQuery } from '@tanstack/react-query';
import { interventionsService } from '@/services';
import { Intervention, InterventionStatus } from '@/types';

export default function InterventionsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<InterventionStatus | ''>('');
  const [showFilters, setShowFilters] = useState(false);

  const { data: interventionsData, isLoading, error } = useQuery({
    queryKey: ['interventions', page, search, selectedStatus],
    queryFn: () =>
      interventionsService.getAll({
        page,
        limit: 10,
        search: search || undefined,
        status: selectedStatus || undefined,
      }),
    staleTime: 1000 * 60 * 5,
  });

  const statusOptions = [
    { value: '', label: t('common.all') },
    { value: 'scheduled', label: t('interventions.status.scheduled') },
    { value: 'in_progress', label: t('interventions.status.in_progress') },
    { value: 'completed', label: t('interventions.status.completed') },
    { value: 'cancelled', label: t('interventions.status.cancelled') },
  ];

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      scheduled: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-yellow-100 text-yellow-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-600">{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t('interventions.title')}
          </h1>
          <p className="mt-1 text-gray-600">{t('interventions.subtitle')}</p>
        </div>
        <Button
          onClick={() => navigate('/interventions/create')}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          {t('interventions.create')}
        </Button>
      </div>

      <Card className="p-4 space-y-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={t('interventions.search')}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            {t('common.filters')}
          </Button>
        </div>

        {showFilters && (
          <div className="pt-4 border-t grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('common.status')}
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value as InterventionStatus | '');
                  setPage(1);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </Card>

      {error && (
        <Card className="p-4 bg-red-50 border-red-200">
          <p className="text-red-800">{t('common.error')}: {(error as any).message}</p>
        </Card>
      )}

      {!interventionsData?.data || interventionsData.data.length === 0 ? (
        <Card className="p-12 text-center">
          <Calendar className="h-16 w-16 mx-auto text-gray-300" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            {t('interventions.title')}
          </h3>
          <p className="mt-1 text-sm text-gray-500">{t('common.noData')}</p>
          <Button
            onClick={() => navigate('/interventions/create')}
            className="mt-4"
          >
            {t('interventions.create')}
          </Button>
        </Card>
      ) : (
        <>
          <div className="space-y-2">
            {interventionsData.data.map((intervention: Intervention) => (
              <Card
                key={intervention.id}
                className="p-4 hover:bg-gray-50 cursor-pointer transition"
                onClick={() => navigate(`/interventions/${intervention.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-gray-900">
                            {intervention.interventionCode}
                          </h4>
                          <Badge className={getStatusColor(intervention.status)}>
                            {t(`interventions.status.${intervention.status}`)}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600">
                              {intervention.contract?.client?.name} -{' '}
                              {(intervention.contract as any)?.reference || (intervention.contract as any)?.contractCode}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {intervention.site?.name}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(intervention.scheduledDate).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </Card>
            ))}
          </div>

          {interventionsData?.pagination && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {t('common.showing')} {(page - 1) * 10 + 1}-
                {Math.min(page * 10, interventionsData.pagination.total)} {t('common.of')}{' '}
                {interventionsData.pagination.total}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  {t('common.previous')}
                </Button>
                <Button
                  variant="outline"
                  disabled={page >= (interventionsData.pagination.totalPages || 1)}
                  onClick={() => setPage(page + 1)}
                >
                  {t('common.next')}
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

