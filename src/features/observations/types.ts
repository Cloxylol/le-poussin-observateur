export interface Observation {
  id: string;
  speciesName: string;
  observedAt: string; // ISO string
  locationName?: string;
  latitude?: number;
  longitude?: number;
  count?: number;
  behavior?: string;
  habitat?: string;
  notes?: string;
  photo?: string; // base64 encoded image or path
  outingId?: string;
  createdAt: string;
  updatedAt: string;
}
