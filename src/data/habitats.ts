export interface Habitat {
  id: string;
  label: string;
}

export const HABITATS: Habitat[] = [
  { id: 'lac', label: 'Lac' },
  { id: 'rivière', label: 'Rivière' },
  { id: 'forêt', label: 'Forêt' },
  { id: 'champ', label: 'Champ' },
  { id: 'ville', label: 'Ville' },
  { id: 'montagne', label: 'Montagne' },
  { id: 'zone_humide', label: 'Zone humide' },
  { id: 'autre', label: 'Autre' }
];
