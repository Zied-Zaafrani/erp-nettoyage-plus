import { ReactNode } from 'react';
import { clsx } from 'clsx';

// ============================================
// BADGE VARIANTS
// ============================================

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'gray';
type BadgeSize = 'sm' | 'md' | 'lg';

const variantStyles: Record<BadgeVariant, string> = {
  primary: 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400',
  secondary: 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900/30 dark:text-secondary-400',
  success: 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-400',
  warning: 'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-400',
  danger: 'bg-danger-100 text-danger-800 dark:bg-danger-900/30 dark:text-danger-400',
  gray: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-0.5 text-xs',
  lg: 'px-3 py-1 text-sm',
};

// ============================================
// BADGE COMPONENT
// ============================================

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
  dot?: boolean;
}

export default function Badge({
  children,
  variant = 'gray',
  size = 'md',
  className,
  dot,
}: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full font-medium',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {dot && (
        <span
          className={clsx(
            'h-1.5 w-1.5 rounded-full',
            variant === 'success' && 'bg-success-500',
            variant === 'warning' && 'bg-warning-500',
            variant === 'danger' && 'bg-danger-500',
            variant === 'primary' && 'bg-primary-500',
            variant === 'secondary' && 'bg-secondary-500',
            variant === 'gray' && 'bg-gray-500'
          )}
        />
      )}
      {children}
    </span>
  );
}

// ============================================
// STATUS BADGE PRESETS
// ============================================

// Common status badge mappings
export const statusBadgeVariants = {
  // Generic status
  active: 'success' as BadgeVariant,
  inactive: 'gray' as BadgeVariant,
  pending: 'warning' as BadgeVariant,
  completed: 'success' as BadgeVariant,
  cancelled: 'danger' as BadgeVariant,
  
  // Client status
  suspended: 'warning' as BadgeVariant,
  terminated: 'danger' as BadgeVariant,
  
  // Intervention status
  scheduled: 'secondary' as BadgeVariant,
  in_progress: 'primary' as BadgeVariant,
  missed: 'danger' as BadgeVariant,
  
  // Contract status
  draft: 'gray' as BadgeVariant,
  
  // Absence status
  approved: 'success' as BadgeVariant,
  rejected: 'danger' as BadgeVariant,
  
  // Priority
  low: 'gray' as BadgeVariant,
  medium: 'secondary' as BadgeVariant,
  high: 'warning' as BadgeVariant,
  critical: 'danger' as BadgeVariant,
};

interface StatusBadgeProps {
  status: string;
  size?: BadgeSize;
  showDot?: boolean;
}

export function StatusBadge({ status, size = 'md', showDot = true }: StatusBadgeProps) {
  const variant = statusBadgeVariants[status as keyof typeof statusBadgeVariants] || 'gray';
  const label = status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <Badge variant={variant} size={size} dot={showDot}>
      {label}
    </Badge>
  );
}
