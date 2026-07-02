import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Eye, Compass, Image as ImageIcon } from 'lucide-react';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import { formatDate, formatRelativeTime } from '../../../lib/date';
import { INITIAL_BIRD_SPECIES } from '../../../data/birdSpecies';
import type { Observation } from '../types';

interface ObservationCardProps {
  observation: Observation;
}

export const ObservationCard: React.FC<ObservationCardProps> = ({
  observation
}) => {
  // Find matching emoji
  const matchedSpecies = INITIAL_BIRD_SPECIES.find(
    (s) => s.commonName.toLowerCase() === observation.speciesName.toLowerCase()
  );
  const emoji = matchedSpecies?.emoji || '🪶';

  return (
    <Card className="hover:scale-[1.01] transition-transform duration-200">
      <Link to={`/observations/${observation.id}`} className="block">
        <div className="flex gap-4 p-4">
          {/* Photo Thumbnail / Emoji */}
          <div className="flex-shrink-0">
            {observation.photo ? (
              <div className="w-16 h-16 rounded-xl overflow-hidden border border-sand-200">
                <img 
                  src={observation.photo} 
                  alt={observation.speciesName} 
                  className="w-full h-full object-cover" 
                />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-xl bg-sage-50 border border-sage-100 flex items-center justify-center text-3xl shadow-sm">
                {emoji}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-1">
                <h3 className="font-serif text-base font-bold text-sage-900 truncate">
                  {observation.speciesName}
                </h3>
                {observation.count && observation.count > 1 && (
                  <Badge variant="terracotta" className="flex-shrink-0 font-mono">
                    x{observation.count}
                  </Badge>
                )}
              </div>

              {/* Date / Time */}
              <div className="flex items-center gap-1.5 text-xs text-sage-500 mt-1 font-sans">
                <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate" title={formatDate(observation.observedAt)}>
                  {formatRelativeTime(observation.observedAt)}
                </span>
              </div>

              {/* Location */}
              {observation.locationName && (
                <div className="flex items-center gap-1.5 text-xs text-sage-600 mt-1 font-sans">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-sage-400" />
                  <span className="truncate">{observation.locationName}</span>
                </div>
              )}
            </div>

            {/* Badges/Tags */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {observation.behavior && (
                <Badge variant="sage" className="text-[10px] py-0 px-2 flex items-center gap-1">
                  <Eye className="w-3 h-3 text-sage-500" />
                  {observation.behavior}
                </Badge>
              )}
              {observation.habitat && (
                <Badge variant="river" className="text-[10px] py-0 px-2 flex items-center gap-1">
                  <Compass className="w-3 h-3 text-river-500" />
                  {observation.habitat}
                </Badge>
              )}
              {observation.photo && (
                <Badge variant="sand" className="text-[10px] py-0 px-2 flex items-center gap-1">
                  <ImageIcon className="w-3 h-3 text-sand-600" />
                  Photo
                </Badge>
              )}
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default ObservationCard;
