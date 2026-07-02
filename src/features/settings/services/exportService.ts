import { db } from '../../../db/database';

export const exportService = {
  async exportData(): Promise<void> {
    const observations = await db.observations.toArray();
    const outings = await db.outings.toArray();
    
    const exportPayload = {
      app: 'poussin-observateur',
      version: 1,
      exportedAt: new Date().toISOString(),
      data: {
        observations,
        outings
      }
    };
    
    const jsonString = JSON.stringify(exportPayload, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    const dateStr = new Date().toISOString().split('T')[0];
    link.download = `poussin_observateur_backup_${dateStr}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

export default exportService;
