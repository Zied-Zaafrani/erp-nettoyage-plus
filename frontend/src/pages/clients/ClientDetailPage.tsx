import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { clientsService, contractsService, interventionsService } from '@/services';
import { useTranslation } from 'react-i18next';
import { Card, Button, Badge } from '@/components/ui';
import { ArrowLeft, Edit, FileText, ListChecks } from 'lucide-react';

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('contracts');

  const { data: client, isLoading, error } = useQuery({
    queryKey: ['client', id],
    queryFn: () => clientsService.getById(id!),
    enabled: !!id,
  });

  const { data: contractsData } = useQuery({
    queryKey: ['contracts', { clientId: id }],
    queryFn: () => contractsService.getAll({ clientId: id! }),
    enabled: !!id,
  });

  const { data: interventionsData } = useQuery({
    queryKey: ['interventions', { clientId: id }],
    queryFn: () => interventionsService.getAll({ clientId: id! }),
    enabled: !!id,
  });

  if (isLoading) {
    return <div>{t('common.loading')}</div>;
  }

  if (error) {
    return <div>{t('common.error')}: {error.message}</div>;
  }

  if (!client) {
    return <div>{t('clients.notFound')}</div>;
  }

  const statusColor = {
    PROSPECT: 'bg-gray-100 text-gray-800',
    ACTIVE: 'bg-green-100 text-green-800',
    SUSPENDED: 'bg-yellow-100 text-yellow-800',
    ARCHIVED: 'bg-red-100 text-red-800',
  };

  const getStatusColor = (status: string) => statusColor[status as keyof typeof statusColor] || '';

  const renderContracts = () => (
    <div className="space-y-4">
      {contractsData?.data.map((contract: any) => (
        <Card 
          key={contract.id} 
          className="p-4 hover:bg-gray-50 cursor-pointer transition"
          onClick={() => navigate(`/contracts/${contract.id}`)}
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold text-blue-600">{contract.contractCode}</p>
              <p className="text-sm text-gray-500">{t(`contracts.type.${contract.type.toLowerCase()}`)}</p>
            </div>
            <Badge className={getStatusColor(contract.status)}>{t(`contracts.status.${contract.status.toLowerCase()}`)}</Badge>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            <p>{t('contracts.form.period')}: {new Date(contract.startDate).toLocaleDateString()} - {contract.endDate ? new Date(contract.endDate).toLocaleDateString() : t('common.ongoing')}</p>
          </div>
        </Card>
      ))}
    </div>
  );

  const renderInterventions = () => (
     <div className="space-y-4">
      {interventionsData?.data.map((intervention: any) => (
        <Card 
          key={intervention.id} 
          className="p-4 hover:bg-gray-50 cursor-pointer transition"
          onClick={() => navigate(`/interventions/${intervention.id}`)}
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold text-blue-600">{intervention.interventionCode}</p>
              <p className="text-sm text-gray-500">{intervention.site?.name}</p>
            </div>
            <Badge className={getStatusColor(intervention.status)}>{t(`interventions.status.${intervention.status.toLowerCase()}`)}</Badge>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            <p>{t('interventions.form.scheduledDate')}: {new Date(intervention.scheduledDate).toLocaleDateString()}</p>
          </div>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => navigate('/clients')} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t('common.back')}
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{client.name}</h1>
        <Button onClick={() => navigate(`/clients/${id}/edit`)} className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            {t('common.edit')}
        </Button>
      </div>

      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
                <p className="text-sm text-gray-500">{t('clients.form.code')}</p>
                <p className="font-semibold">{client.clientCode}</p>
            </div>
            <div>
                <p className="text-sm text-gray-500">{t('clients.form.status')}</p>
                <Badge className={getStatusColor(client.status)}>{client.status}</Badge>
            </div>
            <div>
                <p className="text-sm text-gray-500">{t('clients.form.type')}</p>
                <p className="font-semibold">{client.type}</p>
            </div>
            <div>
                <p className="text-sm text-gray-500">{t('clients.form.email')}</p>
                <p className="font-semibold">{client.email}</p>
            </div>
            <div>
                <p className="text-sm text-gray-500">{t('clients.form.phone')}</p>
                <p className="font-semibold">{client.phone}</p>
            </div>
             <div>
                <p className="text-sm text-gray-500">{t('clients.form.contactPerson')}</p>
                <p className="font-semibold">{client.contactPerson}</p>
            </div>
            <div className="col-span-1 md:col-span-3">
                <p className="text-sm text-gray-500">{t('clients.form.address')}</p>
                <p className="font-semibold">{`${client.address || ''}, ${client.city || ''}, ${client.postalCode || ''}, ${client.country || ''}`}</p>
            </div>
            <div className="col-span-1 md:col-span-3">
                <p className="text-sm text-gray-500">{t('clients.form.notes')}</p>
                <p className="font-semibold">{client.notes}</p>
            </div>
        </div>
      </Card>

      <div>
        <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button
                    onClick={() => setActiveTab('contracts')}
                    className={`${
                    activeTab === 'contracts'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
                >
                    <FileText className="h-4 w-4" />
                    {t('contracts.title')}
                </button>
                <button
                    onClick={() => setActiveTab('interventions')}
                    className={`${
                    activeTab === 'interventions'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
                >
                    <ListChecks className="h-4 w-4" />
                    {t('interventions.title')}
                </button>
            </nav>
        </div>
        <div className="mt-6">
            {activeTab === 'contracts' && renderContracts()}
            {activeTab === 'interventions' && renderInterventions()}
        </div>
      </div>
    </div>
  );
}
