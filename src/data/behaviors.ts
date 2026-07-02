export interface Behavior {
  id: string;
  label: string;
}

export const BEHAVIORS: Behavior[] = [
  { id: 'posé', label: 'Posé' },
  { id: 'en_vol', label: 'En vol' },
  { id: 'chante', label: 'Chante' },
  { id: 'pêche', label: 'Pêche' },
  { id: 'se_nourrit', label: 'Se nourrit' },
  { id: 'autre', label: 'Autre' }
];
