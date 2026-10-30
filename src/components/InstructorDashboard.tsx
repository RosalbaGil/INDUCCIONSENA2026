import React, { useState, useMemo } from 'react';
import { ApprenticeProfile, CohortStats } from '../types/sena';
import { INITIAL_COHORTS } from '../data/senaData';
import { SenaLogo } from '../constants/brand';
import {
  FileSpreadsheet,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  HardDrive,
  Cloud,
  LogOut,
  Sparkles,
} from 'lucide-react';

interface InstructorDashboardProps {
  learners: ApprenticeProfile[];
  onSelectApprenticeForView: (apprentice: ApprenticeProfile) => void;
  onAddNewLearner: (learner: ApprenticeProfile) => void;
  onOpenCertificateForLearner: (learner: ApprenticeProfile) => void;
  isGoogleConnected?: boolean;
  googleUserEmail?: string | null;
  spreadsheetInfo?: {
    spreadsheetId: string;
    spreadsheetUrl: string;
    title: string;
    lastSyncedAt: string;
  } | null;
  isSyncingSheets?: boolean;
  onConnectGoogle?: () => Promise<void>;
  onDisconnectGoogle?: () => Promise<void>;
  onSyncAllToDrive?: () => Promise<void>;
}

export const InstructorDashboard: React.FC<InstructorDashboardProps> = ({
  learners,
  onSelectApprenticeForView,
  onAddNewLearner,
  onOpenCertificateForLearner,
  isGoogleConnected = false,
  googleUserEmail,
  spreadsheetInfo,
  isSyncingSheets = false,
  onConnectGoogle,
  onDisconnectGoogle,
  onSyncAllToDrive,
}) => {
  const [selectedFicha, setSelectedFicha] = useState<string>('todas');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isNewLearnerModalOpen, setIsNewLearnerModalOpen] = useState<boolean>(false);

  // New learner form state
  const [newName, setNewName] = useState<string>('');
  const [newDocType, setNewDocType] = useState<'CC' | 'TI'>('CC');
  const [newDocNum, setNewDocNum] = useState<string>('');
  const [newEmail, setNewEmail] = useState<string>('');
  const [newFicha, setNewFicha] = useState<string>('2824910');

  // Filter learners
  const filteredLearners = useMemo(() => {
    return learners.filter((l) => {
      const matchesFicha = selectedFicha === 'todas' || l.ficha === selectedFicha;
      const matchesStatus =
        statusFilter === 'todos' ||
        (statusFilter === 'passed' && l.quizStatus === 'passed') ||
        (statusFilter === 'failed' && l.quizStatus === 'failed') ||
        (statusFilter === 'pending' && (!l.quizStatus || l.quizStatus === 'not_taken'));

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        l.name.toLowerCase().includes(q) ||
        l.documentNumber.includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.ficha.includes(q);

      return matchesFicha && matchesStatus && matchesSearch;
    });
  }, [learners, selectedFicha, statusFilter, searchQuery]);

  // Cohort Statistics calculations
  const totalLearners = learners.length;
  const passedLearners = learners.filter((l) => l.quizStatus === 'passed').length;
  const failedLearners = learners.filter((l) => l.quizStatus === 'failed').length;
  const pendingLearners = learners.filter(
    (l) => !l.quizStatus || l.quizStatus === 'not_taken'
  ).length;

  const averageScore = useMemo(() => {
    const scored = learners.filter((l) => l.quizScore !== undefined);
    if (scored.length === 0) return 0;
    const sum = scored.reduce((acc, curr) => acc + (curr.quizScore || 0), 0);
    return Math.round((sum / (scored.length * 12)) * 100);
  }, [learners]);

  const handleCreateLearner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newDocNum) return;

    const newLearner: ApprenticeProfile = {
      id: `apr-${Date.now()}`,
      name: newName,
      documentType: newDocType,
      documentNumber: newDocNum,
      username: newName.toLowerCase().replace(/\s+/g, ''),
      password: 'Password123*',
      email:
        newEmail && newEmail.endsWith('@soy.sena.edu.co')
          ? newEmail
          : newEmail
          ? `${newEmail.split('@')[0]}@soy.sena.edu.co`
          : `${newName.toLowerCase().replace(/\s+/g, '')}@soy.sena.edu.co`,
      ficha: newFicha,
      programName:
        newFicha === '2824910'
          ? 'Análisis y Desarrollo de Software (ADSO)'
          : newFicha === '2831002'
          ? 'Tecnólogo en Gestión Empresarial'
          : 'Técnico en Sistemas y Redes de Datos',
      center: 'Centro de Servicios y Gestión Empresarial',
      regional: 'Regional Antioquia',
      completedModules: [],
      quizStatus: 'not_taken',
    };

    onAddNewLearner(newLearner);
    setNewName('');
    setNewDocNum('');
    setNewEmail('');
    setIsNewLearnerModalOpen(false);
  };

  const handleExportCSV = () => {
    const headers = [
      'Nombre',
      'Tipo Doc',
      'Número Documento',
      'Ficha',
      'Programa',
      'Módulos Completados',
      'Puntaje Evaluación (12)',
      'Estado Inducción',
    ];

    const rows = filteredLearners.map((l) => [
      `"${l.name}"`,
      l.documentType,
      l.documentNumber,
      l.ficha,
      `"${l.programName}"`,
      l.completedModules.length,
      l.quizScore !== undefined ? l.quizScore : 'N/A',
      l.quizStatus === 'passed'
        ? 'Competente'
        : l.quizStatus === 'failed'
        ? 'Requiere Refuerzo'
        : 'Pendiente',
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `reporte_induccion_sena_${selectedFicha}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
      {/* Header */}
      <div className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2.5 text-xs text-slate-500 font-medium">
          <SenaLogo className="w-5 h-5 shrink-0" />
          <span className="text-[#39A900] font-semibold">Panel de Control</span>
          <span aria-hidden="true">·</span>
          <span>Gestión de Instructores y Coordinación</span>
          <span aria-hidden="true">·</span>
          <span>Seguimiento de Inducción</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Gestión del Proceso de Inducción de Aprendices
            </h2>
            <p className="text-slate-600 mt-1 max-w-2xl text-sm">
              Monitorea el avance de las fichas asignadas, diagnostica debilidades conceptuales del
              reglamento y emite constancias de aprobación.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsNewLearnerModalOpen(true)}
              className="px-4 py-2 text-xs font-semibold text-white bg-[#39A900] hover:bg-[#2e8600] rounded-md transition-colors cursor-pointer shadow-xs whitespace-nowrap"
            >
              + Matricular Aprendiz
            </button>
            <button
              onClick={handleExportCSV}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-md transition-colors cursor-pointer whitespace-nowrap"
            >
              Exportar CSV
            </button>
          </div>
        </div>
      </div>

      {/* Google Drive & Google Sheets Integration Hub */}
      <div className="bg-gradient-to-r from-emerald-50/80 via-white to-sky-50/80 dark:from-slate-900 dark:via-slate-800/90 dark:to-slate-900 border-2 border-emerald-500/30 dark:border-emerald-500/20 rounded-2xl p-6 sm:p-7 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-700 shadow-2xs flex items-center justify-center shrink-0 text-[#39A900]">
              <FileSpreadsheet className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <Cloud className="w-3.5 h-3.5 text-[#39A900]" />
                  Google Workspace
                </span>
                {isGoogleConnected ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500 text-white shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                    Sincronización en Tiempo Real Activa
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                    Pendiente de Conexión
                  </span>
                )}
              </div>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                Sincronización Automática con Google Drive y Google Sheets
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
                Almacena automáticamente en tiempo real los registros de aprendices, su avance por
                los 5 capítulos y las respuestas de la evaluación diagnóstica en dos pestañas estructuradas.
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto shrink-0">
            {isGoogleConnected ? (
              <>
                {spreadsheetInfo?.spreadsheetUrl && (
                  <a
                    href={spreadsheetInfo.spreadsheetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-[#0F9D58] hover:bg-[#0b8043] transition-all shadow-md hover:shadow-lg cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                    <span>Abrir en Google Drive / Sheets</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}

                <button
                  onClick={() => onSyncAllToDrive && onSyncAllToDrive()}
                  disabled={isSyncingSheets}
                  className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl font-semibold text-xs text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all cursor-pointer disabled:opacity-50"
                  title="Sincronizar todos los aprendices y notas a Google Sheets"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-[#39A900] ${isSyncingSheets ? 'animate-spin' : ''}`} />
                  <span>{isSyncingSheets ? 'Sincronizando...' : 'Sincronizar Todas las Fichas'}</span>
                </button>

                {onDisconnectGoogle && (
                  <button
                    onClick={() => onDisconnectGoogle()}
                    className="p-2.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                    title="Desconectar Google Workspace"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                )}
              </>
            ) : (
              <button
                onClick={() => onConnectGoogle && onConnectGoogle()}
                disabled={isSyncingSheets}
                className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl font-bold text-xs text-slate-800 dark:text-slate-100 bg-white dark:bg-slate-800 border-2 border-emerald-500 hover:border-emerald-600 shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50"
              >
                {/* Official Google Logo */}
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-4 h-4 shrink-0">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  <path fill="none" d="M0 0h48v48H0z" />
                </svg>
                <span>{isSyncingSheets ? 'Conectando...' : 'Conectar y Crear Hoja en Google Drive'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Live sync details banner */}
        <div className="pt-3 border-t border-slate-200/80 dark:border-slate-700/80 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-[#39A900] shrink-0" />
            <span>
              <strong>Pestaña 1:</strong> Aprendices_Registrados (Datos @soy.sena.edu.co y estado)
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-[#39A900] shrink-0" />
            <span>
              <strong>Pestaña 2:</strong> Resultados_Evaluacion (15 preguntas y certificado)
            </span>
          </div>

          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-mono text-[11px] justify-start md:justify-end">
            <HardDrive className="w-3.5 h-3.5 text-sky-600 shrink-0" />
            <span>
              {isGoogleConnected
                ? `Cuenta: ${googleUserEmail || 'Google Conectado'}`
                : 'Sin sincronizar con la nube de Google'}
            </span>
          </div>
        </div>
      </div>

      {/* Cohort KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="text-xs text-slate-500 font-medium">Total Aprendices Registrados</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">
            {totalLearners}
          </div>
          <div className="text-xs text-slate-500 mt-1">Distribuido en 3 Fichas activas</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="text-xs text-slate-500 font-medium">Inducción Aprobada (Competente)</div>
          <div className="text-2xl font-extrabold text-[#39A900] mt-1 font-mono">
            {passedLearners}{' '}
            <span className="text-xs font-normal text-slate-500">
              ({totalLearners > 0 ? Math.round((passedLearners / totalLearners) * 100) : 0}%)
            </span>
          </div>
          <div className="text-xs text-slate-500 mt-1">Cumplen estándar &ge; 80%</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="text-xs text-slate-500 font-medium">Requieren Plan de Refuerzo</div>
          <div className="text-2xl font-extrabold text-amber-600 mt-1 font-mono">
            {failedLearners}
          </div>
          <div className="text-xs text-slate-500 mt-1">Puntaje inferior a 10/12</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-5">
          <div className="text-xs text-slate-500 font-medium">Apropiación Global Promedio</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">
            {averageScore}%
          </div>
          <div className="text-xs text-slate-500 mt-1">{pendingLearners} aprendices sin evaluar</div>
        </div>
      </div>

      {/* Ficha & Filters Strip */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Ficha Selector Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setSelectedFicha('todas')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                selectedFicha === 'todas'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Todas las Fichas
            </button>
            {INITIAL_COHORTS.map((c) => (
              <button
                key={c.ficha}
                onClick={() => setSelectedFicha(c.ficha)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  selectedFicha === c.ficha
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Ficha {c.ficha}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="w-full md:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por aprendiz, documento..."
              className="w-full text-xs px-3.5 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#39A900] bg-slate-50 focus:bg-white"
            />
          </div>
        </div>

        {/* Status quick tabs */}
        <div className="flex items-center gap-2 pt-1 border-t border-slate-100 text-xs">
          <span className="text-slate-500">Filtrar estado:</span>
          <button
            onClick={() => setStatusFilter('todos')}
            className={`px-2.5 py-1 rounded cursor-pointer ${
              statusFilter === 'todos' ? 'bg-slate-200 font-semibold text-slate-900' : 'text-slate-600'
            }`}
          >
            Todos ({learners.length})
          </button>
          <button
            onClick={() => setStatusFilter('passed')}
            className={`px-2.5 py-1 rounded cursor-pointer ${
              statusFilter === 'passed' ? 'bg-emerald-100 font-semibold text-emerald-900' : 'text-slate-600'
            }`}
          >
            Competentes ({passedLearners})
          </button>
          <button
            onClick={() => setStatusFilter('failed')}
            className={`px-2.5 py-1 rounded cursor-pointer ${
              statusFilter === 'failed' ? 'bg-amber-100 font-semibold text-amber-900' : 'text-slate-600'
            }`}
          >
            Refuerzo ({failedLearners})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-2.5 py-1 rounded cursor-pointer ${
              statusFilter === 'pending' ? 'bg-slate-200 font-semibold text-slate-900' : 'text-slate-600'
            }`}
          >
            Pendientes ({pendingLearners})
          </button>
        </div>

        {/* Learners Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-semibold">
              <tr>
                <th className="px-4 py-3">Aprendiz</th>
                <th className="px-4 py-3">Documento</th>
                <th className="px-4 py-3">Ficha</th>
                <th className="px-4 py-3">Módulos</th>
                <th className="px-4 py-3">Evaluación</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredLearners.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    No se encontraron aprendices con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredLearners.map((learner) => {
                  const isPassed = learner.quizStatus === 'passed';
                  const isFailed = learner.quizStatus === 'failed';

                  return (
                    <tr key={learner.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">{learner.name}</div>
                        <div className="text-slate-500 text-[11px]">{learner.email}</div>
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-700">
                        {learner.documentType} {learner.documentNumber}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-mono font-semibold text-slate-900">{learner.ficha}</div>
                        <div className="text-slate-500 text-[11px] truncate max-w-xs">
                          {learner.programName}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-[11px]">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              learner.completedModules.includes('identidad')
                                ? 'bg-emerald-500'
                                : 'bg-slate-300'
                            }`}
                            title="Identidad"
                          />
                          <span
                            className={`w-2 h-2 rounded-full ${
                              learner.completedModules.includes('reglamento')
                                ? 'bg-emerald-500'
                                : 'bg-slate-300'
                            }`}
                            title="Reglamento"
                          />
                          <span
                            className={`w-2 h-2 rounded-full ${
                              learner.completedModules.includes('evaluacion')
                                ? 'bg-emerald-500'
                                : 'bg-slate-300'
                            }`}
                            title="Evaluación"
                          />
                          <span className="text-slate-500 ml-1">
                            {learner.completedModules.length}/3
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono font-semibold">
                        {learner.quizScore !== undefined ? (
                          <span>
                            {learner.quizScore} / 12{' '}
                            <span className="text-slate-400 font-normal">
                              ({Math.round((learner.quizScore / 12) * 100)}%)
                            </span>
                          </span>
                        ) : (
                          <span className="text-slate-400 font-normal">Sin presentar</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {isPassed ? (
                          <span className="text-emerald-700 font-semibold">Competente</span>
                        ) : isFailed ? (
                          <span className="text-amber-700 font-semibold">Requiere Refuerzo</span>
                        ) : (
                          <span className="text-slate-500">En Proceso</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onSelectApprenticeForView(learner)}
                            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded text-[11px] font-medium transition-colors cursor-pointer"
                          >
                            Cargar Perfil
                          </button>

                          {isPassed && (
                            <button
                              onClick={() => onOpenCertificateForLearner(learner)}
                              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded text-[11px] font-medium transition-colors cursor-pointer"
                            >
                              Constancia
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pedagogical Reinforcement Diagnosis Panel */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 sm:p-8 space-y-6">
        <div>
          <div className="text-xs font-bold text-[#39A900] uppercase tracking-wider">
            Diagnóstico Pedagógico de Apropiación
          </div>
          <h3 className="text-xl font-bold text-slate-900 mt-1">
            Dificultades Conceptuales Detectadas en Fichas
          </h3>
          <p className="text-sm text-slate-600 mt-1">
            Identificación de temas del reglamento con menor tasa de acierto para planificar talleres
            de refuerzo formativo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <div className="text-xs font-semibold text-rose-600 uppercase">Tema Crítico #1</div>
            <h4 className="text-sm font-bold text-slate-900 mt-1">
              Medidas Formativas vs. Sanciones
            </h4>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              34% de los aprendices confunden el Plan de Mejoramiento (medida pedagógica preventiva)
              con una sanción formal como el condicionamiento de matrícula.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-700 font-mono">
              Recomendación: Taller de simulación de comités de evaluación.
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <div className="text-xs font-semibold text-amber-600 uppercase">Tema Crítico #2</div>
            <h4 className="text-sm font-bold text-slate-900 mt-1">
              Plazos de Justificación de Inasistencias
            </h4>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              28% de aprendices desconocen la regla de los 3 días hábiles para radicar incapacidades
              médicas o soporte de fuerza mayor ante coordinación.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-700 font-mono">
              Recomendación: Infografía en cartelera y recordatorio en Zajuna.
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-5">
            <div className="text-xs font-semibold text-emerald-600 uppercase">Tema Fuerte</div>
            <h4 className="text-sm font-bold text-slate-900 mt-1">
              Identidad, Misión y Símbolos
            </h4>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              96% de acierto en el reconocimiento del fundador Rodolfo Martínez Tono, los sectores
              del escudo y el significado del logo-símbolo.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-700 font-mono">
              Apropiación institucional consolidada con éxito.
            </div>
          </div>
        </div>
      </div>

      {/* New Learner Modal */}
      {isNewLearnerModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full border border-slate-200 shadow-xl overflow-hidden p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Matricular Nuevo Aprendiz</h3>
              <button
                onClick={() => setIsNewLearnerModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLearner} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Nombre Completo del Aprendiz *
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Ej: Daniel Fernando Suárez Gómez"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-[#39A900] outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Tipo Doc *</label>
                  <select
                    value={newDocType}
                    onChange={(e) => setNewDocType(e.target.value as 'CC' | 'TI')}
                    className="w-full px-2 py-2 border border-slate-300 rounded-md bg-white outline-none"
                  >
                    <option value="CC">CC</option>
                    <option value="TI">TI</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block font-medium text-slate-700 mb-1">
                    Número de Documento *
                  </label>
                  <input
                    type="text"
                    required
                    value={newDocNum}
                    onChange={(e) => setNewDocNum(e.target.value)}
                    placeholder="Ej: 1045982143"
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-[#39A900] outline-none"
                  >
                  </input>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Ficha de Formación *</label>
                <select
                  value={newFicha}
                  onChange={(e) => setNewFicha(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md bg-white outline-none"
                >
                  <option value="2824910">2824910 - ADSO (Análisis y Desarrollo de Software)</option>
                  <option value="2831002">2831002 - Gestión Empresarial</option>
                  <option value="2795412">2795412 - Sistemas y Redes de Datos</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">
                  Correo Institucional Soy SENA (Opcional - @soy.sena.edu.co)
                </label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="usuario@soy.sena.edu.co"
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-[#39A900] outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewLearnerModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-md"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-white bg-[#39A900] hover:bg-[#2e8600] font-semibold rounded-md shadow-xs cursor-pointer"
                >
                  Registrar en Inducción
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
