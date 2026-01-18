import { ReactNode } from 'react';
import { clsx } from 'clsx';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

// ============================================
// TABLE COMPONENTS
// ============================================

interface TableProps {
  children: ReactNode;
  className?: string;
}

export function Table({ children, className }: TableProps) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
      <table className={clsx('min-w-full divide-y divide-gray-200 dark:divide-gray-700', className)}>
        {children}
      </table>
    </div>
  );
}

interface TableHeadProps {
  children: ReactNode;
  className?: string;
}

export function TableHead({ children, className }: TableHeadProps) {
  return <thead className={clsx('bg-gray-50 dark:bg-gray-800', className)}>{children}</thead>;
}

interface TableBodyProps {
  children: ReactNode;
  className?: string;
}

export function TableBody({ children, className }: TableBodyProps) {
  return (
    <tbody className={clsx('divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900', className)}>
      {children}
    </tbody>
  );
}

interface TableRowProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  isSelected?: boolean;
}

export function TableRow({ children, className, onClick, isSelected }: TableRowProps) {
  return (
    <tr
      className={clsx(
        'transition-colors',
        onClick && 'cursor-pointer',
        isSelected ? 'bg-primary-50 dark:bg-primary-900/30' : 'hover:bg-gray-50 dark:hover:bg-gray-800',
        className
      )}
      onClick={onClick}
    >
      {children}
    </tr>
  );
}

interface TableHeaderProps {
  children: ReactNode;
  className?: string;
  sortable?: boolean;
  sorted?: 'asc' | 'desc' | false;
  onSort?: () => void;
}

export function TableHeader({
  children,
  className,
  sortable,
  sorted,
  onSort,
}: TableHeaderProps) {
  return (
    <th
      className={clsx(
        'px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400',
        sortable && 'cursor-pointer select-none hover:text-gray-700 dark:hover:text-gray-300',
        className
      )}
      onClick={sortable ? onSort : undefined}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortable && sorted && (
          <span className="text-primary-600">
            {sorted === 'asc' ? '↑' : '↓'}
          </span>
        )}
      </div>
    </th>
  );
}

interface TableCellProps {
  children: ReactNode;
  className?: string;
}

export function TableCell({ children, className }: TableCellProps) {
  return (
    <td className={clsx('whitespace-nowrap px-6 py-4 text-sm text-gray-900 dark:text-gray-100', className)}>
      {children}
    </td>
  );
}

// ============================================
// PAGINATION
// ============================================

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  showInfo?: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  showInfo = true,
}: PaginationProps) {
  // Ensure values are valid numbers
  const safePage = Number.isFinite(currentPage) ? currentPage : 1;
  const safeTotal = Number.isFinite(totalPages) ? totalPages : 1;
  const safeTotalItems = Number.isFinite(totalItems) ? totalItems : 0;
  
  const startItem = safeTotalItems > 0 ? (safePage - 1) * itemsPerPage + 1 : 0;
  const endItem = Math.min(safePage * itemsPerPage, safeTotalItems);

  const canGoPrev = safePage > 1;
  const canGoNext = safePage < safeTotal;

  // Don't render if no items
  if (safeTotalItems === 0) {
    return null;
  }

  return (
    <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3">
      {showInfo && (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Showing <span className="font-medium">{startItem}</span> to{' '}
          <span className="font-medium">{endItem}</span> of{' '}
          <span className="font-medium">{safeTotalItems}</span> results
        </div>
      )}

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(1)}
          disabled={!canGoPrev}
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronsLeft size={16} />
        </button>
        <button
          onClick={() => onPageChange(safePage - 1)}
          disabled={!canGoPrev}
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="flex items-center gap-1 px-2">
          {generatePageNumbers(safePage, safeTotal).map((page, i) =>
            page === '...' ? (
              <span key={`ellipsis-${i}`} className="px-2 text-gray-400 dark:text-gray-500">
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page as number)}
                className={clsx(
                  'min-w-[32px] rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
                  safePage === page
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                )}
              >
                {page}
              </button>
            )
          )}
        </div>

        <button
          onClick={() => onPageChange(safePage + 1)}
          disabled={!canGoNext}
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronRight size={16} />
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={!canGoNext}
          className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-600 dark:hover:text-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronsRight size={16} />
        </button>
      </div>
    </div>
  );
}

// Generate page numbers with ellipsis
function generatePageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  if (current <= 3) {
    return [1, 2, 3, 4, 5, '...', total];
  }

  if (current >= total - 2) {
    return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
  }

  return [1, '...', current - 1, current, current + 1, '...', total];
}

// ============================================
// EMPTY STATE
// ============================================

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {icon && <div className="mb-4 text-gray-400 dark:text-gray-500">{icon}</div>}
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">{title}</h3>
      {description && <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
