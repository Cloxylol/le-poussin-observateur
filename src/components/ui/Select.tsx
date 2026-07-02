import { forwardRef, type SelectHTMLAttributes } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  options,
  error,
  placeholder,
  className = '',
  id,
  ...props
}, ref) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full flex flex-col gap-1">
      {label && (
        <label htmlFor={selectId} className="text-xs font-semibold text-sage-800 tracking-wide font-sans">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          className={`w-full px-4 py-2.5 bg-sand-50/50 border border-sand-300 rounded-xl font-sans text-sm text-sage-950 appearance-none focus:outline-none focus:ring-2 focus:ring-sage-500/30 focus:border-sage-500 transition-all duration-200 ${
            error ? 'border-terracotta-500 focus:ring-terracotta-500/30 focus:border-terracotta-500' : ''
          } ${className}`}
          defaultValue=""
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {/* Custom chevron */}
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-sage-500">
          <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      </div>
      {error && (
        <span className="text-xs font-medium text-terracotta-600 px-1 mt-0.5">
          {error}
        </span>
      )}
    </div>
  );
});

Select.displayName = 'Select';
export default Select;
