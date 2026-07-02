import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import ObservationForm from '../components/ObservationForm';
import { observationService } from '../services/observationService';
import { db } from '../../../db/database';
import Button from '../../../components/ui/Button';
import type { Observation } from '../types';

export const AddObservationPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill outingId if passed in URL query params (e.g. from an outing detail page)
  const outingIdParam = searchParams.get('outingId') || undefined;

  const handleSubmit = async (formData: Omit<Observation, 'id' | 'createdAt' | 'updatedAt'>) => {
    setIsSubmitting(true);
    try {
      const id = crypto.randomUUID();
      const now = new Date().toISOString();

      // Check if species is already in database, if not, add it for future autocomplete
      const exists = await db.species
        .filter((s) => s.commonName.toLowerCase() === formData.speciesName.toLowerCase())
        .first();

      if (!exists) {
        await db.species.add({
          id: formData.speciesName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
          commonName: formData.speciesName,
          emoji: '🪶'
        });
      }

      await observationService.addObservation({
        ...formData,
        id,
        createdAt: now,
        updatedAt: now
      });

      // Redirect
      if (formData.outingId) {
        navigate(`/outings/${formData.outingId}`);
      } else {
        navigate('/observations');
      }
    } catch (err) {
      console.error("Erreur lors de l'enregistrement de l'observation:", err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 py-4 font-sans">
      {/* Back navigation */}
      <div className="flex items-center gap-2 px-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="p-1 text-sage-600 hover:text-sage-900"
        >
          <ChevronLeft className="w-5 h-5" />
        </Button>
        <span className="font-serif text-lg font-bold text-sage-950">
          Noter une observation
        </span>
      </div>

      <ObservationForm
        onSubmit={handleSubmit}
        submitLabel="Enregistrer l'observation"
        isSubmitting={isSubmitting}
        initialData={{ outingId: outingIdParam }}
      />
    </div>
  );
};

export default AddObservationPage;
