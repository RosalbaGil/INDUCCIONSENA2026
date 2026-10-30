import React, { useState, useEffect } from 'react';
import {
  SENA_FOUNDATION_INFO,
  SENA_SYMBOLS,
  SENA_ANTHEM,
  SENA_VALUES,
  BIENESTAR_AREAS,
} from '../data/senaData';
import { anthemSynthesizer } from '../utils/anthemSynth';
import { SenaLogo } from '../constants/brand';

interface InstitutionalSectionProps {
  onMarkCompleted?: (moduleId: string) => void;
  isCompleted?: boolean;
}

export const InstitutionalSection: React.FC<InstitutionalSectionProps> = ({
  onMarkCompleted,
  isCompleted,
}) => {
  const [activeSymbolId, setActiveSymbolId] = useState<string>('escudo');
  const [isPlayingAnthem, setIsPlayingAnthem] = useState<boolean>(false);
  const [activeChorusLine, setActiveChorusLine] = useState<number>(-1);
  const [hasInteracted, setHasInteracted] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      anthemSynthesizer.stop();
    };
  }, []);

  const handleToggleAnthem = () => {
    if (isPlayingAnthem) {
      anthemSynthesizer.stop();
      setIsPlayingAnthem(false);
      setActiveChorusLine(-1);
    } else {
      setIsPlayingAnthem(true);
      anthemSynthesizer.play(
        (lyricIdx) => {
          setActiveChorusLine(lyricIdx);
        },
        () => {
          setIsPlayingAnthem(false);
          setActiveChorusLine(-1);
        }
      );
    }
  };

  const currentSymbol =
    SENA_SYMBOLS.find((s) => s.id === activeSymbolId) || SENA_SYMBOLS[0];

  const handleCompleteModule = () => {
    setHasInteracted(true);
    if (onMarkCompleted) {
      onMarkCompleted('identidad');
    }
  };

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 space-y-16">
      {/* Section Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <SenaLogo className="w-5 h-5 shrink-0" />
          <span className="text-[#39A900] dark:text-[#4ade80] font-semibold">Módulo 01</span>
          <span aria-hidden="true">·</span>
          <span>Apropiación Institucional</span>
          <span aria-hidden="true">·</span>
          <span>Cultura y Sentido de Pertenencia</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-2">
          Identidad, Misión y Símbolos del SENA
        </h2>
        <p className="text-slate-600 dark:text-slate-300 mt-2 max-w-3xl">
          El Servicio Nacional de Aprendizaje es el patrimonio formativo más querido por los
          colombianos. Conoce su historia, sus fundamentos éticos y los símbolos que te identificarán
          a lo largo de toda tu vida profesional.
        </p>
      </div>

      {/* Misión, Visión e Historia */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 flex flex-col justify-between transition-colors">
          <div>
            <div className="text-xs font-bold text-[#39A900] dark:text-[#4ade80] uppercase tracking-wider mb-2">
              Nuestra Razón de Ser
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Misión Institucional</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {SENA_FOUNDATION_INFO.mission}
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            Formación profesional integral sin costo, orientada a la inserción productiva.
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 flex flex-col justify-between transition-colors">
          <div>
            <div className="text-xs font-bold text-[#39A900] dark:text-[#4ade80] uppercase tracking-wider mb-2">
              Hacia Dónde Vamos
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Visión 2026</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {SENA_FOUNDATION_INFO.vision}
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            Innovación pedagógica, tecnología aplicada y cobertura en los 32 departamentos.
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 flex flex-col justify-between transition-colors">
          <div>
            <div className="text-xs font-bold text-[#39A900] dark:text-[#4ade80] uppercase tracking-wider mb-2">
              Origen y Trayectoria
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">Fundación Histórica</h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Fundado el <strong className="text-slate-900 dark:text-white">{SENA_FOUNDATION_INFO.foundationDate}</strong> por el{' '}
              <strong className="text-slate-900 dark:text-white">{SENA_FOUNDATION_INFO.founder}</strong> mediante el{' '}
              {SENA_FOUNDATION_INFO.decree}. Hoy cuenta con{' '}
              <strong className="text-slate-900 dark:text-white">{SENA_FOUNDATION_INFO.coverage.regionales} Regionales</strong> y{' '}
              <strong className="text-slate-900 dark:text-white">{SENA_FOUNDATION_INFO.coverage.centros} Centros de Formación</strong> en toda Colombia.
            </p>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            Plataformas de estudio oficial: Zajuna (LMS) y Sistema SofiaPlus.
          </div>
        </div>
      </div>

      {/* Símbolos Institucionales Interactivos */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 space-y-8 transition-colors">
        <div>
          <div className="text-xs font-bold text-[#39A900] dark:text-[#4ade80] uppercase tracking-wider">
            Heráldica e Imagen
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Los Tres Símbolos Oficiales del SENA
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
            Haz clic en cada símbolo para examinar su composición y su significado institucional.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          {SENA_SYMBOLS.map((sym) => (
            <button
              key={sym.id}
              onClick={() => setActiveSymbolId(sym.id)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${
                activeSymbolId === sym.id
                  ? 'bg-[#39A900] text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {sym.title}
            </button>
          ))}
        </div>

        {/* Symbol Details Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Visual Canvas */}
          <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-lg p-8 flex flex-col items-center justify-center text-center min-h-[360px]">
            {activeSymbolId === 'escudo' ? (
              <div className="space-y-4">
                <img
                  src="https://www.sena.edu.co/assets/escudo-CKAC4aSg.png"
                  alt="Escudo Institucional SENA"
                  className="w-[280px] h-[280px] object-contain mx-auto transition-transform hover:scale-105 duration-200 drop-shadow-xs"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.currentTarget.src = "/src/assets/images/sena_institutional_symbols_1793115164760.jpg";
                  }}
                />
                <div className="text-xs text-slate-500 font-mono">
                  Escudo Oficial SENA · Sectores Económicos
                </div>
              </div>
            ) : activeSymbolId === 'bandera' ? (
              <div className="w-full space-y-4">
                <div className="relative w-full h-52 bg-white border-2 border-slate-300 shadow-md rounded-sm flex items-center justify-center overflow-hidden p-6">
                  <div className="w-24 h-24 flex items-center justify-center">
                    <img
                      src="https://www.sena.edu.co/assets/escudo-CKAC4aSg.png"
                      alt="Escudo en Bandera SENA"
                      className="w-20 h-20 object-contain"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        e.currentTarget.src = "/src/assets/images/sena_institutional_symbols_1793115164760.jpg";
                      }}
                    />
                  </div>
                </div>
                <div className="text-xs text-slate-500 font-mono">
                  Bandera Oficial Blanca con Escudo Institucional Central · Proporción 2:3
                </div>
              </div>
            ) : (
              <div className="w-full space-y-4">
                <div className="relative w-full h-52 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg flex flex-col items-center justify-center p-6 shadow-xs">
                  <SenaLogo className="w-32 h-32 hover:scale-105 transition-transform duration-200" />
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  Logo-Símbolo Oficial SENA (Vector Autorizado)
                </div>
              </div>
            )}
          </div>

          {/* Meaning & Elements Breakdown */}
          <div className="lg:col-span-7 space-y-4">
            <div>
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase">
                {currentSymbol.subtitle}
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mt-1">{currentSymbol.title}</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                {currentSymbol.description}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                Componentes y significado:
              </div>
              <div className="space-y-2.5">
                {currentSymbol.elements.map((el, i) => (
                  <div
                    key={i}
                    className="p-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700 rounded-md text-sm"
                  >
                    <span className="font-bold text-slate-900 dark:text-white">{el.name}:</span>{' '}
                    <span className="text-slate-600 dark:text-slate-300">{el.meaning}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 italic pt-2">{currentSymbol.details}</p>
          </div>
        </div>
      </div>

      {/* Himno del SENA Interactivo */}
      <div className="bg-slate-900 text-white rounded-xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Patrimonio Musical Institucional
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mt-1">Himno del SENA</h3>
            <p className="text-xs text-slate-400 mt-1">
              Letra: Luis Alfredo Sánchez · Música: Daniel Marlez
            </p>
          </div>

          <button
            onClick={handleToggleAnthem}
            className={`px-5 py-2.5 rounded-md font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer ${
              isPlayingAnthem
                ? 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md'
                : 'bg-[#39A900] hover:bg-[#2e8600] text-white shadow-md'
            }`}
          >
            {isPlayingAnthem ? (
              <>
                <span className="w-2.5 h-2.5 bg-slate-950 rounded-xs"></span>
                Pausar Melodía
              </>
            ) : (
              <>
                <span className="w-0 h-0 border-y-4 border-y-transparent border-l-6 border-l-white"></span>
                Reproducir Melodía Oficial
              </>
            )}
          </button>
        </div>

        {isPlayingAnthem && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-500/30 rounded-md text-xs text-emerald-300">
            Reproduciendo la marcha marcial del coro oficial del SENA en Sol Mayor mediante síntesis de audio WebAudio.
          </div>
        )}

        {/* Verses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
          {/* Coro */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-lg p-5">
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">
              Coro Principal
            </div>
            <div className="space-y-1.5 text-sm">
              {SENA_ANTHEM[0].text.map((line, idx) => (
                <div
                  key={idx}
                  className={`transition-colors duration-150 ${
                    activeChorusLine === idx
                      ? 'text-emerald-300 font-bold bg-emerald-900/40 px-1 rounded'
                      : 'text-slate-300'
                  }`}
                >
                  {line}
                </div>
              ))}
            </div>
          </div>

          {/* Estrofas 1, 2, 3 */}
          {SENA_ANTHEM.slice(1).map((verse, vIdx) => (
            <div
              key={vIdx}
              className="bg-slate-800/40 border border-slate-700/80 rounded-lg p-5"
            >
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Estrofa {verse.number}
              </div>
              <div className="space-y-1.5 text-sm text-slate-300">
                {verse.text.map((line, lIdx) => (
                  <div key={lIdx}>{line}</div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Valores Éticos del Aprendiz */}
      <div className="space-y-6">
        <div>
          <div className="text-xs font-bold text-[#39A900] dark:text-[#4ade80] uppercase tracking-wider">
            Código de Integridad
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Valores Éticos Institucionales
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
            Los 6 valores que guían la conducta de cada aprendiz e instructor dentro y fuera de la institución.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SENA_VALUES.map((val, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-5 flex flex-col justify-between hover:shadow-sm transition-all"
            >
              <div>
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                  Valor 0{idx + 1}
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">{val.name}</h4>
                <div className="text-xs text-[#39A900] dark:text-[#4ade80] font-medium mb-2.5">{val.tagline}</div>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">{val.description}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-900 dark:text-white">Aplicación del Aprendiz:</span>{' '}
                <span className="text-xs text-slate-600 dark:text-slate-300">{val.apprenticeApplication}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bienestar al Aprendiz */}
      <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 space-y-6 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-[#39A900] dark:text-[#4ade80] uppercase tracking-wider">
              Acompañamiento Integral
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
              Bienestar al Aprendiz
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              Programas y apoyos diseñados para garantizar tu permanencia y culminación exitosa.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {BIENESTAR_AREAS.map((area, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-4 transition-colors">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{area.name}</h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{area.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Module Completion Action */}
      <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg p-5 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors">
        <div>
          <div className="text-sm font-bold text-emerald-950 dark:text-emerald-200">
            {isCompleted || hasInteracted
              ? 'Módulo 01 apropiado con éxito'
              : '¿Has explorado la identidad y símbolos del SENA?'}
          </div>
          <div className="text-xs text-emerald-800 dark:text-emerald-300">
            Marca este módulo como completado para registrar tu avance en la ficha formativa.
          </div>
        </div>

        <button
          onClick={handleCompleteModule}
          className="px-5 py-2 text-xs font-semibold text-white bg-[#39A900] hover:bg-[#2e8600] rounded-md transition-colors whitespace-nowrap cursor-pointer shadow-xs"
        >
          {isCompleted || hasInteracted ? 'Módulo Completado ✓' : 'Marcar Módulo como Visto'}
        </button>
      </div>
    </section>
  );
};
