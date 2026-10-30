import React from 'react';
import { ApprenticeProfile } from '../types/sena';
import { SenaLogo } from '../constants/brand';

interface CertificateModalProps {
  apprentice: ApprenticeProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  apprentice,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const certificateCode =
    apprentice.certificateId || `SENA-IND-${apprentice.ficha}-${Math.floor(1000 + Math.random() * 9000)}`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl max-w-3xl w-full border border-slate-300 shadow-2xl overflow-hidden my-8">
        {/* Modal Top Actions Bar */}
        <div className="bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between">
          <div className="text-xs font-semibold tracking-wide flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#39A900] rounded-xs"></span>
            <span>Constancia Oficial de Apropiación de Inducción</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1 text-xs font-semibold text-white bg-[#39A900] hover:bg-[#2e8600] rounded-md transition-colors cursor-pointer"
            >
              Imprimir / Guardar PDF
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white text-base font-bold px-2 cursor-pointer"
              title="Cerrar"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Certificate Canvas (Print-friendly) */}
        <div className="p-8 sm:p-12 bg-white border-8 border-double border-emerald-900 text-slate-900 relative">
          {/* Watermark accent */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
            <div className="w-96 h-96 rounded-full border-[30px] border-emerald-950"></div>
          </div>

          <div className="relative space-y-6 text-center">
            {/* Header Lockup with official SENA logo */}
            <div className="space-y-2">
              <SenaLogo className="w-16 h-16 mx-auto mb-1" />
              <div className="text-xs font-extrabold uppercase tracking-widest text-[#00324D]">
                República de Colombia
              </div>
              <div className="text-lg sm:text-xl font-extrabold tracking-tight text-[#39A900]">
                SERVICIO NACIONAL DE APRENDIZAJE - SENA
              </div>
              <div className="text-xs text-slate-500 font-serif italic">
                Dirección de Formación Profesional Integral · Sistema Integrado de Inducción
              </div>
            </div>

            <div className="w-24 h-0.5 bg-[#39A900] mx-auto my-3" />

            <div className="text-xs font-semibold uppercase tracking-widest text-slate-600">
              Certifica que:
            </div>

            {/* Apprentice Name */}
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-950 tracking-tight underline decoration-[#39A900] decoration-2 underline-offset-8">
                {apprentice.name}
              </h2>
              <div className="text-xs text-slate-600 font-mono pt-2">
                Identificado con {apprentice.documentType} No. {apprentice.documentNumber}
              </div>
            </div>

            <p className="text-sm text-slate-700 max-w-xl mx-auto leading-relaxed pt-2">
              Cursó y aprobó satisfactoriamente el{' '}
              <strong className="text-slate-900">
                Proceso de Inducción Institucional y Apropiación del Reglamento del Aprendiz
              </strong>{' '}
              (Acuerdo 009 de 2024 y su actualización por Acuerdo 002 de 2026), alcanzando el juicio evaluativo de:
            </p>

            {/* Juicio Evaluativo Stamp */}
            <div className="inline-block px-6 py-2 border-2 border-emerald-700 bg-emerald-50 text-emerald-950 font-black text-base uppercase tracking-wider rounded-md">
              COMPETENTE
            </div>

            {/* Program details */}
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto text-left text-xs bg-slate-50 p-4 rounded border border-slate-200">
              <div>
                <span className="text-slate-500 block">Programa de Formación:</span>
                <span className="font-bold text-slate-900">{apprentice.programName}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Número de Ficha:</span>
                <span className="font-mono font-bold text-slate-900">{apprentice.ficha}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Centro de Formación:</span>
                <span className="text-slate-800">{apprentice.center}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Regional:</span>
                <span className="text-slate-800">{apprentice.regional}</span>
              </div>
            </div>

            {/* Footer with Signatures & Hash */}
            <div className="pt-8 grid grid-cols-2 gap-8 items-end text-xs">
              <div className="text-center space-y-1">
                <div className="font-serif italic text-base text-slate-800 font-bold">
                  Ing. Rodrigo Cárdenas M.
                </div>
                <div className="w-40 h-px bg-slate-400 mx-auto" />
                <div className="text-[11px] text-slate-600">Subdirector de Centro</div>
                <div className="text-[10px] text-slate-400">SENA Centro de Formación</div>
              </div>

              <div className="text-center space-y-1">
                <div className="font-serif italic text-base text-slate-800 font-bold">
                  Lic. María Elena Duarte P.
                </div>
                <div className="w-40 h-px bg-slate-400 mx-auto" />
                <div className="text-[11px] text-slate-600">Coordinación de Formación</div>
                <div className="text-[10px] text-slate-400">Grupo de Bienestar e Inducción</div>
              </div>
            </div>

            {/* Verification code */}
            <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
              <div>Código de Verificación: {certificateCode}</div>
              <div>Fecha: {apprentice.quizDate || '2026-10-27'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
