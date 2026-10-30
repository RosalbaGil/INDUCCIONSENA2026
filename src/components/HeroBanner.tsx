import React from 'react';
import { ApprenticeProfile } from '../types/sena';
import { SenaLogo } from '../constants/brand';
import { Play } from 'lucide-react';

interface HeroBannerProps {
  currentApprentice: ApprenticeProfile;
  onNavigate: (tab: string) => void;
  onViewCertificate?: () => void;
  onOpenVideoTutorial?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  currentApprentice,
  onNavigate,
  onViewCertificate,
  onOpenVideoTutorial,
}) => {
  const hasCompletedQuiz = currentApprentice.quizStatus === 'passed';

  return (
    <section className="relative overflow-hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Text & Status Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2.5 text-xs font-medium text-slate-500 dark:text-slate-400">
              <SenaLogo className="w-5 h-5 shrink-0" />
              <span className="text-[#39A900] dark:text-[#4ade80] font-semibold">Servicio Nacional de Aprendizaje</span>
              <span aria-hidden="true">·</span>
              <span>Proceso de Inducción 2026</span>
              <span aria-hidden="true">·</span>
              <span>Ficha {currentApprentice.ficha}</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight text-balance">
                Bienvenido a la comunidad SENA: Tu futuro comienza aquí
              </h1>
              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                Conoce los valores y símbolos que nos unen, apropia tus derechos y deberes según el
                Reglamento del Aprendiz, y valida tus conocimientos para iniciar con éxito tu etapa lectiva.
              </p>
            </div>

            {/* Apprentice Profile Strip */}
            <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-lg p-4 max-w-2xl transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Aprendiz en formación</div>
                  <div className="text-base font-bold text-slate-900 dark:text-white">{currentApprentice.name}</div>
                  <div className="text-xs text-slate-600 dark:text-slate-300">
                    {currentApprentice.programName} · {currentApprentice.regional}
                  </div>
                </div>

                <div className="sm:text-right flex flex-col sm:items-end justify-center">
                  <div className="text-xs text-slate-500 dark:text-slate-400">Estado de Inducción</div>
                  <div className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                    {hasCompletedQuiz ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">Completada (Competente)</span>
                    ) : (
                      <span className="text-amber-600 dark:text-amber-400 font-bold">En desarrollo</span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {currentApprentice.completedModules.length} de 4 módulos cursados
                  </div>
                </div>
              </div>
            </div>

            {/* CTA action buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('identidad')}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-[#39A900] hover:bg-[#2e8600] rounded-md transition-colors shadow-xs cursor-pointer"
              >
                Explorar Identidad Institucional
              </button>
              <button
                onClick={() => onNavigate('reglamento')}
                className="px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-md transition-colors cursor-pointer"
              >
                Reglamento del Aprendiz
              </button>
              <button
                onClick={() => onNavigate('evaluacion')}
                className="px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-md transition-colors cursor-pointer"
              >
                Presentar Evaluación
              </button>

              {onOpenVideoTutorial && (
                <button
                  type="button"
                  onClick={onOpenVideoTutorial}
                  className="px-4 py-2.5 text-sm font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-700 rounded-md transition-colors cursor-pointer inline-flex items-center gap-2"
                >
                  <Play className="w-3.5 h-3.5 fill-current text-[#39A900]" />
                  <span>Video Tutorial</span>
                </button>
              )}

              {hasCompletedQuiz && onViewCertificate && (
                <button
                  onClick={onViewCertificate}
                  className="px-4 py-2.5 text-sm font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-700 rounded-md transition-colors cursor-pointer"
                >
                  Descargar Constancia
                </button>
              )}
            </div>
          </div>

          {/* Hero Visual Column */}
          <div className="lg:col-span-5">
            <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-md bg-slate-100 dark:bg-slate-800">
              <img
                src="/src/assets/images/hero_sena_induction_1793115164570.jpg"
                alt="Ambiente de formación tecnológica y aprendices del SENA en proceso de inducción"
                className="w-full h-80 sm:h-96 object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="p-4 bg-white/95 dark:bg-slate-900/95 border-t border-slate-200 dark:border-slate-800">
                <div className="text-xs font-semibold text-[#00324D] dark:text-emerald-400">
                  Centro de Formación Profesional Integral
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Formación profesional integral gratuita, inclusiva y con pertinencia tecnológica.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pillars Summary Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
          <div
            onClick={() => onNavigate('identidad')}
            className="p-4 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
          >
            <div className="text-xs font-bold text-[#39A900] dark:text-[#4ade80] uppercase tracking-wider">01. Identidad</div>
            <div className="text-sm font-semibold text-slate-900 dark:text-white mt-1">Misión y Símbolos</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Escudo, bandera, logo e himno oficial</div>
          </div>

          <div
            onClick={() => onNavigate('reglamento')}
            className="p-4 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
          >
            <div className="text-xs font-bold text-[#39A900] dark:text-[#4ade80] uppercase tracking-wider">02. Reglamento</div>
            <div className="text-sm font-semibold text-slate-900 dark:text-white mt-1">Los 5 Capítulos</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Acuerdo 009 de 2024 (Act. 2026) completo</div>
          </div>

          <div
            onClick={() => onNavigate('reglamento')}
            className="p-4 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
          >
            <div className="text-xs font-bold text-[#39A900] dark:text-[#4ade80] uppercase tracking-wider">03. Casos Reales</div>
            <div className="text-sm font-semibold text-slate-900 dark:text-white mt-1">Dilemas y Convivencia</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Simulación de faltas, deserción y comités</div>
          </div>

          <div
            onClick={() => onNavigate('evaluacion')}
            className="p-4 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
          >
            <div className="text-xs font-bold text-[#39A900] dark:text-[#4ade80] uppercase tracking-wider">04. Apropiación</div>
            <div className="text-sm font-semibold text-slate-900 dark:text-white mt-1">Evaluación Final</div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">15 preguntas con juicio evaluativo y constancia</div>
          </div>
        </div>
      </div>
    </section>
  );
};
