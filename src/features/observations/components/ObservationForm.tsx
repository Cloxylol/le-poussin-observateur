import React, { useState, useEffect, useRef } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { MapPin, Camera, Trash2, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { db } from '../../../db/database';
import { BEHAVIORS } from '../../../data/behaviors';
import { HABITATS } from '../../../data/habitats';
import { useGeolocation } from '../../../hooks/useGeolocation';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Textarea from '../../../components/ui/Textarea';
import Card from '../../../components/ui/Card';
import type { Observation } from '../types';

interface ObservationFormProps {
  initialData?: Partial<Observation>;
  onSubmit: (data: Omit<Observation, 'id' | 'createdAt' | 'updatedAt'>) => void;
  submitLabel: string;
  isSubmitting?: boolean;
}

export const ObservationForm: React.FC<ObservationFormProps> = ({
  initialData,
  onSubmit,
  submitLabel,
  isSubmitting = false
}) => {
  // Queries
  const speciesList = useLiveQuery(() => db.species.toArray()) || [];
  const outingsList = useLiveQuery(() => db.outings.toArray()) || [];

  // Form State
  const [speciesName, setSpeciesName] = useState(initialData?.speciesName || '');
  const [observedAt, setObservedAt] = useState(
    initialData?.observedAt 
      ? initialData.observedAt.substring(0, 16) // Convert ISO to datetime-local format YYYY-MM-DDTHH:MM
      : new Date().toISOString().substring(0, 16)
  );
  const [locationName, setLocationName] = useState(initialData?.locationName || '');
  const [count, setCount] = useState<number>(initialData?.count || 1);
  const [behavior, setBehavior] = useState(initialData?.behavior || '');
  const [habitat, setHabitat] = useState(initialData?.habitat || '');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [photo, setPhoto] = useState<string | undefined>(initialData?.photo);
  const [outingId, setOutingId] = useState(initialData?.outingId || '');

  // GPS State
  const [latitude, setLatitude] = useState<number | undefined>(initialData?.latitude);
  const [longitude, setLongitude] = useState<number | undefined>(initialData?.longitude);
  const { latitude: gpsLat, longitude: gpsLng, loading: gpsLoading, error: gpsError, getPosition } = useGeolocation();

  // Autocomplete State
  const [suggestions, setSuggestions] = useState<typeof speciesList>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const autocompleteRef = useRef<HTMLDivElement>(null);

  // Error State
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync GPS coordinate changes
  useEffect(() => {
    if (gpsLat !== null && gpsLng !== null && gpsLat !== undefined && gpsLng !== undefined) {
      setLatitude(gpsLat);
      setLongitude(gpsLng);
    }
  }, [gpsLat, gpsLng]);

  // Handle autocomplete click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update suggestions on speciesName change
  const handleSpeciesNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSpeciesName(val);
    if (!val.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const filtered = speciesList.filter(s => 
      s.commonName.toLowerCase().includes(val.toLowerCase())
    );
    setSuggestions(filtered);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (name: string) => {
    setSpeciesName(name);
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // Image Upload and Compression
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressed = await compressImage(file);
      setPhoto(compressed);
    } catch {
      setErrorMsg("Impossible de compresser la photo.");
    }
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
          }
          resolve(canvas.toDataURL('image/jpeg', 0.75));
        };
        img.onerror = () => reject(new Error("Image error"));
        img.src = event.target?.result as string;
      };
      reader.onerror = () => reject(new Error("Reader error"));
      reader.readAsDataURL(file);
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!speciesName.trim()) {
      setErrorMsg("L'espèce observée est obligatoire.");
      return;
    }

    onSubmit({
      speciesName: speciesName.trim(),
      observedAt: new Date(observedAt).toISOString(),
      locationName: locationName.trim() || undefined,
      latitude,
      longitude,
      count: count > 0 ? count : 1,
      behavior: behavior || undefined,
      habitat: habitat || undefined,
      notes: notes.trim() || undefined,
      photo,
      outingId: outingId || undefined
    });
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-5 px-4 pb-12">
      {errorMsg && (
        <div className="bg-terracotta-50 border border-terracotta-200 text-terracotta-700 px-4 py-3 rounded-2xl flex items-center gap-2 text-sm font-sans">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Espèce (Autocomplete) */}
      <div className="relative" ref={autocompleteRef}>
        <Input
          label="Espèce d'oiseau *"
          placeholder="Saisissez ou sélectionnez l'espèce..."
          value={speciesName}
          onChange={handleSpeciesNameChange}
          onFocus={() => {
            if (speciesList.length > 0 && speciesName.trim()) {
              const filtered = speciesList.filter(s => 
                s.commonName.toLowerCase().includes(speciesName.toLowerCase())
              );
              setSuggestions(filtered);
              setShowSuggestions(true);
            }
          }}
          autoComplete="off"
        />
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute z-50 left-0 right-0 mt-1 max-h-56 overflow-y-auto bg-sand-50 border border-sand-200 rounded-xl shadow-lg divide-y divide-sand-100 font-sans text-sm">
            {suggestions.map((s) => (
              <li
                key={s.id}
                onClick={() => handleSuggestionClick(s.commonName)}
                className="px-4 py-2.5 hover:bg-sage-50 cursor-pointer flex items-center justify-between text-sage-950 transition-colors"
              >
                <span>{s.commonName}</span>
                <span className="text-base">{s.emoji || '🪶'}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Date et Heure */}
      <Input
        label="Date et heure de l'observation"
        type="datetime-local"
        value={observedAt}
        onChange={(e) => setObservedAt(e.target.value)}
      />

      {/* Lieu */}
      <Input
        label="Lieu textuel"
        placeholder="Ex: Lac de Miribel, Parc de la Tête d'Or..."
        value={locationName}
        onChange={(e) => setLocationName(e.target.value)}
      />

      {/* Géolocalisation */}
      <Card variant="flat" className="p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-sage-800 tracking-wide font-sans">
            Coordonnées géographiques (GPS)
          </span>
          {latitude !== undefined && longitude !== undefined && (
            <span className="flex items-center gap-1 text-xs font-medium text-sage-600 bg-sage-100 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" /> Géolocalisé
            </span>
          )}
        </div>

        {latitude !== undefined && longitude !== undefined ? (
          <div className="flex items-center justify-between text-sm font-sans text-sage-700 bg-sand-50 border border-sand-200 px-3 py-2 rounded-xl">
            <span className="font-mono text-xs">
              Lat: {latitude.toFixed(5)}, Lng: {longitude.toFixed(5)}
            </span>
            <button
              type="button"
              onClick={() => {
                setLatitude(undefined);
                setLongitude(undefined);
              }}
              className="text-terracotta-600 hover:text-terracotta-800 text-xs font-medium"
            >
              Supprimer
            </button>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={getPosition}
            disabled={gpsLoading}
            className="w-full flex items-center justify-center gap-2 py-2"
          >
            <MapPin className={`w-4 h-4 ${gpsLoading ? 'animate-bounce' : ''}`} />
            {gpsLoading ? 'Localisation en cours...' : 'Utiliser ma position actuelle'}
          </Button>
        )}

        {gpsError && (
          <span className="text-xs font-medium text-terracotta-600 px-1 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> {gpsError}
          </span>
        )}
      </Card>

      {/* Nombre d'individus */}
      <Input
        label="Nombre d'individus"
        type="number"
        min="1"
        value={count}
        onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
      />

      {/* Comportement & Habitat */}
      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Comportement"
          options={BEHAVIORS.map(b => ({ value: b.id, label: b.label }))}
          value={behavior}
          onChange={(e) => setBehavior(e.target.value)}
          placeholder="Non spécifié"
        />

        <Select
          label="Habitat"
          options={HABITATS.map(h => ({ value: h.id, label: h.label }))}
          value={habitat}
          onChange={(e) => setHabitat(e.target.value)}
          placeholder="Non spécifié"
        />
      </div>

      {/* Association à une sortie */}
      <Select
        label="Associer à une sortie / balade"
        options={outingsList.map(o => ({ value: o.id, label: o.name }))}
        value={outingId}
        onChange={(e) => setOutingId(e.target.value)}
        placeholder="Aucune balade associée"
      />

      {/* Photo */}
      <Card variant="flat" className="p-4 flex flex-col gap-3">
        <span className="text-xs font-semibold text-sage-800 tracking-wide font-sans">
          Photo de l'observation (optionnelle)
        </span>

        {photo ? (
          <div className="relative rounded-xl overflow-hidden border border-sand-200 aspect-video bg-sand-100">
            <img src={photo} alt="Aperçu" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => setPhoto(undefined)}
              className="absolute top-2 right-2 bg-terracotta-600 text-sand-50 p-2 rounded-full shadow-lg hover:bg-terracotta-700 active:scale-95 transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label className="border-2 border-dashed border-sand-300 hover:border-sage-400 bg-sand-50/50 hover:bg-sage-50/30 rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all">
            <Camera className="w-8 h-8 text-sage-400" />
            <span className="text-xs font-medium text-sage-600 font-sans">Prendre / Choisir une photo</span>
            <span className="text-[10px] text-sage-400 font-sans">Taille max optimisée automatiquement</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />
          </label>
        )}
      </Card>

      {/* Notes */}
      <Textarea
        label="Notes libres"
        placeholder="Écrivez vos impressions, la météo, la chant, etc..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={4}
      />

      {/* Actions */}
      <div className="pt-2">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 font-serif text-base py-3"
        >
          <Sparkles className="w-5 h-5 text-sand-100" />
          {isSubmitting ? 'Enregistrement...' : submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default ObservationForm;
