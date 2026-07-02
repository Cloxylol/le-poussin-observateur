import React, { useState, useRef } from 'react';
import { Download, Upload, Trash2, ShieldAlert, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import exportService from '../services/exportService';
import importService from '../services/importService';
import { db } from '../../../db/database';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';

export const SettingsPage: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Alerts and loaders state
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Reset confirmation state
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [resetCodeInput, setResetCodeInput] = useState('');

  // Export Data
  const handleExport = async () => {
    setSuccessMsg(null);
    setErrorMsg(null);
    try {
      await exportService.exportData();
      setSuccessMsg("Données exportées avec succès.");
    } catch (err: any) {
      console.error(err);
      setErrorMsg("Impossible d'exporter les données.");
    }
  };

  // Import Data
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSuccessMsg(null);
    setErrorMsg(null);
    setIsLoading(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      try {
        const result = await importService.importData(text);
        if (result.success) {
          setSuccessMsg("Sauvegarde restaurée avec succès. Vos données locales ont été synchronisées.");
          // Clear input
          if (fileInputRef.current) fileInputRef.current.value = '';
        } else {
          setErrorMsg(result.error || "Une erreur est survenue lors de l'import.");
        }
      } catch {
        setErrorMsg("Erreur lors de la lecture du fichier de sauvegarde.");
      } finally {
        setIsLoading(false);
      }
    };
    reader.onerror = () => {
      setErrorMsg("Erreur lors de l'ouverture du fichier.");
      setIsLoading(false);
    };
    reader.readAsText(file);
  };

  // Clear Database
  const handleClearAll = async () => {
    if (resetCodeInput.toUpperCase() !== 'EFFACER') {
      setErrorMsg("Code de confirmation incorrect.");
      return;
    }

    setSuccessMsg(null);
    setErrorMsg(null);
    setIsLoading(true);
    setShowConfirmReset(false);
    setResetCodeInput('');

    try {
      await db.transaction('rw', [db.observations, db.outings], async () => {
        await db.observations.clear();
        await db.outings.clear();
      });
      setSuccessMsg("Toutes les données (observations et balades) ont été supprimées.");
    } catch {
      setErrorMsg("Erreur lors de la suppression des données.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 py-4 font-sans px-4">
      <h1 className="text-xl font-serif font-bold text-sage-950">
        Réglages & Données
      </h1>

      {/* Notifications banner */}
      {successMsg && (
        <div className="bg-sage-50 border border-sage-200 text-sage-700 px-4 py-3 rounded-2xl flex items-center gap-2 text-xs font-sans">
          <CheckCircle2 className="w-5 h-5 text-sage-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="bg-terracotta-50 border border-terracotta-200 text-terracotta-700 px-4 py-3 rounded-2xl flex items-center gap-2 text-xs font-sans">
          <AlertCircle className="w-5 h-5 text-terracotta-600 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Backup and restore */}
      <div className="flex flex-col gap-3">
        <h3 className="font-serif text-sm font-bold text-sage-800 px-1">
          Sauvegarde & Restauration
        </h3>

        <Card variant="paper" className="p-4 flex flex-col gap-3 font-sans">
          <p className="text-xs text-sage-600 leading-relaxed">
            Le Poussin Observateur stocke vos observations directement sur votre téléphone. Pour éviter de perdre vos données si vous changez d'appareil ou effacez l'historique de votre navigateur, exportez régulièrement des sauvegardes.
          </p>

          <div className="grid grid-cols-2 gap-3 mt-1">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={isLoading}
              className="flex items-center justify-center gap-1.5 py-2.5"
            >
              <Download className="w-4 h-4" /> Export JSON
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleImportClick}
              disabled={isLoading}
              className="flex items-center justify-center gap-1.5 py-2.5"
            >
              <Upload className="w-4 h-4" /> Import JSON
            </Button>
            <input
              type="file"
              accept=".json"
              ref={fileInputRef}
              onChange={handleImportFileChange}
              className="hidden"
            />
          </div>
        </Card>
      </div>

      {/* Delete / Danger zone */}
      <div className="flex flex-col gap-3">
        <h3 className="font-serif text-sm font-bold text-terracotta-600 px-1 flex items-center gap-1">
          <ShieldAlert className="w-4 h-4" /> Zone de danger
        </h3>

        <Card variant="flat" className="p-4 bg-terracotta-50 border border-terracotta-100 flex flex-col gap-3">
          <p className="text-xs text-terracotta-800 leading-relaxed">
            La réinitialisation supprimera définitivement toutes vos observations et vos balades locales. Veillez à avoir exporté vos données au préalable.
          </p>

          <Button
            variant="danger"
            size="sm"
            onClick={() => setShowConfirmReset(true)}
            disabled={isLoading}
            className="flex items-center justify-center gap-1.5 py-2.5"
          >
            <Trash2 className="w-4 h-4" /> Supprimer toutes mes données
          </Button>
        </Card>
      </div>

      {/* Confirm Reset Modal */}
      {showConfirmReset && (
        <div className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="p-6 max-w-sm w-full bg-sand-50 border border-sand-200 shadow-2xl flex flex-col gap-4">
            <h3 className="font-serif text-lg font-bold text-terracotta-700 flex items-center gap-2">
              <ShieldAlert className="w-6 h-6" /> Réinitialisation totale
            </h3>
            
            <p className="text-sm text-sage-700 font-sans leading-relaxed">
              Vous allez supprimer l'intégralité de vos observations et de vos balades.
              Pour confirmer cette action, veuillez écrire <span className="font-bold text-terracotta-600">EFFACER</span> ci-dessous :
            </p>

            <input
              type="text"
              placeholder="EFFACER"
              value={resetCodeInput}
              onChange={(e) => setResetCodeInput(e.target.value)}
              className="w-full px-4 py-2.5 bg-sand-50/50 border border-sand-300 rounded-xl font-mono text-center text-sm text-sage-950 placeholder-sage-300 focus:outline-none focus:ring-2 focus:ring-terracotta-500/30 focus:border-terracotta-500 uppercase"
            />

            <div className="flex gap-3 mt-2 font-sans">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowConfirmReset(false);
                  setResetCodeInput('');
                }}
              >
                Annuler
              </Button>
              <Button
                variant="danger"
                className="flex-1"
                onClick={handleClearAll}
                disabled={resetCodeInput.toUpperCase() !== 'EFFACER'}
              >
                Tout supprimer
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* À propos section */}
      <div className="flex flex-col gap-3">
        <h3 className="font-serif text-sm font-bold text-sage-800 px-1 flex items-center gap-1">
          <Info className="w-4 h-4 text-sage-500" /> À propos de Le Poussin Observateur
        </h3>

        <Card variant="paper" className="p-4 font-sans text-xs text-sage-600 space-y-2.5">
          <p className="leading-relaxed">
            <strong className="text-sage-800">Le Poussin Observateur</strong> est un carnet d'observations d'oiseaux de poche, spécialement conçu pour être mobile-first, installable sur écran d'accueil et utilisable 100% hors ligne lors de vos randonnées et sorties nature.
          </p>
          <p className="leading-relaxed">
            Vos données restent entièrement privées et locales sur votre appareil. Aucune information n'est transférée vers un serveur distant.
          </p>
          <p className="leading-relaxed border-t border-sand-100 pt-2.5 text-[10px] text-sage-400">
            Version 1.0.0 — Développé pour la protection et l'observation de la biodiversité.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
