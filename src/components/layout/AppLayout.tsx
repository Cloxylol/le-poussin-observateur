import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import BottomNav from './BottomNav';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-stone-100/60 flex justify-center">
      {/* Container principal mobile-first centré sur grand écran */}
      <div className="w-full max-w-md bg-sand-50 min-h-screen shadow-xl flex flex-col relative pb-[calc(64px+env(safe-area-inset-bottom,0px))]">
        <Header />
        
        {/* Contenu principal scrollable */}
        <main className="flex-1 overflow-y-auto pb-6">
          <Outlet />
        </main>
        
        <BottomNav />
      </div>
    </div>
  );
};

export default AppLayout;
