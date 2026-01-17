import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contractsService, clientsService } from '@/services';
import { useTranslation } from 'react-i18next';
import { Card, Button, Badge } from '@/components/ui';
import { ArrowLeft, Edit, Trash2, FileText, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ContractDetail {
  id: string;
  contractCode: string;
  clientId: string;
  siteId: string;
  type: 'PERMANENT' | 'ONE_TIME';
  frequency?: string;
  startDate: string;
  endDate: string | null;
  status: 'DRAFT' | 'ACTIVE' | 'SUSPENDED' | 'COMPLETED' | 'TERMINATED';
  pricing?: {
    hourlyRate?: number;
    monthlyFee?: number;
    perInterventionFee?: number;
    currency: string;
    billingCycle?: string;
    paymentTerms?: string;
  };
  serviceScope?: {
    zones: string[];
    tasks: string[];
    schedules?: any[];
    specialInstructions?: string;
    excludedAreas?: string[];
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export default function ContractDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { data: contract, isLoading, error } = useQuery({
    queryKey: ['contract', id],
    queryFn: () => contractsService.getById(id!),
    enabled: !!id,
  });

  const { data: clientData } = useQuery({
    queryKey: ['client', contract?.clientId],
    queryFn: () => clientsService.getById(contract!.clientId),
    enabled: !!contract?.clientId,
  });

  const deleteContractMutation = useMutation({
    mutationFn: () => contractsService.delete(id!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] });
      toast.success(t('contracts.deleteSuccess'));
      navigate('/contracts');
    },
    onError: (error: any) => {
      toast.error(error.message || t('contracts.deleteError'));
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-gray-500">{t('common.loading')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-8 text-center">
        <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
        <div className="text-red-600">{t('common.error')}: {(error as any).message}</div>
      </Card>
    );
  }

  if (!contract) {
    return (
      <Card className="p-8 text-center">
        <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <div className="text-gray-600">{t('contracts.notFound')}</div>
      </Card>
    );
  }

  const statusColor = {
    DRAFT: 'bg-gray-100 text-gray-800',
    ACTIVE: 'bg-green-100 text-green-800',
    SUSPENDED: 'bg-yellow-100 text-yellow-800',
    COMPLETED: 'bg-blue-100 text-blue-800',
    TERMINATED: 'bg-red-100 text-red-800',
  };

  const getStatusColor = (status: string) => statusColor[status as keyof typeof statusColor] || '';

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/contracts')}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{contract.contractCode}</h1>
            <p className="mt-1 text-gray-600">{clientData?.name}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/contracts/${id}/edit`)}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            {t('common.edit')}
          </Button>
          <Button
            variant="destructive"
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            {t('common.delete')}
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <Card className="p-6 border-l-4 border-red-600 bg-red-50">
          <h3 className="font-semibold text-red-900 mb-2">{t('contracts.confirmDelete')}</h3>
          <p className="text-red-800 text-sm mb-4">{t('common.cannotUndo')}</p>
          <div className="flex gap-2">
            <Button
              variant="destructive"
              onClick={() => deleteContractMutation.mutate()}
              disabled={deleteContractMutation.isPending}
            >
              {deleteContractMutation.isPending ? t('common.deleting') : t('common.confirm')}
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowDeleteConfirm(false)}
            >
              {t('common.cancel')}
            </Button>
          </div>
        </Card>
      )}

      {/* Contract Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('contracts.form.basicInfo')}</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">{t('contracts.form.status')}</label>
              <div className="mt-1">
                <Badge className={getStatusColor(contract.status)}>
                  {t(`contracts.status.${contract.status.toLowerCase()}`)}
                </Badge>
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600">{t('contracts.form.type')}</label>
              <p className="mt-1 font-medium">{t(`contracts.type.${contract.type.toLowerCase()}`)}</p>
            </div>

            {contract.frequency && (
              <div>
                <label className="text-sm text-gray-600">{t('contracts.form.frequency')}</label>
                <p className="mt-1 font-medium">{t(`contracts.frequency.${contract.frequency.toLowerCase()}`)}</p>
              </div>
            )}

            <div>
              <label className="text-sm text-gray-600">{t('common.client')}</label>
              <p className="mt-1 font-medium text-blue-600 cursor-pointer hover:underline" 
                 onClick={() => navigate(`/clients/${contract.clientId}`)}>
                {clientData?.name}
              </p>
            </div>
          </div>
        </Card>

        {/* Dates */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('contracts.form.period')}</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">{t('contracts.form.startDate')}</label>
              <p className="mt-1 font-medium">{formatDate(contract.startDate)}</p>
            </div>

            <div>
              <label className="text-sm text-gray-600">{t('contracts.form.endDate')}</label>
              <p className="mt-1 font-medium">
                {contract.endDate ? formatDate(contract.endDate) : t('common.ongoing')}
              </p>
            </div>

            <div>
              <label className="text-sm text-gray-600">{t('common.createdAt')}</label>
              <p className="mt-1 text-sm text-gray-600">{formatDate(contract.createdAt)}</p>
            </div>

            <div>
              <label className="text-sm text-gray-600">{t('common.updatedAt')}</label>
              <p className="mt-1 text-sm text-gray-600">{formatDate(contract.updatedAt)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Pricing Information */}
      {contract.pricing && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('contracts.form.pricing')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contract.pricing.hourlyRate && (
              <div>
                <label className="text-sm text-gray-600">{t('contracts.form.hourlyRate')}</label>
                <p className="mt-1 font-medium">{contract.pricing.hourlyRate} {contract.pricing.currency}</p>
              </div>
            )}

            {contract.pricing.monthlyFee && (
              <div>
                <label className="text-sm text-gray-600">{t('contracts.form.monthlyFee')}</label>
                <p className="mt-1 font-medium">{contract.pricing.monthlyFee} {contract.pricing.currency}</p>
              </div>
            )}

            {contract.pricing.perInterventionFee && (
              <div>
                <label className="text-sm text-gray-600">{t('contracts.form.perInterventionFee')}</label>
                <p className="mt-1 font-medium">{contract.pricing.perInterventionFee} {contract.pricing.currency}</p>
              </div>
            )}

            {contract.pricing.billingCycle && (
              <div>
                <label className="text-sm text-gray-600">{t('contracts.form.billingCycle')}</label>
                <p className="mt-1 font-medium">{contract.pricing.billingCycle}</p>
              </div>
            )}

            {contract.pricing.paymentTerms && (
              <div>
                <label className="text-sm text-gray-600">{t('contracts.form.paymentTerms')}</label>
                <p className="mt-1 font-medium">{contract.pricing.paymentTerms}</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Service Scope */}
      {contract.serviceScope && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('contracts.form.serviceScope')}</h2>
          <div className="space-y-6">
            {contract.serviceScope.zones && contract.serviceScope.zones.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">{t('contracts.form.zones')}</label>
                <div className="flex flex-wrap gap-2">
                  {contract.serviceScope.zones.map((zone, idx) => (
                    <Badge key={idx} className="bg-blue-100 text-blue-800">
                      {zone}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {contract.serviceScope.tasks && contract.serviceScope.tasks.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">{t('contracts.form.tasks')}</label>
                <div className="flex flex-wrap gap-2">
                  {contract.serviceScope.tasks.map((task, idx) => (
                    <Badge key={idx} className="bg-green-100 text-green-800">
                      {task}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {contract.serviceScope.specialInstructions && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">{t('contracts.form.specialInstructions')}</label>
                <p className="text-gray-700 p-3 bg-gray-50 rounded-lg">{contract.serviceScope.specialInstructions}</p>
              </div>
            )}

            {contract.serviceScope.excludedAreas && contract.serviceScope.excludedAreas.length > 0 && (
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">{t('contracts.form.excludedAreas')}</label>
                <div className="flex flex-wrap gap-2">
                  {contract.serviceScope.excludedAreas.map((area, idx) => (
                    <Badge key={idx} className="bg-red-100 text-red-800">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Notes */}
      {contract.notes && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('common.notes')}</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{contract.notes}</p>
        </Card>
      )}
    </div>
  );
}
