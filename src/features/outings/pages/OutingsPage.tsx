import React from 'react';
import { Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { Map as MapIcon, Plus, MapPin, Calendar, Compass, ArrowRight } from 'lucide-react';
import { db } from '../../../db/database';
import { formatDate } from '../../../lib/date';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import EmptyState from '../../../components/ui/EmptyState';

export const OutingsPage: React.FC = () => {
  const outings = useLiveQuery(() => db.outings.orderBy('startedAt').reverse().toArray()) || [];
  const observations = useLiveQuery(() => db.observations.toArray()) || [];

  // Compute number of observations per outing
  const obsCountByOuting = new Map<string, number>();
  observations.forEach((obs) => {
    if (obs.outingId) {
      obsCountByOuting.set(obs.outingId, (obsCountByOuting.get(obs.outingId) || 0) + 1);
    }
  });

  return (
    <div className="flex flex-col gap-4 py-4 font-sans px-4">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-serif font-bold text-sage-950">
          Mes balades & sorties
        </h1>
        <Link to="/outings/add">
          <Button size="sm" className="flex items-center gap-1">
            <Plus className="w-4 h-4" />
            Nouvelle
          </Button>
        </Link>
      </div>

      {/* Outings List */}
      {outings.length === 0 ? (
        <EmptyState
          icon={<MapIcon className="w-10 h-10 text-sage-400" />}
          title="Aucune balade"
          description="Créez des balades (randonnées, sorties vélo, week-ends) pour y regrouper vos observations."
          action={
            <Link to="/outings/add">
              <Button size="sm" className="flex items-center gap-1">
                <Plus className="w-4 h-4" />
                Créer ma première balade
              </Button>
            </Link>
          }
        />
      ) : (
        <div className="flex flex-col gap-4 pb-8">
          {outings.map((outing) => {
            const count = obsCountByOuting.get(outing.id) || 0;
            return (
              <Card key={outing.id} className="hover:scale-[1.01] transition-transform duration-200">
                <Link to={`/outings/${outing.id}`} className="block p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-serif text-base font-bold text-sage-900 leading-snug">
                        {outing.name}
                      </h3>
                      
                      {/* Date */}
                      <div className="flex items-center gap-1.5 text-xs text-sage-500 mt-1">
                        <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                        <span>{formatDate(outing.startedAt, 'dd MMMM yyyy')}</span>
                      </div>

                      {/* Location */}
                      {outing.locationName && (
                        <div className="flex items-center gap-1.5 text-xs text-sage-600 mt-1">
                          <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-sage-400" />
                          <span className="truncate">{outing.locationName}</span>
                        </div>
                      )}
                    </div>

                    <ArrowRight className="w-5 h-5 text-sage-400 mt-0.5 flex-shrink-0" />
                  </div>

                  {/* Notes snippet */}
                  {outing.notes && (
                    <p className="text-xs text-sage-500 italic font-sans mt-3 line-clamp-1 border-l border-sand-200 pl-2">
                      « {outing.notes} »
                    </p>
                  )}

                  {/* Bottom counters */}
                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-sand-100">
                    <Badge variant="sage" className="text-[10px] py-0 px-2 flex items-center gap-1">
                      <Compass className="w-3 h-3 text-sage-500" />
                      {count} {count > 1 ? 'observations' : 'observation'}
                    </Badge>
                  </div>
                </Link>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OutingsPage;
