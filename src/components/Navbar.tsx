import React from 'react';
import { UserRole, ApprenticeProfile, InstructorProfile } from '../types/sena';
import { SenaLogo } from '../constants/brand';
import { Sun, Moon, LogOut, GraduationCap, Users, BookOpen, Play } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currentApprentice?: ApprenticeProfile;
  currentInstructor?: InstructorProfile;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenRolePortal: () => void;
  onOpenManual?: () => void;
  onOpenVideoTutorial?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentRole,
  setCurrentRole,
  currentApprentice,
  currentInstructor,
  isDarkMode,
  onToggleDarkMode,
  onOpenRolePortal,
  onOpenManual,
  onOpenVideoTutorial,
}) => {
  const isPortal = activeTab === 'portal';

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 sm:px-6 py-3">
        {/* Brand Lockup */}
        <button
          onClick={onOpenRolePortal}
          className="text-left group flex items-center gap-2.5 focus:outline-none cursor-pointer shrink-0"
          title="Ir al Portal de Inicio y Selección de Rol"
        >
          <SenaLogo className="w-8 h-8 shrink-0 text-[#39A900] group-hover:scale-105 transition-transform" />
          <div className="flex flex-col">
            <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white whitespace-nowrap group-hover:text-[#39A900] transition-colors leading-tight">
              SENA Inducción 360
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">
              Acuerdo 009 de 2024 · Ac. 002 de 2026
            </span>
          </div>
        </button>

        {/* Navigation Links (Visible when inside a role session) */}
        {!isPortal && (
          <nav className="hidden md:flex items-center gap-5 text-xs font-semibold text-slate-600 dark:text-slate-300">
            {currentRole === 'apprentice' ? (
              <>
                <button
                  onClick={() => setActiveTab('inicio')}
                  className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 cursor-pointer ${
                    activeTab === 'inicio'
                      ? 'text-[#39A900] dark:text-[#4ade80] border-[#39A900] dark:border-[#4ade80]'
                      : 'border-transparent text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Inicio
                </button>
                <button
                  onClick={() => setActiveTab('identidad')}
                  className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 cursor-pointer ${
                    activeTab === 'identidad'
                      ? 'text-[#39A900] dark:text-[#4ade80] border-[#39A900] dark:border-[#4ade80]'
                      : 'border-transparent text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Identidad y Símbolos
                </button>
                <button
                  onClick={() => setActiveTab('reglamento')}
                  className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 cursor-pointer ${
                    activeTab === 'reglamento'
                      ? 'text-[#39A900] dark:text-[#4ade80] border-[#39A900] dark:border-[#4ade80]'
                      : 'border-transparent text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Reglamento (5 Capítulos)
                </button>
                <button
                  onClick={() => setActiveTab('evaluacion')}
                  className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 cursor-pointer ${
                    activeTab === 'evaluacion'
                      ? 'text-[#39A900] dark:text-[#4ade80] border-[#39A900] dark:border-[#4ade80]'
                      : 'border-transparent text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Evaluación de Apropiación
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setActiveTab('instructor')}
                  className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 cursor-pointer ${
                    activeTab === 'instructor'
                      ? 'text-[#39A900] dark:text-[#4ade80] border-[#39A900] dark:border-[#4ade80]'
                      : 'border-transparent text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Panel de Gestión de Fichas
                </button>
                <button
                  onClick={() => setActiveTab('inicio')}
                  className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 cursor-pointer ${
                    activeTab === 'inicio'
                      ? 'text-[#39A900] dark:text-[#4ade80] border-[#39A900] dark:border-[#4ade80]'
                      : 'border-transparent text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Vista de Inducción
                </button>
                <button
                  onClick={() => setActiveTab('reglamento')}
                  className={`hover:text-slate-900 dark:hover:text-white transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 cursor-pointer ${
                    activeTab === 'reglamento'
                      ? 'text-[#39A900] dark:text-[#4ade80] border-[#39A900] dark:border-[#4ade80]'
                      : 'border-transparent text-slate-600 dark:text-slate-300'
                  }`}
                >
                  Consultar Reglamento
                </button>
              </>
            )}
          </nav>
        )}

        {/* Right Actions: Role Status Chip, Change Role / Logout, Dark Mode */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {!isPortal ? (
            <>
              {/* Active User Badge */}
              <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-xs">
                {currentRole === 'apprentice' ? (
                  <>
                    <GraduationCap className="w-3.5 h-3.5 text-[#39A900]" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[150px]">
                      {currentApprentice?.name || 'Aprendiz'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Ficha {currentApprentice?.ficha}
                    </span>
                  </>
                ) : (
                  <>
                    <Users className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                    <span className="font-semibold text-slate-800 dark:text-slate-200 truncate max-w-[150px]">
                      {currentInstructor?.name || 'Instructor'}
                    </span>
                    <span className="text-[10px] text-sky-600 dark:text-sky-400 font-bold">
                      Docente Líder
                    </span>
                  </>
                )}
              </div>

              {/* Quick Role Toggle */}
              <button
                onClick={() => {
                  const nextRole = currentRole === 'apprentice' ? 'instructor' : 'apprentice';
                  setCurrentRole(nextRole);
                  setActiveTab(nextRole === 'instructor' ? 'instructor' : 'inicio');
                }}
                className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                title={`Cambiar a vista de ${currentRole === 'apprentice' ? 'Instructor' : 'Aprendiz'}`}
              >
                {currentRole === 'apprentice' ? 'Cambiar a Instructor' : 'Cambiar a Aprendiz'}
              </button>

              {/* Back to Portal / Logout Button */}
              <button
                onClick={onOpenRolePortal}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 transition-colors cursor-pointer"
                title="Regresar a la página de inicio con selección de roles"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cambiar Rol / Inicio</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1.5 rounded-md border border-emerald-200 dark:border-emerald-800">
              <span className="w-2 h-2 rounded-full bg-[#39A900]"></span>
              <span>Portal de Acceso</span>
            </div>
          )}

          {/* Video Tutorial Button */}
          {onOpenVideoTutorial && (
            <button
              onClick={onOpenVideoTutorial}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-[#39A900]/40 bg-emerald-100/90 dark:bg-emerald-950/70 hover:bg-emerald-200 dark:hover:bg-emerald-900 text-emerald-900 dark:text-emerald-200 transition-colors cursor-pointer shadow-2xs group"
              title="Reproducir Video Tutorial Oficial de Inicio Rápido"
            >
              <Play className="w-3 h-3 fill-current text-[#39A900] group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Video Tutorial</span>
            </button>
          )}

          {/* Manual del Aprendiz Button */}
          {onOpenManual && (
            <button
              onClick={onOpenManual}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border border-[#39A900]/30 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 transition-colors cursor-pointer shadow-2xs"
              title="Abrir Manual de Usuario para Aprendices"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#39A900]" />
              <span className="hidden sm:inline">Manual</span>
            </button>
          )}

          {/* Dark / Light Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md border transition-all cursor-pointer whitespace-nowrap shrink-0 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-amber-300 border-slate-200 dark:border-slate-700 shadow-2xs"
            title={isDarkMode ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
            aria-label={isDarkMode ? 'Activar modo claro' : 'Activar modo oscuro'}
          >
            {isDarkMode ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="hidden md:inline">Claro</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                <span className="hidden md:inline">Oscuro</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mobile nav bar (only when inside a role session) */}
      {!isPortal && (
        <div className="md:hidden flex overflow-x-auto gap-2 px-4 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs">
          {currentRole === 'apprentice' ? (
            <>
              <button
                onClick={() => setActiveTab('inicio')}
                className={`whitespace-nowrap px-2.5 py-1 rounded cursor-pointer ${
                  activeTab === 'inicio'
                    ? 'bg-[#39A900] text-white font-medium'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Inicio
              </button>
              <button
                onClick={() => setActiveTab('identidad')}
                className={`whitespace-nowrap px-2.5 py-1 rounded cursor-pointer ${
                  activeTab === 'identidad'
                    ? 'bg-[#39A900] text-white font-medium'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Identidad
              </button>
              <button
                onClick={() => setActiveTab('reglamento')}
                className={`whitespace-nowrap px-2.5 py-1 rounded cursor-pointer ${
                  activeTab === 'reglamento'
                    ? 'bg-[#39A900] text-white font-medium'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Reglamento (5 Cap.)
              </button>
              <button
                onClick={() => setActiveTab('evaluacion')}
                className={`whitespace-nowrap px-2.5 py-1 rounded cursor-pointer ${
                  activeTab === 'evaluacion'
                    ? 'bg-[#39A900] text-white font-medium'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Evaluación
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveTab('instructor')}
                className={`whitespace-nowrap px-2.5 py-1 rounded cursor-pointer ${
                  activeTab === 'instructor'
                    ? 'bg-[#39A900] text-white font-medium'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Panel de Fichas
              </button>
              <button
                onClick={() => setActiveTab('inicio')}
                className={`whitespace-nowrap px-2.5 py-1 rounded cursor-pointer ${
                  activeTab === 'inicio'
                    ? 'bg-[#39A900] text-white font-medium'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Inducción
              </button>
              <button
                onClick={() => setActiveTab('reglamento')}
                className={`whitespace-nowrap px-2.5 py-1 rounded cursor-pointer ${
                  activeTab === 'reglamento'
                    ? 'bg-[#39A900] text-white font-medium'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Reglamento
              </button>
            </>
          )}

          <button
            onClick={onOpenRolePortal}
            className="whitespace-nowrap px-2.5 py-1 rounded cursor-pointer bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 ml-auto font-medium"
          >
            Cambiar Rol
          </button>
        </div>
      )}
    </header>
  );
};
