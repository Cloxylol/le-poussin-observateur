import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Compass, Eye, Map, Settings } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const navItems = [
    { to: '/', label: 'Accueil', icon: Home },
    { to: '/observations', label: 'Observations', icon: Compass },
    { to: '/species', label: 'Espèces', icon: Eye },
    { to: '/outings', label: 'Sorties', icon: Map },
    { to: '/settings', label: 'Réglages', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-sand-100/90 backdrop-blur-md border-t border-sand-200 shadow-lg px-2 pt-2 pb-[calc(8px+env(safe-area-inset-bottom,0px))]">
      <div className="max-w-md mx-auto flex justify-between items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center flex-1 py-1 px-2 text-xs font-medium rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'text-terracotta-600 font-bold scale-105'
                    : 'text-sage-600 active:bg-sand-200/50 hover:text-sage-800'
                }`
              }
            >
              <Icon className="w-5.5 h-5.5 mb-1" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
