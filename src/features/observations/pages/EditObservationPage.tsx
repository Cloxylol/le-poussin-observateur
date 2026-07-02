import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import ObservationForm from '../components/ObservationForm';
import { observationService } from '../services/observationService';
import Button from '../../../components/ui/Button';
import type { Observation } from '../types';

export const EditObservationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [observation, setObservation] = useState<Observation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadObservation() {
      if (!id) return;
      try {
        const data = await observationService.getObservationById(id);
        if (data) {
          setObservation(data);
        }
      } catch (err) {
        console.error("Erreur lors du chargement de l'observation:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadObservation();
  }, [id]);

  const handleSubmit = async (formData: Omit<Observation, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!id) return;
    setIsSubmitting(true);
    try {
      await observationService.updateObservation(id, formData);
      navigate(`/observations/${id}`);
    } catch (err) {
      console.error("Erreur lors de la modification de l'observation:", err);
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-sage-600 font-sans">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-sage-500 border-t-transparent mb-2"></div>
        <span>Chargement de l'observation...</span>
      </div>
    );
  }

  if (!observation) {
    return (
      <div className="p-8 text-center text-sage-700 font-sans">
        <p className="mb-4">L'observation demandée est introuvable.</p>
        <Button onClick={() => navigate('/observations')}>Retour aux observations</Button>
      </div>
    );
  }

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
          Modifier l'observation
        </span>
      </div>

      <ObservationForm
        initialData={observation}
        onSubmit={handleSubmit}
        submitLabel="Enregistrer les modifications"
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default EditObservationPage;
