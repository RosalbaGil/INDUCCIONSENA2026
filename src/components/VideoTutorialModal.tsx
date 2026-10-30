import React, { useEffect, useRef } from 'react';
import { X, Play, Video, CheckCircle2, Volume2, Shield } from 'lucide-react';
import { SenaLogo } from '../constants/brand';

interface VideoTutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VideoTutorialModal: React.FC<VideoTutorialModalProps> = ({ isOpen, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Pause video if modal is closed
  useEffect(() => {
    if (!isOpen && videoRef.current) {
      videoRef.current.pause();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="video-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity duration-300 animate-fadeIn"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-emerald-500/30 dark:border-emerald-500/20 overflow-hidden z-10 my-auto transition-all transform animate-scaleIn">
        {/* Top Institutional Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 bg-gradient-to-r from-emerald-50/70 via-white to-sky-50/70 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-[#39A900] shrink-0 shadow-2xs">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#39A900] text-white">
                  <Play className="w-2.5 h-2.5 fill-current" />
                  Video Tutorial Oficial
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">
                  Vigencia Normativa 2026
                </span>
              </div>
              <h2
                id="video-modal-title"
                className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-tight mt-0.5"
              >
                Guía de Inicio Rápido: Plataforma SENA Inducción 360
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Cerrar video tutorial"
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Section with Native HTML5 Controls */}
        <div className="p-3 sm:p-6 bg-slate-950 flex flex-col items-center justify-center">
          <div className="w-full relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black border border-slate-800">
            <video
              ref={videoRef}
              src="/assets/aistudio/2026__11_51_a.m._e5367467.mp4"
              controls
              autoPlay
              playsInline
              preload="metadata"
              className="w-full h-full object-contain"
            >
              Tu navegador no soporta la reproducción de video HTML5. Puedes consultar el manual
              escrito en la raíz del proyecto.
            </video>
          </div>
        </div>

        {/* Informative Footer & Steps Covered */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <div className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <SenaLogo className="w-3.5 h-3.5 shrink-0" />
            <span>Ruta explicada en este video tutorial (5 Pasos Oficiales):</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px]">
            <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 flex items-start gap-1.5 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#39A900] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900 dark:text-white">1. Identidad</strong>
                <span className="text-slate-500 dark:text-slate-400 text-[10px]">Símbolos y valores</span>
              </div>
            </div>

            <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 flex items-start gap-1.5 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#39A900] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900 dark:text-white">2. Reglamento</strong>
                <span className="text-slate-500 dark:text-slate-400 text-[10px]">5 Capítulos y dilemas</span>
              </div>
            </div>

            <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 flex items-start gap-1.5 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#39A900] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900 dark:text-white">3. Evaluación</strong>
                <span className="text-slate-500 dark:text-slate-400 text-[10px]">Meta: 80% (12/15)</span>
              </div>
            </div>

            <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 flex items-start gap-1.5 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#39A900] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900 dark:text-white">4. Constancia</strong>
                <span className="text-slate-500 dark:text-slate-400 text-[10px]">Descarga PDF oficial</span>
              </div>
            </div>

            <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700/80 flex items-start gap-1.5 shadow-2xs col-span-2 sm:col-span-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#39A900] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900 dark:text-white">5. Sincronización</strong>
                <span className="text-slate-500 dark:text-slate-400 text-[10px]">Google Sheets / Drive</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs border-t border-slate-200/60 dark:border-slate-800">
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-[11px]">
              <Shield className="w-3.5 h-3.5 text-[#39A900]" />
              <span>Dirección de Formación Profesional Integral · SENA 2026</span>
            </div>

            <button
              onClick={onClose}
              className="px-5 py-2 text-xs font-bold text-white bg-[#39A900] hover:bg-[#2e8600] rounded-xl transition-all shadow-sm cursor-pointer self-end sm:self-auto"
            >
              Entendido, Continuar al Portal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
