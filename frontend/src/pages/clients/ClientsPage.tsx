import { useState, useEffect } from 'react';
import { Building2, Plus, Search, Filter, ChevronRight, Mail, Phone, MapPin, Tag } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input, Badge } from '@/components/ui';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { clientsService } from '@/services';

interface Client {
  id: string;
  clientCode: string;
  name: string;
  type: 'INDIVIDUAL' | 'COMPANY' | 'MULTISITE';
  email: string | null;
  phone: string | null;
  city: string | null;
  status: 'PROSPECT' | 'ACTIVE' | 'SUSPENDED' | 'ARCHIVED';
  contactPerson: string | null;
  createdAt: string;
}

export default function ClientsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch clients
  const { data: clientsData, isLoading, error } = useQuery({
    queryKey: ['clients', page, search, selectedStatus],
    queryFn: () =>
      clientsService.getAll({
        page,
        limit: 10,
        search: search || undefined,
        status: selectedStatus || undefined,
      }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const statusOptions = [
    { value: '', label: t('common.all') },
    { value: 'PROSPECT', label: t('clients.status.prospect') },
    { value: 'ACTIVE', label: t('clients.status.active') },
    { value: 'SUSPENDED', label: t('clients.status.suspended') },
    { value: 'ARCHIVED', label: t('clients.status.archived') },
  ];

  const typeOptions = {
    INDIVIDUAL: t('clients.type.individual'),
    COMPANY: t('clients.type.company'),
    MULTISITE: t('clients.type.multisite'),
  };

  const statusColor = {
    PROSPECT: 'bg-gray-100 text-gray-800',
    ACTIVE: 'bg-green-100 text-green-800',
    SUSPENDED: 'bg-yellow-100 text-yellow-800',
    ARCHIVED: 'bg-red-100 text-red-800',
  };

  const getStatusColor = (status: string) => statusColor[status as keyof typeof statusColor] || '';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('clients.title')}</h1>
          <p className="mt-1 text-gray-600">{t('clients.subtitle')}</p>
        </div>
        <Button
          onClick={() => navigate('/clients/create')}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          {t('clients.create')}
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="p-4 space-y-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={t('clients.search')}
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

        {/* Filters */}
        {showFilters && (
          <div className="pt-4 border-t grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
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
          </div>
        )}
      </Card>

      {/* Clients Table */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="text-gray-500">{t('common.loading')}</div>
        </div>
      ) : error ? (
        <Card className="p-8 text-center">
          <div className="text-red-600">{t('common.error')}</div>
        </Card>
      ) : clientsData?.data?.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-12">
          <Building2 className="h-16 w-16 text-gray-300" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">{t('clients.title')}</h3>
          <p className="mt-1 text-sm text-gray-500">{t('common.noData')}</p>
          <Button
            onClick={() => navigate('/clients/create')}
            className="mt-4"
          >
            {t('clients.create')}
          </Button>
        </Card>
      ) : (
        <>
          <div className="space-y-2">
            {clientsData?.data?.map((client: Client) => (
              <Card
                key={client.id}
                className="p-4 hover:bg-gray-50 cursor-pointer transition"
                onClick={() => navigate(`/clients/${client.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold text-gray-900">{client.name}</h3>
                          <Badge className={getStatusColor(client.status)}>
                            {statusOptions.find((s) => s.value === client.status)?.label}
                          </Badge>
                          <Tag className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {typeOptions[client.type as keyof typeof typeOptions]}
                          </span>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
                          {client.email && (
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {client.email}
                            </div>
                          )}
                          {client.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {client.phone}
                            </div>
                          )}
                          {client.city && (
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {client.city}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {clientsData?.pagination && (
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {t('common.showing')} {(page - 1) * 10 + 1}-
                {Math.min(page * 10, clientsData.pagination.total)} {t('common.of')}{' '}
                {clientsData.pagination.total}
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
                  disabled={page >= clientsData.pagination.totalPages}
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
