import Dexie, { type Table } from 'dexie';
import { DB_NAME, DB_VERSION, SCHEMA } from './schema';
import type { Observation } from '../features/observations/types';
import type { Outing } from '../features/outings/types';
import type { BirdSpecies } from '../features/species/types';
import { INITIAL_BIRD_SPECIES } from '../data/birdSpecies';

export class PoussinObservateurDB extends Dexie {
  observations!: Table<Observation, string>;
  outings!: Table<Outing, string>;
  species!: Table<BirdSpecies, string>;

  constructor() {
    super(DB_NAME);
    this.version(DB_VERSION).stores(SCHEMA);
    
    // Seed initial bird species on creation
    this.on('populate', () => {
      this.species.bulkAdd(INITIAL_BIRD_SPECIES);
    });
  }
}

export const db = new PoussinObservateurDB();
