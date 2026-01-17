import { useState } from 'react';
import { FileText, Plus, Search, Filter, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input, Badge } from '@/components/ui';
import { useQuery } from '@tanstack/react-query';
import { contractsService } from '@/services';

interface Contract {
  id: string;
  contractCode: string;
  client: { name: string };
  site: { name: string };
  type: 'PERMANENT' | 'ONE_TIME';
  status: 'DRAFT' | 'ACTIVE' | 'SUSPENDED' | 'COMPLETED' | 'TERMINATED';
  startDate: string;
  endDate: string | null;
}

export default function ContractsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  const { data: contractsData, isLoading, error } = useQuery({
    queryKey: ['contracts', page, search, selectedStatus],
    queryFn: () =>
      contractsService.getAll({
        page,
        limit: 10,
        search: search || undefined,
        status: selectedStatus || undefined,
      }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const statusOptions = [
    { value: '', label: t('common.all') },
    { value: 'DRAFT', label: t('contracts.status.draft') },
    { value: 'ACTIVE', label: t('contracts.status.active') },
    { value: 'SUSPENDED', label: t('contracts.status.suspended') },
    { value: 'COMPLETED', label: t('contracts.status.completed') },
    { value: 'TERMINATED', label: t('contracts.status.terminated') },
  ];
  
  const statusColor = {
    DRAFT: 'bg-gray-100 text-gray-800',
    ACTIVE: 'bg-green-100 text-green-800',
    SUSPENDED: 'bg-yellow-100 text-yellow-800',
    COMPLETED: 'bg-blue-100 text-blue-800',
    TERMINATED: 'bg-red-100 text-red-800',
  };

  const getStatusColor = (status: string) => statusColor[status as keyof typeof statusColor] || '';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('contracts.title')}</h1>
          <p className="mt-1 text-gray-600">{t('contracts.subtitle')}</p>
        </div>
        <Button
          onClick={() => navigate('/contracts/create')}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          {t('contracts.create')}
        </Button>
      </div>

      <Card className="p-4 space-y-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={t('contracts.search')}
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
          <div className="pt-4 border-t">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('common.status')}
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </Card>

      {isLoading ? (
        <div className="text-center py-12">{t('common.loading')}</div>
      ) : error ? (
        <Card className="p-8 text-center text-red-600">{t('common.error')}</Card>
      ) : contractsData?.data?.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-12">
          <FileText className="h-16 w-16 text-gray-300" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">{t('contracts.title')}</h3>
          <p className="mt-1 text-sm text-gray-500">{t('common.noData')}</p>
          <Button
            onClick={() => navigate('/contracts/create')}
            className="mt-4"
          >
            {t('contracts.create')}
          </Button>
        </Card>
      ) : (
        <>
          <div className="space-y-2">
            {contractsData?.data?.map((contract: Contract) => (
              <Card
                key={contract.id}
                className="p-4 hover:bg-gray-50 cursor-pointer transition"
                onClick={() => navigate(`/contracts/${contract.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                     <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-gray-900">{contract.contractCode}</h3>
                        <Badge className={getStatusColor(contract.status)}>
                          {statusOptions.find((s) => s.value === contract.status)?.label}
                        </Badge>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                        <p>{contract.client?.name} / {contract.site?.name}</p>
                      </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </Card>
            ))}
          </div>

          {contractsData?.pagination && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {t('common.showing')} {(page - 1) * 10 + 1}-
                {Math.min(page * 10, contractsData.pagination.total)} {t('common.of')}{' '}
                {contractsData.pagination.total}
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
                  disabled={page >= contractsData.pagination.totalPages}
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
