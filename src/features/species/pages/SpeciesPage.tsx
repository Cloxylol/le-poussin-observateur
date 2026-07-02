import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { Search, Eye, Calendar, X } from 'lucide-react';
import { db } from '../../../db/database';
import { INITIAL_BIRD_SPECIES } from '../../../data/birdSpecies';
import { formatDate } from '../../../lib/date';
import Input from '../../../components/ui/Input';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import EmptyState from '../../../components/ui/EmptyState';

interface SpeciesStat {
  name: string;
  emoji: string;
  count: number;
  firstSeenAt: string;
}

export const SpeciesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch all observations to compute stats
  const observations = useLiveQuery(() => db.observations.toArray()) || [];

  // Compute stats per species
  const speciesStatsMap = new Map<string, { count: number; firstSeenAt: string }>();
  
  observations.forEach((obs) => {
    const key = obs.speciesName.trim();
    const existing = speciesStatsMap.get(key);
    
    if (existing) {
      existing.count += obs.count || 1;
      if (new Date(obs.observedAt).getTime() < new Date(existing.firstSeenAt).getTime()) {
        existing.firstSeenAt = obs.observedAt;
      }
    } else {
      speciesStatsMap.set(key, {
        count: obs.count || 1,
        firstSeenAt: obs.observedAt
      });
    }
  });

  // Convert map to array and match emoji
  const speciesStats: SpeciesStat[] = Array.from(speciesStatsMap.entries()).map(
    ([name, stats]) => {
      const matchedSpecies = INITIAL_BIRD_SPECIES.find(
        (s) => s.commonName.toLowerCase() === name.toLowerCase()
      );
      return {
        name,
        emoji: matchedSpecies?.emoji || '🪶',
        count: stats.count,
        firstSeenAt: stats.firstSeenAt
      };
    }
  );

  // Filter based on search query
  const filteredStats = speciesStats.filter((stat) =>
    stat.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  // Sort: count descending, then name alphabetically
  const sortedStats = filteredStats.sort((a, b) => {
    if (b.count !== a.count) {
      return b.count - a.count;
    }
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="flex flex-col gap-4 py-4 font-sans px-4">
      <h1 className="text-xl font-serif font-bold text-sage-950">
        Espèces observées
      </h1>

      {/* Search Input */}
      <div className="relative flex items-center">
        <Input
          placeholder="Rechercher une espèce vue..."
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

      {/* Grid of stats */}
      {sortedStats.length === 0 ? (
        searchQuery ? (
          <div className="text-center py-12">
            <p className="text-sm text-sage-600">
              Aucune espèce observée ne correspond à « <span className="font-semibold">{searchQuery}</span> ».
            </p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-3 text-xs font-semibold text-terracotta-600 hover:underline"
            >
              Effacer la recherche
            </button>
          </div>
        ) : (
          <EmptyState
            icon={<Eye className="w-10 h-10 text-sage-400" />}
            title="Aucune espèce"
            description="La liste des espèces observées s'enrichira au fil de vos excursions."
          />
        )
      ) : (
        <div className="grid grid-cols-1 gap-3 pb-8">
          {sortedStats.map((stat) => (
            <Card key={stat.name} className="hover:scale-[1.01] transition-transform duration-200">
              <Link 
                to={`/species/${encodeURIComponent(stat.name)}`}
                className="flex items-center gap-4 p-4"
              >
                {/* Emoji Circle */}
                <div className="w-12 h-12 rounded-full bg-sage-50 border border-sage-100 flex items-center justify-center text-2xl shadow-sm flex-shrink-0">
                  {stat.emoji}
                </div>

                {/* Info details */}
                <div className="flex-1 min-w-0 font-sans">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-sage-900 truncate">
                      {stat.name}
                    </h3>
                    <Badge variant="terracotta" className="font-mono text-xs flex-shrink-0 font-bold">
                      {stat.count} obs.
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-1 text-[11px] text-sage-500 mt-1">
                    <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">
                      Première vue : {formatDate(stat.firstSeenAt, 'dd MMM yyyy')}
                    </span>
                  </div>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SpeciesPage;
