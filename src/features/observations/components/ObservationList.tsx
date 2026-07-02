import React from 'react';
import { Compass, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import ObservationCard from './ObservationCard';
import EmptyState from '../../../components/ui/EmptyState';
import Button from '../../../components/ui/Button';
import type { Observation } from '../types';

interface ObservationListProps {
  observations: Observation[];
}

export const ObservationList: React.FC<ObservationListProps> = ({ observations }) => {
  if (observations.length === 0) {
    return (
      <EmptyState
        icon={<Compass className="w-10 h-10 text-sage-400" />}
        title="Aucune observation"
        description="Vous n'avez pas encore enregistré d'observation d'oiseaux."
        action={
          <Link to="/observations/add">
            <Button size="sm" className="flex items-center gap-1">
              <Plus className="w-4 h-4" />
              Noter ma première observation
            </Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-4 px-4 pb-8">
      {observations.map((obs) => (
        <ObservationCard key={obs.id} observation={obs} />
      ))}
    </div>
  );
};

export default ObservationList;
