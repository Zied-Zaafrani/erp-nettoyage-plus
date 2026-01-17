import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Edit, UserX, UserCheck, RefreshCw, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  Button,
  Input,
  Card,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
  Pagination,
  EmptyState,
  StatusBadge,
  ConfirmModal,
} from '@/components/ui';
import { usersService } from '@/services';
import { User, UserStatus, UserRole, UpdateUserDto } from '@/types';
import { useAuth, ROLE_KEYS, ROLE_COLORS } from '@/contexts/AuthContext';
import UserFormModal from './components/UserFormModal';

// ============================================
// USERS PAGE
// ============================================

export default function UsersPage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const { hasRole } = useAuth();
  
  // State
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | UserStatus>('ALL');
  const [roleFilter, setRoleFilter] = useState<'ALL' | UserRole>('ALL');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeactivateOpen, setIsDeactivateOpen] = useState(false);
  const [userToDeactivate, setUserToDeactivate] = useState<User | null>(null);
  const [isSuspendOpen, setIsSuspendOpen] = useState(false);
  const [userToSuspend, setUserToSuspend] = useState<User | null>(null);

  const limit = 10;

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch users
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['users', { page, limit, search: debouncedSearch, status: statusFilter, role: roleFilter }],
    queryFn: () => usersService.getAll({ 
      page, 
      limit, 
      search: debouncedSearch || undefined,
      status: statusFilter === 'ALL' ? undefined : statusFilter,
      role: roleFilter === 'ALL' ? undefined : roleFilter,
      includeDeleted: statusFilter === 'ALL' || statusFilter === 'ARCHIVED'
    }),
  });

  // Deactivate mutation
  const deactivateMutation = useMutation({
    mutationFn: (id: string) => usersService.delete(id),
    onSuccess: () => {
      toast.success(t('users.deactivateSuccess'));
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsDeactivateOpen(false);
      setUserToDeactivate(null);
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || t('common.error'));
    },
  });

  // Restore mutation
  const restoreMutation = useMutation({
    mutationFn: (id: string) => usersService.restore(id),
    onSuccess: () => {
      toast.success(t('users.restoreSuccess'));
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || t('common.error'));
    },
  });

  // Suspend mutation
  const suspendMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserDto }) => 
      usersService.update(id, data),
    onSuccess: () => {
      toast.success(t('users.suspendSuccess'));
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsSuspendOpen(false);
      setUserToSuspend(null);
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || t('common.error'));
    },
  });

  // Activate mutation
  const activateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserDto }) => 
      usersService.update(id, data),
    onSuccess: () => {
      toast.success(t('users.activateSuccess'));
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || t('common.error'));
    },
  });

  // Handlers
  const handleSearch = (value: string) => {
    setSearch(value);
  };

  const handleCreate = () => {
    setSelectedUser(null);
    setIsFormOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsFormOpen(true);
  };

  const handleDeactivate = (user: User) => {
    setUserToDeactivate(user);
    setIsDeactivateOpen(true);
  };

  const handleRestore = (user: User) => {
    restoreMutation.mutate(user.id);
  };

  const handleSuspend = (user: User) => {
    setUserToSuspend(user);
    setIsSuspendOpen(true);
  };

  const confirmDeactivate = () => {
    if (userToDeactivate) {
      deactivateMutation.mutate(userToDeactivate.id);
    }
  };

  const confirmSuspend = () => {
    if (userToSuspend) {
      suspendMutation.mutate({ 
        id: userToSuspend.id, 
        data: { status: 'SUSPENDED' } 
      });
    }
  };

  const handleActivate = (user: User) => {
    activateMutation.mutate({
      id: user.id,
      data: { status: 'ACTIVE' },
    });
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedUser(null);
  };

  const handleFormSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['users'] });
    handleFormClose();
  };

  // Check permissions
  const canCreate = hasRole(['SUPER_ADMIN', 'SUPERVISOR']);
  const canEdit = hasRole(['SUPER_ADMIN', 'SUPERVISOR']);
  const canDeactivate = hasRole('SUPER_ADMIN');
  const canRestore = hasRole('SUPER_ADMIN');
  const canSuspend = hasRole(['SUPER_ADMIN', 'SUPERVISOR']);
  const canManage = hasRole(['SUPER_ADMIN', 'SUPERVISOR']);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">{t('users.title')}</h1>
          <p className="page-subtitle">
            {t('users.subtitle')}
          </p>
        </div>
        {canCreate && (
          <Button onClick={handleCreate} leftIcon={<Plus size={18} />}>
            {t('users.addUser')}
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card padding="sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <div className="w-full sm:max-w-xs">
              <Input
                placeholder={t('common.search')}
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                leftIcon={<Search size={18} />}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value as 'ALL' | UserStatus);
                setPage(1);
              }}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="ALL">{t('users.statusFilter.all')}</option>
              <option value="ACTIVE">{t('users.statusFilter.active')}</option>
              <option value="SUSPENDED">{t('users.statusFilter.suspended')}</option>
              <option value="ARCHIVED">{t('users.statusFilter.archived')}</option>
            </select>
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value as 'ALL' | UserRole);
                setPage(1);
              }}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            >
              <option value="ALL">{t('users.roleFilter.all')}</option>
              <option value="SUPER_ADMIN">{t('users.roles.SUPER_ADMIN')}</option>
              <option value="SUPERVISOR">{t('users.roles.SUPERVISOR')}</option>
              <option value="AGENT">{t('users.roles.AGENT')}</option>
              <option value="CLIENT">{t('users.roles.CLIENT')}</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              {data?.meta?.total || 0} {t('common.results')}
            </span>
          </div>
        </div>
      </Card>

      {/* Users table */}
      <Card padding="none">
        {isLoading ? (
          <TableSkeleton />
        ) : error ? (
          <div className="p-6">
            <EmptyState
              title={t('common.error')}
              description={error instanceof Error ? error.message : t('errors.generic')}
              action={
                <Button
                  variant="outline"
                  leftIcon={<RefreshCw size={18} />}
                  onClick={() => refetch()}
                  isLoading={isLoading}
                >
                  {t('common.refresh')}
                </Button>
              }
            />
          </div>
        ) : data && data.data.length > 0 ? (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>{t('users.firstName')}</TableHeader>
                  <TableHeader>{t('auth.email')}</TableHeader>
                  <TableHeader>{t('users.role')}</TableHeader>
                  <TableHeader>{t('users.status')}</TableHeader>
                  <TableHeader className="w-20">{t('common.actions')}</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.data.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-medium text-primary-700">
                          {user.firstName?.[0]}
                          {user.lastName?.[0]}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-xs text-gray-500">{user.phone || '-'}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          ROLE_COLORS[user.role]
                        }`}
                      >
                        {t(ROLE_KEYS[user.role])}
                      </span>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={user.status === 'ACTIVE' ? 'active' : 'inactive'} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {canEdit && user.status !== 'ARCHIVED' && (
                          <button
                            onClick={() => handleEdit(user)}
                            className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                            title={t('common.edit')}
                          >
                            <Edit size={16} />
                          </button>
                        )}
                        {canSuspend && user.role !== 'CLIENT' && user.status === 'ACTIVE' && (
                          <button
                            onClick={() => handleSuspend(user)}
                            className="rounded bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700 transition-colors"
                            title={t('users.suspend')}
                          >
                            {t('users.suspend')}
                          </button>
                        )}
                        {canManage && user.status === 'SUSPENDED' && (
                          <button
                            onClick={() => handleActivate(user)}
                            className="rounded bg-green-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-green-700 transition-colors"
                            title={t('users.activate')}
                          >
                            {t('users.activate')}
                          </button>
                        )}
                        {canDeactivate && user.status !== 'ARCHIVED' && (
                          <button
                            onClick={() => handleDeactivate(user)}
                            className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                            title={t('users.deactivate')}
                          >
                            <UserX size={16} />
                          </button>
                        )}
                        {canRestore && user.status === 'ARCHIVED' && (
                          <button
                            onClick={() => handleRestore(user)}
                            className="rounded p-1.5 text-gray-400 hover:bg-green-50 hover:text-green-600"
                            title={t('users.restore')}
                            disabled={restoreMutation.isPending}
                          >
                            <RotateCcw size={16} />
                          </button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Pagination
              currentPage={data.meta.page}
              totalPages={data.meta.totalPages}
              totalItems={data.meta.total}
              itemsPerPage={limit}
              onPageChange={setPage}
            />
          </>
        ) : (
          <div className="p-6">
            <EmptyState
              icon={<UserCheck className="h-12 w-12" />}
              title={t('common.noResults')}
              description={
                search
                  ? t('common.noResults')
                  : t('users.addUser')
              }
              action={
                canCreate && !search ? (
                  <Button onClick={handleCreate} leftIcon={<Plus size={18} />}>
                    {t('users.addUser')}
                  </Button>
                ) : undefined
              }
            />
          </div>
        )}
      </Card>

      {/* User form modal */}
      <UserFormModal
        isOpen={isFormOpen}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
        user={selectedUser}
      />

      {/* Deactivate confirmation modal */}
      <ConfirmModal
        isOpen={isDeactivateOpen}
        onClose={() => setIsDeactivateOpen(false)}
        onConfirm={confirmDeactivate}
        title={t('users.deactivateUser')}
        message={`${t('users.deactivateConfirm')} ${userToDeactivate?.firstName} ${userToDeactivate?.lastName}?`}
        confirmText={t('users.deactivate')}
        isLoading={deactivateMutation.isPending}
      />

      {/* Suspend confirmation modal */}
      <ConfirmModal
        isOpen={isSuspendOpen}
        onClose={() => setIsSuspendOpen(false)}
        onConfirm={confirmSuspend}
        title={t('users.suspendUser')}
        message={`${t('users.suspendConfirm')} ${userToSuspend?.firstName} ${userToSuspend?.lastName}?`}
        confirmText={t('users.suspend')}
        isLoading={suspendMutation.isPending}
      />
    </div>
  );
}

// ============================================
// TABLE SKELETON
// ============================================

function TableSkeleton() {
  return (
    <div className="divide-y divide-gray-200">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-6 py-4">
          <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/4 animate-pulse rounded bg-gray-200" />
            <div className="h-3 w-1/6 animate-pulse rounded bg-gray-200" />
          </div>
          <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
          <div className="h-6 w-16 animate-pulse rounded bg-gray-200" />
        </div>
      ))}
    </div>
  );
}
