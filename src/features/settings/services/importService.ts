import { db } from '../../../db/database';
import type { Observation } from '../../observations/types';
import type { Outing } from '../../outings/types';

export interface ImportPayload {
  app: string;
  version: number;
  data: {
    observations?: Observation[];
    outings?: Outing[];
  };
}

export const importService = {
  async importData(jsonString: string): Promise<{ success: boolean; error?: string }> {
    try {
      const payload = JSON.parse(jsonString) as ImportPayload;
      
      // Validation minimale
      if (!payload || (payload.app !== 'plumes-and-balades' && payload.app !== 'poussin-observateur')) {
        return { 
          success: false, 
          error: "Fichier invalide : ce n'est pas un fichier de sauvegarde Le Poussin Observateur." 
        };
      }
      
      const { observations = [], outings = [] } = payload.data || {};
      
      // Exécution dans une transaction Dexie
      await db.transaction('rw', [db.observations, db.outings], async () => {
        await db.observations.clear();
        await db.outings.clear();
        
        if (outings.length > 0) {
          await db.outings.bulkAdd(outings);
        }
        if (observations.length > 0) {
          await db.observations.bulkAdd(observations);
        }
      });
      
      return { success: true };
    } catch (e: any) {
      return { 
        success: false, 
        error: e.message || "Erreur de format lors de la lecture du fichier JSON." 
      };
    }
  }
};

export default importService;
