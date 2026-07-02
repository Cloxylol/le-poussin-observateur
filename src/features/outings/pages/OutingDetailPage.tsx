import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { ChevronLeft, Trash2, Calendar, MapPin, Plus, Compass, NotepadText } from 'lucide-react';
import { db } from '../../../db/database';
import { outingService } from '../services/outingService';
import { formatDate } from '../../../lib/date';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import ObservationCard from '../../observations/components/ObservationCard';
import type { Outing } from '../types';

export const OutingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [outing, setOuting] = useState<Outing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  // Fetch outing details
  useEffect(() => {
    async function loadOuting() {
      if (!id) return;
      try {
        const data = await outingService.getOutingById(id);
        if (data) {
          setOuting(data);
        }
      } catch (err) {
        console.error("Erreur lors du chargement de la balade:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadOuting();
  }, [id]);

  // Query live observations associated with this outing
  const observations = useLiveQuery(async () => {
    if (!id) return [];
    return db.observations.where('outingId').equals(id).toArray();
  }, [id]) || [];

  const handleDelete = async () => {
    if (!id) return;
    try {
      await outingService.deleteOuting(id);
      navigate('/outings');
    } catch (err) {
      console.error("Erreur lors de la suppression de la balade:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-sage-600 font-sans">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-sage-500 border-t-transparent mb-2"></div>
        <span>Chargement de la balade...</span>
      </div>
    );
  }

  if (!outing) {
    return (
      <div className="p-8 text-center text-sage-700 font-sans">
        <p className="mb-4">La balade demandée est introuvable.</p>
        <Button onClick={() => navigate('/outings')}>Retour aux balades</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 py-4 font-sans px-4">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="p-1 text-sage-600 hover:text-sage-900"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowConfirmDelete(true)}
          className="text-terracotta-600 hover:text-terracotta-800 hover:bg-terracotta-50 py-1 px-3 border border-transparent rounded-xl"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Delete Confirmation Modal Overlay */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="p-6 max-w-sm w-full bg-sand-50 border border-sand-200 shadow-2xl flex flex-col gap-4">
            <h3 className="font-serif text-lg font-bold text-sage-950">Supprimer la balade</h3>
            <p className="text-sm text-sage-600 font-sans leading-relaxed">
              Êtes-vous sûr de vouloir supprimer définitivement la balade « <span className="font-semibold text-sage-800">{outing.name}</span> » ? Les observations associées ne seront pas supprimées mais seront dissociées de cette balade.
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

      {/* Outing Title / Profile */}
      <div>
        <h2 className="font-serif text-2xl font-black text-sage-950 mb-1 leading-snug">
          {outing.name}
        </h2>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="sage" className="flex items-center gap-1 text-[11px]">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(outing.startedAt, 'dd MMMM yyyy')}
          </Badge>
          {outing.locationName && (
            <Badge variant="river" className="flex items-center gap-1 text-[11px]">
              <MapPin className="w-3.5 h-3.5" />
              {outing.locationName}
            </Badge>
          )}
        </div>
      </div>

      {/* Outing Notes / Journal */}
      {outing.notes && (
        <Card variant="paper" className="p-4 bg-sand-100/30 border border-sand-200">
          <h3 className="font-serif text-sm font-bold text-sage-800 flex items-center gap-1.5 mb-2">
            <NotepadText className="w-4 h-4 text-sage-500" /> Carnet de route
          </h3>
          <p className="font-sans text-sm text-sage-700 leading-relaxed whitespace-pre-wrap italic">
            « {outing.notes} »
          </p>
        </Card>
      )}

      {/* Observations list */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-serif text-sm font-bold text-sage-800 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-sage-500" /> Observations de la balade
          </h3>
          
          <Link to={`/observations/add?outingId=${outing.id}`}>
            <Button size="sm" variant="outline" className="flex items-center gap-1 py-1 px-2.5 text-xs">
              <Plus className="w-3.5 h-3.5" /> Note
            </Button>
          </Link>
        </div>

        {observations.length === 0 ? (
          <Card variant="flat" className="p-8 text-center border border-dashed border-sand-200">
            <Compass className="w-8 h-8 text-sage-400 mx-auto mb-2" />
            <p className="text-xs text-sage-600 leading-relaxed font-sans mb-4">
              Aucun oiseau n'a été noté pour cette balade.
            </p>
            <Link to={`/observations/add?outingId=${outing.id}`}>
              <Button size="sm" className="inline-flex items-center gap-1 text-xs">
                <Plus className="w-4.5 h-4.5" /> Ajouter une observation
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {observations.map((obs) => (
              <ObservationCard key={obs.id} observation={obs} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OutingDetailPage;
