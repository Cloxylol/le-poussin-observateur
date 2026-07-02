import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { Search, Plus, X } from 'lucide-react';
import { db } from '../../../db/database';
import ObservationList from '../components/ObservationList';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

export const ObservationsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch observations sorted by date (newest first)
  const observations = useLiveQuery(() => 
    db.observations.orderBy('observedAt').reverse().toArray()
  ) || [];

  // Filter observations based on search query (speciesName or locationName)
  const filteredObservations = observations.filter((obs) => {
    const searchLower = searchQuery.toLowerCase().trim();
    if (!searchLower) return true;
    
    const speciesMatch = obs.speciesName.toLowerCase().includes(searchLower);
    const locationMatch = obs.locationName?.toLowerCase().includes(searchLower) || false;
    
    return speciesMatch || locationMatch;
  });

  return (
    <div className="flex flex-col gap-4 py-4 font-sans">
      {/* Header Row */}
      <div className="flex items-center justify-between px-4">
        <h1 className="text-xl font-serif font-bold text-sage-950">
          Carnet d'observations
        </h1>
        <Link to="/observations/add">
          <Button size="sm" className="flex items-center gap-1">
            <Plus className="w-4 h-4" />
            Ajouter
          </Button>
        </Link>
      </div>

      {/* Search Input */}
      <div className="px-4 relative">
        <div className="relative flex items-center">
          <Input
            placeholder="Rechercher une espèce ou un lieu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
            {searchQuery ? (
              <button 
                onClick={() => setSearchQuery('')}
                className="text-sage-400 hover:text-sage-600 p-1"
                type="button"
              >
                <X className="w-4 h-4" />
              </button>
            ) : (
              <Search className="w-4 h-4 text-sage-400" />
            )}
          </div>
        </div>
      </div>

      {/* Observation List */}
      <div className="flex-1">
        {filteredObservations.length === 0 && searchQuery ? (
          <div className="text-center py-12 px-6">
            <p className="text-sm text-sage-600 font-sans">
              Aucun résultat pour « <span className="font-semibold">{searchQuery}</span> ».
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-3 text-xs font-semibold text-terracotta-600 hover:underline"
            >
              Effacer la recherche
            </button>
          </div>
        ) : (
          <ObservationList observations={filteredObservations} />
        )}
      </div>
    </div>
  );
};

export default ObservationsPage;
