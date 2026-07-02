export const DB_NAME = 'PoussinObservateurDB';
export const DB_VERSION = 1;

export const SCHEMA = {
  observations: 'id, speciesName, observedAt, outingId, createdAt',
  outings: 'id, name, startedAt, createdAt',
  species: 'id, commonName'
};
