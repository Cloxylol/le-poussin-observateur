import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { ChevronLeft, Info } from 'lucide-react';
import { db } from '../../../db/database';
import { INITIAL_BIRD_SPECIES } from '../../../data/birdSpecies';
import Button from '../../../components/ui/Button';
import ObservationCard from '../../observations/components/ObservationCard';

export const SpeciesDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // The ID here is the speciesName
  const navigate = useNavigate();

  const speciesName = id ? decodeURIComponent(id) : '';

  // Get all observations matching this species name
  const observations = useLiveQuery(async () => {
    if (!speciesName) return [];
    return db.observations
      .filter((o) => o.speciesName.toLowerCase() === speciesName.toLowerCase())
      .reverse() // sorted chronologically descending
      .toArray();
  }, [speciesName]) || [];

  // Match emoji & information from static list
  const matchedSpecies = INITIAL_BIRD_SPECIES.find(
    (s) => s.commonName.toLowerCase() === speciesName.toLowerCase()
  );
  
  const emoji = matchedSpecies?.emoji || '🪶';

  return (
    <div className="flex flex-col gap-5 py-4 font-sans px-4">
      {/* Back Header */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="p-1 text-sage-600 hover:text-sage-900"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <span className="font-serif text-lg font-bold text-sage-950">
          Fiche Espèce
        </span>
      </div>

      {/* Header Profile */}
      <div className="bg-sage-50 border border-sage-100 rounded-2xl p-6 flex flex-col items-center justify-center text-center shadow-sm">
        <div className="text-6xl mb-3 shadow-inner p-4 bg-sand-50 rounded-full w-24 h-24 flex items-center justify-center border border-sage-100/50">
          {emoji}
        </div>
        <h2 className="font-serif text-xl font-bold text-sage-950 mb-1">
          {speciesName}
        </h2>
        <span className="text-xs font-semibold text-terracotta-600 bg-terracotta-50 px-3 py-0.5 rounded-full border border-terracotta-100 font-sans">
          {observations.length} {observations.length > 1 ? 'observations' : 'observation'}
        </span>
      </div>

      {/* Timeline Section */}
      <div className="flex flex-col gap-3">
        <h3 className="font-serif text-sm font-bold text-sage-800 flex items-center gap-1.5 px-1">
          <Info className="w-4 h-4 text-sage-500" /> Historique des observations
        </h3>
        
        <div className="space-y-4">
          {observations.map((obs) => (
            <ObservationCard key={obs.id} observation={obs} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SpeciesDetailPage;
