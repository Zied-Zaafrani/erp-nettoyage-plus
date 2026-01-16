import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search, Edit, Trash2, UserCheck, RefreshCw } from 'lucide-react';
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
import { User } from '@/types';
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
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

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
    queryKey: ['users', { page, limit, search: debouncedSearch }],
    queryFn: () => usersService.getAll({ page, limit, search: debouncedSearch || undefined }),
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => usersService.delete(id),
    onSuccess: () => {
      toast.success(t('users.deleteSuccess'));
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsDeleteOpen(false);
      setUserToDelete(null);
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

  const handleDelete = (user: User) => {
    setUserToDelete(user);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      deleteMutation.mutate(userToDelete.id);
    }
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
  const canCreate = hasRole(['SUPER_ADMIN', 'DIRECTOR']);
  const canEdit = hasRole(['SUPER_ADMIN', 'DIRECTOR']);
  const canDelete = hasRole('SUPER_ADMIN');

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
          <div className="w-full sm:max-w-xs">
            <Input
              placeholder={t('common.search')}
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              leftIcon={<Search size={18} />}
            />
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
                        {canEdit && (
                          <button
                            onClick={() => handleEdit(user)}
                            className="rounded p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                          >
                            <Edit size={16} />
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => handleDelete(user)}
                            className="rounded p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 size={16} />
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

      {/* Delete confirmation modal */}
      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        title={t('users.deleteUser')}
        message={`${t('users.deleteConfirm')} ${userToDelete?.firstName} ${userToDelete?.lastName}?`}
        confirmText={t('common.delete')}
        isLoading={deleteMutation.isPending}
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
