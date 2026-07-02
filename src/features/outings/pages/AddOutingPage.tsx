import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Save } from 'lucide-react';
import { outingService } from '../services/outingService';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Textarea from '../../../components/ui/Textarea';

export const AddOutingPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState('');
  const [startedAt, setStartedAt] = useState(
    new Date().toISOString().substring(0, 16)
  );
  const [locationName, setLocationName] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg("Le nom de la balade est obligatoire.");
      return;
    }

    setIsSubmitting(true);
    try {
      const id = crypto.randomUUID();
      const now = new Date().toISOString();

      await outingService.addOuting({
        id,
        name: name.trim(),
        startedAt: new Date(startedAt).toISOString(),
        locationName: locationName.trim() || undefined,
        notes: notes.trim() || undefined,
        createdAt: now,
        updatedAt: now
      });

      navigate('/outings');
    } catch (err) {
      console.error("Erreur lors de la création de la balade:", err);
      setErrorMsg("Une erreur est survenue lors de l'enregistrement.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 py-4 font-sans px-4">
      {/* Back nav */}
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
          Créer une balade
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 pb-12">
        {errorMsg && (
          <div className="bg-terracotta-50 border border-terracotta-200 text-terracotta-700 px-4 py-3 rounded-2xl text-xs font-sans">
            {errorMsg}
          </div>
        )}

        {/* Name */}
        <Input
          label="Nom de la balade *"
          placeholder="Ex: Randonnée du Vercors, Sortie au marais..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Date */}
        <Input
          label="Date de début"
          type="datetime-local"
          value={startedAt}
          onChange={(e) => setStartedAt(e.target.value)}
        />

        {/* Location */}
        <Input
          label="Lieu général"
          placeholder="Ex: Isère, Dombes..."
          value={locationName}
          onChange={(e) => setLocationName(e.target.value)}
        />

        {/* Notes */}
        <Textarea
          label="Notes / Carnet de route"
          placeholder="Détails du parcours, météo, participants..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={5}
        />

        {/* Actions */}
        <div className="pt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 font-serif text-base py-3"
          >
            <Save className="w-5 h-5" />
            {isSubmitting ? 'Création...' : 'Créer la balade'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddOutingPage;
