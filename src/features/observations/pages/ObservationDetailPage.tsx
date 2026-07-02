import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ChevronLeft, Edit2, Trash2, Calendar, MapPin, Eye, Compass, CalendarRange, Info } from 'lucide-react';
import { observationService } from '../services/observationService';
import { db } from '../../../db/database';
import { formatDate } from '../../../lib/date';
import { INITIAL_BIRD_SPECIES } from '../../../data/birdSpecies';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import type { Observation } from '../types';
import type { Outing } from '../../outings/types';

export const ObservationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [observation, setObservation] = useState<Observation | null>(null);
  const [outing, setOuting] = useState<Outing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    async function loadDetail() {
      if (!id) return;
      try {
        const obsData = await observationService.getObservationById(id);
        if (obsData) {
          setObservation(obsData);
          if (obsData.outingId) {
            const outingData = await db.outings.get(obsData.outingId);
            if (outingData) {
              setOuting(outingData);
            }
          }
        }
      } catch (err) {
        console.error("Erreur lors du chargement de l'observation:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadDetail();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    try {
      await observationService.deleteObservation(id);
      navigate('/observations');
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-sage-600 font-sans">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-sage-500 border-t-transparent mb-2"></div>
        <span>Chargement du carnet...</span>
      </div>
    );
  }

  if (!observation) {
    return (
      <div className="p-8 text-center text-sage-700 font-sans">
        <p className="mb-4">L'observation demandée n'existe pas ou a été supprimée.</p>
        <Button onClick={() => navigate('/observations')}>Retour au carnet</Button>
      </div>
    );
  }

  // Find species emoji
  const matchedSpecies = INITIAL_BIRD_SPECIES.find(
    (s) => s.commonName.toLowerCase() === observation.speciesName.toLowerCase()
  );
  const emoji = matchedSpecies?.emoji || '🪶';

  return (
    <div className="flex flex-col gap-5 py-4 font-sans px-4">
      {/* Header and Actions */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="p-1 text-sage-600 hover:text-sage-900"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        <div className="flex gap-2">
          <Link to={`/observations/edit/${observation.id}`}>
            <Button variant="outline" size="sm" className="flex items-center gap-1.5 py-1 px-3">
              <Edit2 className="w-3.5 h-3.5" />
              Modifier
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowConfirmDelete(true)}
            className="text-terracotta-600 hover:text-terracotta-800 hover:bg-terracotta-50 py-1 px-3 border border-transparent rounded-xl"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Modal Overlay */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="p-6 max-w-sm w-full bg-sand-50 border border-sand-200 shadow-2xl flex flex-col gap-4">
            <h3 className="font-serif text-lg font-bold text-sage-950">Supprimer l'observation</h3>
            <p className="text-sm text-sage-600 font-sans leading-relaxed">
              Êtes-vous sûr de vouloir effacer définitivement l'observation de « <span className="font-semibold text-sage-800">{observation.speciesName}</span> » ? Cette action est irréversible.
            </p>
            <div className="flex gap-3 mt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowConfirmDelete(false)}
              >
                Annuler
              </Button>
              <Button
                variant="danger"
                className="flex-1"
                onClick={handleDelete}
              >
                Supprimer
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Photo header / Large Emoji Header */}
      {observation.photo ? (
        <div className="relative rounded-2xl overflow-hidden border border-sand-200 aspect-video bg-sand-100 shadow-md">
          <img
            src={observation.photo}
            alt={observation.speciesName}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-3 left-3 bg-sand-50/90 backdrop-blur-sm w-10 h-10 rounded-full flex items-center justify-center text-xl shadow">
            {emoji}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-sage-50 border border-sage-100 p-8 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="text-6xl mb-3">{emoji}</div>
          <span className="text-[10px] text-sage-400 font-bold uppercase tracking-wider font-sans">
            Observation sans photo
          </span>
        </div>
      )}

      {/* Bird Species Title */}
      <div>
        <h2 className="font-serif text-2xl font-black text-sage-950 mb-1">
          {observation.speciesName}
        </h2>
        {observation.count && observation.count > 1 ? (
          <Badge variant="terracotta" className="font-mono text-sm py-0.5 px-3">
            Nombre d'individus : {observation.count}
          </Badge>
        ) : (
          <Badge variant="sage" className="font-sans text-xs">
            Individu solitaire
          </Badge>
        )}
      </div>

      {/* Details Box */}
      <Card variant="paper" className="p-4 flex flex-col gap-3.5 divide-y divide-sand-100">
        {/* Date and Time */}
        <div className="flex items-center gap-3 pt-0">
          <Calendar className="w-5 h-5 text-sage-500 flex-shrink-0" />
          <div className="font-sans">
            <p className="text-xs text-sage-400 font-semibold uppercase tracking-wider">Date de l'observation</p>
            <p className="text-sm font-medium text-sage-800">{formatDate(observation.observedAt)}</p>
          </div>
        </div>

        {/* Location & GPS Link */}
        <div className="flex items-center gap-3 pt-3.5">
          <MapPin className="w-5 h-5 text-sage-500 flex-shrink-0" />
          <div className="font-sans flex-1 min-w-0">
            <p className="text-xs text-sage-400 font-semibold uppercase tracking-wider">Lieu d'observation</p>
            <p className="text-sm font-medium text-sage-800 truncate">{observation.locationName || 'Non renseigné'}</p>
            {observation.latitude !== undefined && observation.longitude !== undefined && (
              <a
                href={`https://www.openstreetmap.org/?mlat=${observation.latitude}&mlon=${observation.longitude}#map=16/${observation.latitude}/${observation.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-river-600 hover:underline flex items-center gap-0.5 mt-1"
              >
                Voir sur la carte (GPS : {observation.latitude.toFixed(4)}, {observation.longitude.toFixed(4)})
              </a>
            )}
          </div>
        </div>

        {/* Outing connection */}
        {outing && (
          <div className="flex items-center gap-3 pt-3.5">
            <CalendarRange className="w-5 h-5 text-sage-500 flex-shrink-0" />
            <div className="font-sans flex-1 min-w-0">
              <p className="text-xs text-sage-400 font-semibold uppercase tracking-wider">Balade associée</p>
              <Link
                to={`/outings/${outing.id}`}
                className="text-sm font-semibold text-terracotta-600 hover:underline truncate block"
              >
                {outing.name}
              </Link>
            </div>
          </div>
        )}

        {/* Behavior & Habitat details */}
        {(observation.behavior || observation.habitat) && (
          <div className="flex flex-wrap gap-2 pt-3.5">
            {observation.behavior && (
              <Badge variant="sage" className="py-1 px-3 text-xs flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-sage-600" />
                Comportement : <span className="font-semibold">{observation.behavior}</span>
              </Badge>
            )}
            {observation.habitat && (
              <Badge variant="river" className="py-1 px-3 text-xs flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-river-600" />
                Habitat : <span className="font-semibold">{observation.habitat}</span>
              </Badge>
            )}
          </div>
        )}
      </Card>

      {/* Free notes */}
      {observation.notes && (
        <div className="flex flex-col gap-2">
          <h3 className="font-serif text-sm font-bold text-sage-800 flex items-center gap-1 px-1">
            <Info className="w-4 h-4 text-sage-500" /> Notes de terrain
          </h3>
          <Card variant="flat" className="p-4 bg-sand-100/40 border border-sand-200">
            <p className="font-sans text-sm text-sage-800 leading-relaxed whitespace-pre-wrap italic">
              « {observation.notes} »
            </p>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ObservationDetailPage;
