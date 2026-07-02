import { db } from '../../../db/database';
import type { Outing } from '../types';

export const outingService = {
  async getOutings(): Promise<Outing[]> {
    return db.outings.orderBy('startedAt').reverse().toArray();
  },

  async getOutingById(id: string): Promise<Outing | undefined> {
    return db.outings.get(id);
  },

  async addOuting(outing: Outing): Promise<string> {
    return db.outings.add(outing);
  },

  async deleteOuting(id: string): Promise<void> {
    // Transaction to delete outing and dissociate its observations
    return db.transaction('rw', [db.outings, db.observations], async () => {
      await db.outings.delete(id);
      await db.observations.where('outingId').equals(id).modify({ outingId: undefined });
    });
  }
};

export default outingService;
