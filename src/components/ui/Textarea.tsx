import { forwardRef, type TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  error,
  className = '',
  id,
  rows = 3,
  ...props
}, ref) => {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full flex flex-col gap-1">
      {label && (
        <label htmlFor={textareaId} className="text-xs font-semibold text-sage-800 tracking-wide font-sans">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        className={`w-full px-4 py-2.5 bg-sand-50/50 border border-sand-300 rounded-xl font-sans text-sm text-sage-950 placeholder-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-500/30 focus:border-sage-500 transition-all duration-200 resize-none ${
          error ? 'border-terracotta-500 focus:ring-terracotta-500/30 focus:border-terracotta-500' : ''
        } ${className}`}
        {...props}
      />
      {error && (
        <span className="text-xs font-medium text-terracotta-600 px-1 mt-0.5">
          {error}
        </span>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';
export default Textarea;
