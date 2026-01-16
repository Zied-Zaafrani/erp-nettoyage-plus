import { forwardRef, InputHTMLAttributes } from 'react';
import { clsx } from 'clsx';

// ============================================
// INPUT COMPONENT
// ============================================

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="mb-1.5 block text-sm font-medium text-gray-700">
            {label}
            {props.required && <span className="ml-1 text-danger-500">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-400">{leftIcon}</span>
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={clsx(
              'w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-gray-900',
              'placeholder:text-gray-400 focus:outline-none focus:ring-2',
              'disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500',
              error
                ? 'border-danger-500 focus:border-danger-500 focus:ring-danger-500/20'
                : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500/20',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-gray-400">{rightIcon}</span>
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-xs text-danger-600">{error}</p>}
        {hint && !error && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
