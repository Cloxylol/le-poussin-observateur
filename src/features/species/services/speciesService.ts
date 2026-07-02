import { db } from '../../../db/database';
import type { BirdSpecies } from '../types';

export const speciesService = {
  async getSpecies(): Promise<BirdSpecies[]> {
    return db.species.toArray();
  },

  async getSpeciesById(id: string): Promise<BirdSpecies | undefined> {
    return db.species.get(id);
  },

  async searchSpecies(query: string): Promise<BirdSpecies[]> {
    if (!query) return this.getSpecies();
    const normalizedQuery = query.toLowerCase().trim();
    return db.species
      .filter((s) => s.commonName.toLowerCase().includes(normalizedQuery))
      .toArray();
  }
};

export default speciesService;
