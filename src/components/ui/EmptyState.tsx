import React, { type ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-sand-200 rounded-2xl bg-sand-100/20 max-w-sm mx-auto my-6">
      {icon && (
        <div className="mb-4 text-sage-400 p-3 bg-sand-100/50 rounded-full">
          {icon}
        </div>
      )}
      <h3 className="font-serif text-lg font-bold text-sage-800 mb-1">
        {title}
      </h3>
      <p className="font-sans text-sm text-sage-600 mb-6 leading-relaxed">
        {description}
      </p>
      {action && (
        <div className="w-full flex justify-center">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
