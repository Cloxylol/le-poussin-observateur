import { db } from '../../../db/database';
import type { Observation } from '../types';

export const observationService = {
  async getObservations(): Promise<Observation[]> {
    return db.observations.orderBy('observedAt').reverse().toArray();
  },

  async getObservationById(id: string): Promise<Observation | undefined> {
    return db.observations.get(id);
  },

  async addObservation(observation: Observation): Promise<string> {
    return db.observations.add(observation);
  },

  async updateObservation(id: string, observation: Partial<Observation>): Promise<number> {
    const updatedAt = new Date().toISOString();
    return db.observations.update(id, {
      ...observation,
      updatedAt
    });
  },

  async deleteObservation(id: string): Promise<void> {
    return db.observations.delete(id);
  },

  async getObservationsByOuting(outingId: string): Promise<Observation[]> {
    return db.observations.where('outingId').equals(outingId).toArray();
  }
};

export default observationService;
