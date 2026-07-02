import React from 'react';
import { Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { Plus, Compass, Sparkles, Feather } from 'lucide-react';
import { db } from '../../../db/database';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import ObservationCard from '../../observations/components/ObservationCard';

export const HomePage: React.FC = () => {
  // Query observations from Dexie
  const observations = useLiveQuery(() => db.observations.toArray()) || [];

  // Compute stats
  const totalObservations = observations.length;

  // Extract unique species names
  const uniqueSpecies = new Set(
    observations.map((obs) => obs.speciesName.trim().toLowerCase())
  );
  const uniqueSpeciesCount = uniqueSpecies.size;

  // Get last observation by observedAt date
  const sortedObservations = [...observations].sort(
    (a, b) => new Date(b.observedAt).getTime() - new Date(a.observedAt).getTime()
  );
  const lastObservation = sortedObservations[0];

  // Soft nature quotes for the travel diary feel
  const quotes = [
    "« La nature n'est pas un endroit à visiter. C'est notre maison. » — Gary Snyder",
    "« Trois détails d'oiseau font le printemps. » — Christian Bobin",
    "« Les oiseaux ont inventé les chansons pour que nous sachions qu'ils existent. »",
    "« Pour voir un oiseau, il faut faire partie du silence. » — Robert Lynd",
    "« L'oiseau a son nid, l'araignée sa toile, et l'homme l'amitié. » — William Blake"
  ];

  // Pick a random quote based on the day or random index
  const today = new Date().getDate();
  const selectedQuote = quotes[today % quotes.length];

  return (
    <div className="flex flex-col gap-6 px-4 py-4 pb-12 font-sans">
      {/* Welcome Banner */}
      <div className="bg-sage-50 border border-sage-100 rounded-2xl p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-15">
          <Feather className="w-20 h-20 text-sage-600 rotate-45" />
        </div>
        <h2 className="font-serif text-xl font-bold text-sage-950 mb-1 flex items-center gap-1.5">
          Nos belles rencontres <Sparkles className="w-5 h-5 text-terracotta-500" />
        </h2>
        <p className="text-xs text-sage-600 leading-relaxed max-w-[85%] font-sans">
          Note tes observations en chemin et garde la mémoire de chaque chant, chaque nid et chaque envolée sauvage.
        </p>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-2 gap-4">
        <Card variant="paper" className="p-4 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-serif font-black text-sage-600 mb-1">
            {totalObservations}
          </span>
          <span className="text-[11px] font-semibold tracking-wide uppercase text-sage-500 font-sans">
            Observations
          </span>
        </Card>

        <Card variant="paper" className="p-4 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-serif font-black text-terracotta-500 mb-1">
            {uniqueSpeciesCount}
          </span>
          <span className="text-[11px] font-semibold tracking-wide uppercase text-sage-500 font-sans">
            Espèces Vues
          </span>
        </Card>
      </div>

      {/* CTA Button */}
      <Link to="/observations/add" className="w-full">
        <Button className="w-full py-3.5 flex items-center justify-center gap-2 font-serif text-base shadow-lg shadow-sage-600/25">
          <Plus className="w-5 h-5" />
          Nouvelle observation
        </Button>
      </Link>

      {/* Last Observation */}
      <div className="flex flex-col gap-3">
        <h3 className="font-serif text-sm font-bold text-sage-800 px-1">
          Dernière observation
        </h3>
        {lastObservation ? (
          <ObservationCard observation={lastObservation} />
        ) : (
          <Card variant="flat" className="p-8 text-center border border-dashed border-sand-200">
            <Compass className="w-8 h-8 text-sage-400 mx-auto mb-2" />
            <p className="text-xs text-sage-600 leading-relaxed font-sans mb-3">
              Aucun oiseau n'a encore été observé. Sors tes jumelles !
            </p>
          </Card>
        )}
      </div>

      {/* Poetry Quote */}
      <div className="mt-4 text-center px-4">
        <p className="font-serif italic text-xs text-sage-500 leading-relaxed">
          {selectedQuote}
        </p>
      </div>
    </div>
  );
};

export default HomePage;
