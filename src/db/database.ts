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
    
    // Seed initial bird species if table is empty (handles pre-existing DBs)
    this.on('ready', async () => {
      try {
        const count = await this.species.count();
        if (count === 0) {
          await this.species.bulkAdd(INITIAL_BIRD_SPECIES);
        }
      } catch (err) {
        console.error("Erreur d'initialisation des espèces:", err);
      }
    });
  }
}

export const db = new PoussinObservateurDB();
