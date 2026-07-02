import { useState, useCallback } from 'react';

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    latitude: null,
    longitude: null,
    error: null,
    loading: false
  });

  const getPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: "La géolocalisation n'est pas supportée par votre navigateur."
      }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
          loading: false
        });
      },
      (error) => {
        let errorMsg = "Une erreur est survenue lors de la géolocalisation.";
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = "L'accès à la localisation a été refusé.";
        }
        setState((prev) => ({
          ...prev,
          error: errorMsg,
          loading: false
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  }, []);

  const clearPosition = useCallback(() => {
    setState({
      latitude: null,
      longitude: null,
      error: null,
      loading: false
    });
  }, []);

  return { ...state, getPosition, clearPosition };
};

export default useGeolocation;
