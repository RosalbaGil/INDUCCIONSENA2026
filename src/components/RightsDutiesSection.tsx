import React, { useState, useMemo } from 'react';
import { REGLAMENTO_DATA, CASE_DILEMMAS } from '../data/senaData';
import { SenaLogo } from '../constants/brand';

interface RightsDutiesSectionProps {
  onMarkCompleted?: (moduleId: string) => void;
  isCompleted?: boolean;
}

const CHAPTERS_METADATA = [
  {
    id: 'Capítulo I',
    number: 'I',
    title: 'Principios y Definiciones',
    articles: 'Arts. 1 al 4',
    desc: 'Fundamentos de la Formación Profesional Integral (FPI), concepto de aprendiz, dignidad humana, autonomía y enfoque territorial.',
    color: 'sky',
  },
  {
    id: 'Capítulo II',
    number: 'II',
    title: 'Derechos y Representatividad',
    articles: 'Arts. 5 al 21',
    desc: 'Garantías formativas, reconocimientos al mérito, monitorías y participación estudiantil con voz y voto (Acuerdo 002 de 2026).',
    color: 'emerald',
  },
  {
    id: 'Capítulo III',
    number: 'III',
    title: 'Deberes y Prohibiciones',
    articles: 'Arts. 8 y 9',
    desc: 'Normas de convivencia, uso de EPP, honestidad intelectual y prohibiciones sobre sustancias, armas y violencias de género.',
    color: 'amber',
  },
  {
    id: 'Capítulo IV',
    number: 'IV',
    title: 'Ingreso, Permanencia y Certificación',
    articles: 'Arts. 10 al 24',
    desc: 'Alternativas de etapa productiva, traslados, aplazamientos (hasta 6 meses), procedimiento de deserción y requisitos de grado.',
    color: 'purple',
  },
  {
    id: 'Capítulo V',
    number: 'V',
    title: 'Faltas, Medidas y Procedimiento',
    articles: 'Arts. 25 al 50',
    desc: 'Medidas pedagógicas formativas, sanciones disciplinarias, comité evaluador con voz y voto estudiantil y recurso de reposición.',
    color: 'rose',
  },
];

export const RightsDutiesSection: React.FC<RightsDutiesSectionProps> = ({
  onMarkCompleted,
  isCompleted,
}) => {
  const [selectedChapter, setSelectedChapter] = useState<string>('todos');
  const [activeCategory, setActiveCategory] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCaseId, setSelectedCaseId] = useState<string>(CASE_DILEMMAS[0].id);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [, setHasAnsweredDilemma] = useState<boolean>(false);
  const [hasMarkedCompleted, setHasMarkedCompleted] = useState<boolean>(false);

  // Filtered regulation articles
  const filteredArticles = useMemo(() => {
    return REGLAMENTO_DATA.filter((item) => {
      const matchesChapter =
        selectedChapter === 'todos' || item.chapter === selectedChapter;
      const matchesCategory =
        activeCategory === 'todos' || item.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.article.toLowerCase().includes(q) ||
        item.chapter.toLowerCase().includes(q) ||
        item.chapterTitle.toLowerCase().includes(q) ||
        item.practicalExample.toLowerCase().includes(q);

      return matchesChapter && matchesCategory && matchesSearch;
    });
  }, [selectedChapter, activeCategory, searchQuery]);

  const currentCase =
    CASE_DILEMMAS.find((c) => c.id === selectedCaseId) || CASE_DILEMMAS[0];

  const handleSelectCaseOption = (optionId: string) => {
    setSelectedOptionId(optionId);
    setHasAnsweredDilemma(true);
  };

  const handleSelectNextCase = (caseId: string) => {
    setSelectedCaseId(caseId);
    setSelectedOptionId(null);
    setHasAnsweredDilemma(false);
  };

  const handleComplete = () => {
    setHasMarkedCompleted(true);
    if (onMarkCompleted) {
      onMarkCompleted('reglamento');
    }
  };

  // Helper for Category labels and styles
  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'principio':
        return {
          label: 'Principio Institucional',
          className:
            'bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800',
        };
      case 'derecho':
        return {
          label: 'Derecho del Aprendiz',
          className:
            'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800',
        };
      case 'estimulo':
        return {
          label: 'Estímulo e Incentivo',
          className:
            'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800',
        };
      case 'deber':
        return {
          label: 'Deber Formativo',
          className:
            'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800',
        };
      case 'prohibicion':
        return {
          label: 'Prohibición Expresa',
          className:
            'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800',
        };
      case 'tramite':
        return {
          label: 'Trámite / Novedad',
          className:
            'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800',
        };
      case 'certificacion':
        return {
          label: 'Certificación y Grado',
          className:
            'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800',
        };
      case 'falta_sancion':
        return {
          label: 'Falta / Sanción / Procedimiento',
          className:
            'bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800',
        };
      default:
        return {
          label: category,
          className:
            'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700',
        };
    }
  };

  const getChapterBadgeClass = (chapter: string) => {
    switch (chapter) {
      case 'Capítulo I':
        return 'bg-sky-100 dark:bg-sky-950/70 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-700';
      case 'Capítulo II':
        return 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700';
      case 'Capítulo III':
        return 'bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700';
      case 'Capítulo IV':
        return 'bg-purple-100 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300 border-purple-300 dark:border-purple-700';
      case 'Capítulo V':
        return 'bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-700';
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700';
    }
  };

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 space-y-14">
      {/* Section Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <SenaLogo className="w-5 h-5 shrink-0" />
          <span className="text-[#39A900] dark:text-[#4ade80] font-semibold">Módulo 02</span>
          <span aria-hidden="true">·</span>
          <span>Reglamento del Aprendiz SENA</span>
          <span aria-hidden="true">·</span>
          <span className="text-slate-900 dark:text-white font-semibold">Acuerdo 009 de 2024</span>
          <span aria-hidden="true">·</span>
          <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-300 dark:border-emerald-700">
            Actualizado por Acuerdo 002 de 2026
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-2">
          Estructura Completa: Los 5 Capítulos del Acuerdo 009 de 2024
        </h2>
        <p className="text-slate-600 dark:text-slate-300 mt-2 max-w-3xl leading-relaxed">
          Explora en su totalidad el marco reglamentario vigente del SENA expedido por el Consejo Directivo Nacional. Comprende desde los principios pedagógicos fundacionales de la FPI hasta los derechos, deberes, prohibiciones, alternativas de etapa productiva, causales de deserción y el debido proceso sancionatorio con voz y voto estudiantil.
        </p>

        {/* Novedad 2026 Callout */}
        <div className="mt-4 p-3.5 rounded-lg bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 flex items-start sm:items-center gap-3">
          <span className="inline-flex items-center justify-center px-2 py-0.5 text-[11px] font-bold bg-[#39A900] text-white rounded shrink-0">
            Reforma 2026
          </span>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            <strong>Acuerdo 002 de 2026 (Modificación Art. 48):</strong> Se reconoce formalmente <strong>voz y voto</strong> al Representante de Aprendices (o su suplente) en el Comité de Evaluación y Seguimiento, consolidando las garantías democráticas y de debido proceso estudiantil en los 117 centros del país.
          </p>
        </div>
      </div>

      {/* Chapter Overview Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Navegación Rápida por Capítulos Oficiales
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Haz clic en un capítulo para filtrarlo
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {CHAPTERS_METADATA.map((chap) => {
            const isSelected = selectedChapter === chap.id;
            return (
              <button
                key={chap.id}
                onClick={() => {
                  setSelectedChapter(isSelected ? 'todos' : chap.id);
                  setActiveCategory('todos');
                }}
                className={`text-left p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#39A900] ring-2 ring-[#39A900]/20 bg-emerald-50/60 dark:bg-emerald-950/30 shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-bold rounded-md bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                      Capítulo {chap.number}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">
                      {chap.articles}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white mb-1.5 leading-snug">
                    {chap.title}
                  </h4>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {chap.desc}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 dark:text-slate-400">
                    {REGLAMENTO_DATA.filter((i) => i.chapter === chap.id).length} artículos clave
                  </span>
                  <span
                    className={`font-semibold ${
                      isSelected
                        ? 'text-[#39A900] dark:text-[#4ade80]'
                        : 'text-slate-400 dark:text-slate-500'
                    }`}
                  >
                    {isSelected ? 'Filtrado ✓' : 'Ver →'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Explorer Controls & Article Cards */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-7 space-y-6 transition-colors shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Chapter & Category Filter Tabs */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/90 rounded-lg">
              <button
                onClick={() => {
                  setSelectedChapter('todos');
                  setActiveCategory('todos');
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  selectedChapter === 'todos' && activeCategory === 'todos'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Todos los Capítulos ({REGLAMENTO_DATA.length})
              </button>
              <button
                onClick={() => {
                  setSelectedChapter('Capítulo I');
                  setActiveCategory('todos');
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  selectedChapter === 'Capítulo I'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Cap. I: Principios
              </button>
              <button
                onClick={() => {
                  setSelectedChapter('Capítulo II');
                  setActiveCategory('todos');
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  selectedChapter === 'Capítulo II'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Cap. II: Derechos
              </button>
              <button
                onClick={() => {
                  setSelectedChapter('Capítulo III');
                  setActiveCategory('todos');
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  selectedChapter === 'Capítulo III'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Cap. III: Deberes & Prohibiciones
              </button>
              <button
                onClick={() => {
                  setSelectedChapter('Capítulo IV');
                  setActiveCategory('todos');
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  selectedChapter === 'Capítulo IV'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Cap. IV: Ingreso, Permanencia & Certificación
              </button>
              <button
                onClick={() => {
                  setSelectedChapter('Capítulo V');
                  setActiveCategory('todos');
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  selectedChapter === 'Capítulo V'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Cap. V: Faltas & Sanciones
              </button>
            </div>

            {/* Sub-filter by Category */}
            <div className="flex flex-wrap items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
              <span className="font-semibold text-slate-700 dark:text-slate-300 mr-1">Filtrar por tipo:</span>
              {[
                { id: 'todos', label: 'Todos' },
                { id: 'principio', label: 'Principios' },
                { id: 'derecho', label: 'Derechos' },
                { id: 'estimulo', label: 'Estímulos' },
                { id: 'deber', label: 'Deberes' },
                { id: 'prohibicion', label: 'Prohibiciones' },
                { id: 'tramite', label: 'Trámites' },
                { id: 'certificacion', label: 'Certificación' },
                { id: 'falta_sancion', label: 'Faltas y Sanciones' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                    activeCategory === cat.id
                      ? 'bg-emerald-600 text-white font-semibold'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search box */}
          <div className="w-full lg:w-72 shrink-0">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por artículo, tema, caso..."
              className="w-full text-xs px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#39A900] bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 placeholder-slate-400 dark:placeholder-slate-500 transition-colors"
            />
          </div>
        </div>

        {/* Filter Summary */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3">
          <span>
            Mostrando <strong>{filteredArticles.length}</strong> de <strong>{REGLAMENTO_DATA.length}</strong> artículos normativos analizados
          </span>
          {(selectedChapter !== 'todos' || activeCategory !== 'todos' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedChapter('todos');
                setActiveCategory('todos');
                setSearchQuery('');
              }}
              className="text-[#39A900] dark:text-[#4ade80] hover:underline cursor-pointer font-medium"
            >
              Restablecer filtros
            </button>
          )}
        </div>

        {/* Articles List / Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.length === 0 ? (
            <div className="col-span-full py-12 text-center text-sm text-slate-500">
              No se encontraron artículos con los criterios seleccionados. Prueba con otros filtros o términos de búsqueda.
            </div>
          ) : (
            filteredArticles.map((item) => {
              const catBadge = getCategoryBadge(item.category);
              const chapterClass = getChapterBadgeClass(item.chapter);

              return (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-xl p-5 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-600 transition-all shadow-xs hover:shadow-md"
                >
                  <div>
                    {/* Chapter & Article Badges */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded-md border ${chapterClass}`}
                      >
                        {item.chapter}
                      </span>
                      <span className="text-[11px] font-mono font-semibold text-[#00324D] dark:text-emerald-400">
                        {item.article}
                      </span>
                    </div>

                    {/* Category & Severity Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 text-[10px] font-semibold rounded-md ${catBadge.className}`}
                      >
                        {catBadge.label}
                      </span>
                      {item.severity && (
                        <span
                          className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded-md uppercase ${
                            item.severity === 'gravisima'
                              ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 border border-red-300 dark:border-red-800'
                              : item.severity === 'grave'
                              ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-300 dark:border-blue-800'
                          }`}
                        >
                          Falta {item.severity}
                        </span>
                      )}
                    </div>

                    <h4 className="text-base font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                      {item.summary}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-700/80 text-xs bg-slate-50/70 dark:bg-slate-900/40 -mx-5 -mb-5 p-4 rounded-b-xl">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      En la práctica pedagógica:
                    </span>{' '}
                    <span className="text-slate-600 dark:text-slate-300">
                      {item.practicalExample}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Simulator: Interactive Case Dilemmas */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 space-y-6 transition-colors shadow-xs">
        <div>
          <div className="text-xs font-bold text-[#39A900] dark:text-[#4ade80] uppercase tracking-wider">
            Simulador de Convivencia y Toma de Decisiones
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mt-1">
            Situaciones Reales en los Ambientes de Formación
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
            Analiza dilemas de la vida cotidiana del aprendiz y selecciona la conducta apropiada según el{' '}
            <strong>Acuerdo 009 de 2024 (actualizado por el Acuerdo 002 de 2026)</strong>.
          </p>
        </div>

        {/* Case Selector Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          {CASE_DILEMMAS.map((c, idx) => (
            <button
              key={c.id}
              onClick={() => handleSelectNextCase(c.id)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                selectedCaseId === c.id
                  ? 'bg-slate-900 dark:bg-slate-700 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Caso 0{idx + 1}: {c.title.replace('Caso: ', '')}
            </button>
          ))}
        </div>

        {/* Current Case Presentation */}
        <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg p-6 space-y-5">
          <div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-mono mb-1">
              Involucrados: {currentCase.involvedActors}
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">{currentCase.title}</h4>
            <p className="text-sm text-slate-700 dark:text-slate-200 mt-2 leading-relaxed bg-white dark:bg-slate-800 p-4 rounded-md border border-slate-200 dark:border-slate-700">
              {currentCase.situation}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide">
              Selecciona la conducta correcta:
            </div>
            <div className="space-y-2.5">
              {currentCase.options.map((opt) => {
                const isSelected = selectedOptionId === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectCaseOption(opt.id)}
                    className={`w-full text-left p-4 rounded-lg border text-sm transition-all cursor-pointer ${
                      isSelected
                        ? opt.isCorrect
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-400 text-emerald-950 dark:text-emerald-200 ring-1 ring-emerald-400'
                          : 'bg-rose-50 dark:bg-rose-950/50 border-rose-400 text-rose-950 dark:text-rose-200 ring-1 ring-rose-400'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                          isSelected
                            ? opt.isCorrect
                              ? 'bg-emerald-600 border-emerald-600 text-white'
                              : 'bg-rose-600 border-rose-600 text-white'
                            : 'border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {isSelected ? (opt.isCorrect ? '✓' : '✕') : '•'}
                      </div>
                      <span className="leading-snug">{opt.text}</span>
                    </div>

                    {/* Result and Feedback */}
                    {isSelected && (
                      <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-700 pl-8 space-y-1">
                        <div
                          className={`text-xs font-bold ${
                            opt.isCorrect
                              ? 'text-emerald-800 dark:text-emerald-300'
                              : 'text-rose-800 dark:text-rose-300'
                          }`}
                        >
                          {opt.feedback}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                          Norma aplicable: {opt.applicableArticle}
                        </div>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Module Completion Action */}
      <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg p-5 flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors">
        <div>
          <div className="text-sm font-bold text-emerald-950 dark:text-emerald-200">
            {isCompleted || hasMarkedCompleted
              ? 'Módulo 02 completado exitosamente'
              : '¿Has explorado los 5 capítulos del reglamento?'}
          </div>
          <div className="text-xs text-emerald-800 dark:text-emerald-300">
            Ahora conoces las normas y principios vigentes para presentar la evaluación de conocimientos y certificar tu inducción.
          </div>
        </div>

        <button
          onClick={handleComplete}
          className="px-5 py-2 text-xs font-semibold text-white bg-[#39A900] hover:bg-[#2e8600] rounded-md transition-colors whitespace-nowrap cursor-pointer shadow-xs"
        >
          {isCompleted || hasMarkedCompleted ? 'Módulo Completado ✓' : 'Marcar Módulo como Visto'}
        </button>
      </div>
    </section>
  );
};
