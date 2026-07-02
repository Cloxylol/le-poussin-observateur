import React from 'react';
import { Bird } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 w-full bg-sage-600 text-sand-50 shadow-md px-4 py-3 flex items-center justify-between border-b border-sage-700">
      <div className="flex items-center gap-2">
        <div className="bg-sand-50/15 p-1.5 rounded-full">
          <Bird className="w-6 h-6 text-sand-50" />
        </div>
        <span className="font-serif text-xl font-bold tracking-wide">Le Poussin Observateur</span>
      </div>
      <div className="text-xs font-sans bg-sage-700/50 text-sage-200 py-1 px-2.5 rounded-full border border-sage-500/20">
        V1.0 Offline
      </div>
    </header>
  );
};

export default Header;
