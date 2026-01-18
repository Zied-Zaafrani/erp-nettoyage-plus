import { ReactNode } from 'react';
import { clsx } from 'clsx';

// ============================================
// CARD COMPONENT
// ============================================

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
}

export function Card({ children, className, padding = 'md', onClick }: CardProps) {
  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      role={onClick ? 'button' : undefined}
      onClick={onClick}
      className={clsx(
        'rounded-xl border border-gray-200 bg-white shadow-soft dark:bg-gray-800 dark:border-gray-700',
        paddingStyles[padding],
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
}

// ============================================
// CARD HEADER
// ============================================

interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

export function CardHeader({ title, subtitle, action, className }: CardHeaderProps) {
  return (
    <div className={clsx('flex items-center justify-between', className)}>
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}

// ============================================
// CARD CONTENT
// ============================================

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return <div className={clsx('mt-4', className)}>{children}</div>;
}

// ============================================
// CARD FOOTER
// ============================================

interface CardFooterProps {
  children: ReactNode;
  className?: string;
}

export function CardFooter({ children, className }: CardFooterProps) {
  return (
    <div className={clsx('mt-6 flex items-center justify-end gap-3', className)}>
      {children}
    </div>
  );
}

export default Card;
