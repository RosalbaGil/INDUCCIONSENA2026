/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { User } from 'firebase/auth';
import { ApprenticeProfile, InstructorProfile, QuizResult, UserRole } from './types/sena';
import { INITIAL_LEARNERS, DEMO_INSTRUCTORS } from './data/senaData';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { InstitutionalSection } from './components/InstitutionalSection';
import { RightsDutiesSection } from './components/RightsDutiesSection';
import { AssessmentSection } from './components/AssessmentSection';
import { InstructorDashboard } from './components/InstructorDashboard';
import { CertificateModal } from './components/CertificateModal';
import { VideoTutorialModal } from './components/VideoTutorialModal';
import { RoleSelectionLanding } from './components/RoleSelectionLanding';
import { SenaLogo } from './constants/brand';
import {
  initAuth,
  googleSignIn,
  googleSignOut,
  getAccessToken,
  getCurrentUser,
} from './services/googleAuthService';
import {
  ensureSpreadsheetExists,
  syncApprenticeToSheet,
  syncQuizResultToSheet,
  syncAllLearnersBatch,
  getStoredSpreadsheetInfo,
  SpreadsheetInfo,
} from './services/googleSheetsService';

export default function App() {
  // Start on the dedicated Role Selection Landing page
  const [activeTab, setActiveTab] = useState<string>('portal');
  const [currentRole, setCurrentRole] = useState<UserRole>('apprentice');

  // Google Workspace Integration State
  const [googleUser, setGoogleUser] = useState<User | null>(() => getCurrentUser());
  const [googleToken, setGoogleToken] = useState<string | null>(() => getAccessToken());
  const [spreadsheetInfo, setSpreadsheetInfo] = useState<SpreadsheetInfo | null>(() =>
    getStoredSpreadsheetInfo()
  );
  const [isSyncingSheets, setIsSyncingSheets] = useState<boolean>(false);
  const tokenRef = useRef<string | null>(googleToken);
  tokenRef.current = googleToken;

  // Stored learners and instructors with localStorage persistence
  const [learners, setLearners] = useState<ApprenticeProfile[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sena_learners_2026');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return INITIAL_LEARNERS;
  });

  const [instructors, setInstructors] = useState<InstructorProfile[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sena_instructors_2026');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return DEMO_INSTRUCTORS;
  });

  const [currentApprentice, setCurrentApprentice] = useState<ApprenticeProfile>(() => {
    return learners[0] || INITIAL_LEARNERS[0];
  });
  const [currentInstructor, setCurrentInstructor] = useState<InstructorProfile>(() => {
    return instructors[0] || DEMO_INSTRUCTORS[0];
  });
  const [isCertificateOpen, setIsCertificateOpen] = useState<boolean>(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false);
  const [certificateApprentice, setCertificateApprentice] = useState<ApprenticeProfile>(() => {
    return learners[0] || INITIAL_LEARNERS[0];
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync learners and instructors to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sena_learners_2026', JSON.stringify(learners));
    }
  }, [learners]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('sena_instructors_2026', JSON.stringify(instructors));
    }
  }, [instructors]);

  // Dark Mode State & Blur Transition
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sena_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  const [isTransitioningTheme, setIsTransitioningTheme] = useState<boolean>(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleToggleDarkMode = () => {
    setIsTransitioningTheme(true);

    // Midpoint trigger: flip dark mode class and state during the blur peak
    setTimeout(() => {
      setIsDarkMode((prev) => {
        const nextMode = !prev;
        if (nextMode) {
          document.documentElement.classList.add('dark');
          localStorage.setItem('sena_theme', 'dark');
        } else {
          document.documentElement.classList.remove('dark');
          localStorage.setItem('sena_theme', 'light');
        }
        return nextMode;
      });
    }, 150);

    setTimeout(() => {
      setIsTransitioningTheme(false);
    }, 450);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Google Auth listener
  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setGoogleUser(user);
        setGoogleToken(token);
        tokenRef.current = token;
      },
      () => {
        setGoogleUser(null);
        setGoogleToken(null);
        tokenRef.current = null;
      }
    );
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe();
    };
  }, []);

  const handleConnectGoogle = async () => {
    try {
      setIsSyncingSheets(true);
      const authResult = await googleSignIn();
      if (authResult?.accessToken) {
        setGoogleUser(authResult.user);
        setGoogleToken(authResult.accessToken);
        tokenRef.current = authResult.accessToken;
        showToast('Conectado con Google. Creando / verificando hoja institucional en Drive...');

        const sheet = await ensureSpreadsheetExists(authResult.accessToken);
        setSpreadsheetInfo(sheet);

        // Sync current learners batch
        const batchResult = await syncAllLearnersBatch(authResult.accessToken, learners);
        setSpreadsheetInfo(getStoredSpreadsheetInfo());
        showToast(`¡Hoja creada en Google Drive! ${batchResult.total} aprendices sincronizados.`);
      }
    } catch (error: any) {
      console.error('Error al conectar Google Sheets:', error);
      showToast('No se pudo conectar con Google Drive. Revisa los permisos e intenta nuevamente.');
    } finally {
      setIsSyncingSheets(false);
    }
  };

  const handleDisconnectGoogle = async () => {
    try {
      await googleSignOut();
      setGoogleUser(null);
      setGoogleToken(null);
      tokenRef.current = null;
      showToast('Desconectado de Google Workspace.');
    } catch (err) {
      console.error('Error al desconectar Google:', err);
    }
  };

  const handleSyncAllToDrive = async () => {
    const token = tokenRef.current || getAccessToken();
    if (!token) {
      await handleConnectGoogle();
      return;
    }

    try {
      setIsSyncingSheets(true);
      const batchResult = await syncAllLearnersBatch(token, learners);
      setSpreadsheetInfo(getStoredSpreadsheetInfo());
      showToast(`¡Sincronización exitosa! ${batchResult.total} aprendices actualizados en Google Sheets.`);
    } catch (error: any) {
      console.error('Error al sincronizar:', error);
      showToast('Error al sincronizar con Google Sheets. Reconecta tu cuenta de Google.');
    } finally {
      setIsSyncingSheets(false);
    }
  };

  // Auth Handlers
  const handleLoginApprentice = (apprentice: ApprenticeProfile) => {
    setCurrentRole('apprentice');
    setCurrentApprentice(apprentice);
    setActiveTab('inicio');
    showToast(`Bienvenido al Aula de Inducción, ${apprentice.name}`);
  };

  const handleRegisterApprentice = (newApprentice: ApprenticeProfile) => {
    setLearners((prev) => [newApprentice, ...prev]);
    setCurrentRole('apprentice');
    setCurrentApprentice(newApprentice);
    setActiveTab('inicio');
    showToast(`¡Registro exitoso con ${newApprentice.email}! Bienvenido a tu inducción SENA.`);

    // Real-Time Sync to Google Drive
    const activeToken = tokenRef.current || getAccessToken();
    if (activeToken) {
      syncApprenticeToSheet(activeToken, newApprentice)
        .then(() => {
          setSpreadsheetInfo(getStoredSpreadsheetInfo());
          showToast('Registro sincronizado en tiempo real en Google Drive');
        })
        .catch((e) => console.warn('Sync error:', e));
    }
  };

  const handleLoginInstructor = (instructor: InstructorProfile) => {
    setCurrentRole('instructor');
    setCurrentInstructor(instructor);
    setActiveTab('instructor');
    showToast(`Bienvenido al Panel de Gestión, ${instructor.name}`);
  };

  const handleRegisterInstructor = (newInstructor: InstructorProfile) => {
    setInstructors((prev) => [newInstructor, ...prev]);
    setCurrentRole('instructor');
    setCurrentInstructor(newInstructor);
    setActiveTab('instructor');
    showToast(`¡Instructor registrado! Bienvenido al equipo de formación, ${newInstructor.name}`);
  };

  const handleOpenRolePortal = () => {
    setActiveTab('portal');
  };

  const handleMarkModuleCompleted = (moduleId: string) => {
    if (!currentApprentice.completedModules.includes(moduleId)) {
      const updatedModules = [...currentApprentice.completedModules, moduleId];
      const updatedApprentice: ApprenticeProfile = {
        ...currentApprentice,
        completedModules: updatedModules,
      };

      setCurrentApprentice(updatedApprentice);
      setLearners((prev) =>
        prev.map((l) => (l.id === updatedApprentice.id ? updatedApprentice : l))
      );
      showToast(`¡Módulo "${moduleId}" registrado como completado!`);

      // Real-Time Sync to Google Drive
      const activeToken = tokenRef.current || getAccessToken();
      if (activeToken) {
        syncApprenticeToSheet(activeToken, updatedApprentice)
          .then(() => setSpreadsheetInfo(getStoredSpreadsheetInfo()))
          .catch((e) => console.warn('Sync error:', e));
      }
    }
  };

  const handleSaveQuizResult = (result: QuizResult) => {
    const updatedApprentice: ApprenticeProfile = {
      ...currentApprentice,
      quizScore: result.score,
      quizTotal: result.totalQuestions,
      quizStatus: result.passed ? 'passed' : 'failed',
      quizDate: result.date,
      certificateId: result.passed
        ? currentApprentice.certificateId ||
          `SENA-IND-${currentApprentice.ficha}-${Math.floor(1000 + Math.random() * 9000)}`
        : undefined,
      completedModules: currentApprentice.completedModules.includes('evaluacion')
        ? currentApprentice.completedModules
        : [...currentApprentice.completedModules, 'evaluacion'],
    };

    setCurrentApprentice(updatedApprentice);
    setLearners((prev) =>
      prev.map((l) => (l.id === updatedApprentice.id ? updatedApprentice : l))
    );

    if (result.passed) {
      showToast('¡Evaluación aprobada con éxito! Juicio: COMPETENTE');
    } else {
      showToast('Evaluación enviada. Se sugiere revisar el reglamento y reforzar.');
    }

    // Real-Time Sync to Google Drive
    const activeToken = tokenRef.current || getAccessToken();
    if (activeToken) {
      syncQuizResultToSheet(activeToken, updatedApprentice, result)
        .then(() => {
          setSpreadsheetInfo(getStoredSpreadsheetInfo());
          showToast('Evaluación sincronizada en tiempo real en Google Sheets');
        })
        .catch((e) => console.warn('Sync error:', e));
    }
  };

  const handleOpenCertificate = (learner?: ApprenticeProfile) => {
    const target = learner || currentApprentice;
    setCertificateApprentice(target);
    setIsCertificateOpen(true);
  };

  const handleAddNewLearner = (newLearner: ApprenticeProfile) => {
    setLearners((prev) => [newLearner, ...prev]);
    showToast(`Aprendiz ${newLearner.name} registrado en la Ficha ${newLearner.ficha}`);

    // Real-Time Sync to Google Drive
    const activeToken = tokenRef.current || getAccessToken();
    if (activeToken) {
      syncApprenticeToSheet(activeToken, newLearner)
        .then(() => setSpreadsheetInfo(getStoredSpreadsheetInfo()))
        .catch((e) => console.warn('Sync error:', e));
    }
  };

  const handleSelectApprenticeForView = (learner: ApprenticeProfile) => {
    setCurrentApprentice(learner);
    setCurrentRole('apprentice');
    setActiveTab('inicio');
    showToast(`Vista de inducción cambiada al aprendiz: ${learner.name}`);
  };

  return (
    <div
      className={`min-h-screen flex flex-col bg-[#f8fafc] dark:bg-[#0b1324] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300 ${
        isTransitioningTheme ? 'theme-blur-active' : ''
      }`}
    >
      {/* Visual Blur Transition Overlay */}
      {isTransitioningTheme && (
        <div
          className="fixed inset-0 z-50 pointer-events-none backdrop-blur-md bg-white/20 dark:bg-black/30 transition-all duration-300"
          aria-hidden="true"
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 dark:bg-slate-800 text-white text-xs px-4 py-2.5 rounded-lg shadow-lg border border-slate-700 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#39A900]"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentRole={currentRole}
        setCurrentRole={(role) => {
          setCurrentRole(role);
          if (role === 'instructor') {
            setActiveTab('instructor');
          } else if (activeTab === 'instructor') {
            setActiveTab('inicio');
          }
        }}
        currentApprentice={currentApprentice}
        currentInstructor={currentInstructor}
        isDarkMode={isDarkMode}
        onToggleDarkMode={handleToggleDarkMode}
        onOpenRolePortal={handleOpenRolePortal}
        onOpenVideoTutorial={() => setIsVideoModalOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'portal' ? (
          <RoleSelectionLanding
            onLoginApprentice={handleLoginApprentice}
            onLoginInstructor={handleLoginInstructor}
            onRegisterApprentice={handleRegisterApprentice}
            onRegisterInstructor={handleRegisterInstructor}
            learners={learners}
            instructors={instructors}
          />
        ) : currentRole === 'instructor' && activeTab === 'instructor' ? (
          <InstructorDashboard
            learners={learners}
            onSelectApprenticeForView={handleSelectApprenticeForView}
            onAddNewLearner={handleAddNewLearner}
            onOpenCertificateForLearner={(learner) => handleOpenCertificate(learner)}
            isGoogleConnected={!!googleToken}
            googleUserEmail={googleUser?.email}
            spreadsheetInfo={spreadsheetInfo}
            isSyncingSheets={isSyncingSheets}
            onConnectGoogle={handleConnectGoogle}
            onDisconnectGoogle={handleDisconnectGoogle}
            onSyncAllToDrive={handleSyncAllToDrive}
          />
        ) : (
          <>
            {activeTab === 'inicio' && (
              <>
                <HeroBanner
                  currentApprentice={currentApprentice}
                  onNavigate={setActiveTab}
                  onViewCertificate={() => handleOpenCertificate(currentApprentice)}
                  onOpenVideoTutorial={() => setIsVideoModalOpen(true)}
                />

                {/* Combined preview strip for fast exploration */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-12">
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center transition-colors">
                    <div>
                      <div className="flex items-center gap-2 text-xs font-bold text-[#39A900] dark:text-[#4ade80] uppercase tracking-wider">
                        <SenaLogo className="w-4 h-4 shrink-0" />
                        <span>Ruta de Aprendizaje</span>
                      </div>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                        Tu camino como Aprendiz SENA
                      </h2>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
                        La inducción es la primera etapa de tu Formación Profesional Integral. Aquí
                        adquieres el compromiso ético, conoces a tus voceros, las instancias de
                        bienestar y las normas que garantizan tu desarrollo profesional en Colombia.
                      </p>

                      <div className="mt-6 flex flex-wrap gap-3">
                        <button
                          onClick={() => setActiveTab('identidad')}
                          className="px-4 py-2 text-xs font-semibold text-white bg-[#39A900] hover:bg-[#2e8600] rounded-md transition-colors cursor-pointer"
                        >
                          Comenzar Inducción
                        </button>
                        <button
                          onClick={() => setActiveTab('evaluacion')}
                          className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors cursor-pointer"
                        >
                          Ir a la Evaluación
                        </button>
                      </div>
                    </div>

                    <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shadow-xs">
                      <img
                        src="/src/assets/images/sena_apprentice_collaboration_1793115165814.jpg"
                        alt="Colaboración de aprendices SENA"
                        className="w-full h-56 object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'identidad' && (
              <InstitutionalSection
                onMarkCompleted={handleMarkModuleCompleted}
                isCompleted={currentApprentice.completedModules.includes('identidad')}
              />
            )}

            {activeTab === 'reglamento' && (
              <RightsDutiesSection
                onMarkCompleted={handleMarkModuleCompleted}
                isCompleted={currentApprentice.completedModules.includes('reglamento')}
              />
            )}

            {activeTab === 'evaluacion' && (
              <AssessmentSection
                apprentice={currentApprentice}
                onSaveQuizResult={handleSaveQuizResult}
                onOpenCertificate={() => handleOpenCertificate(currentApprentice)}
              />
            )}

            {activeTab === 'instructor' && (
              <InstructorDashboard
                learners={learners}
                onSelectApprenticeForView={handleSelectApprenticeForView}
                onAddNewLearner={handleAddNewLearner}
                onOpenCertificateForLearner={(learner) => handleOpenCertificate(learner)}
                isGoogleConnected={!!googleToken}
                googleUserEmail={googleUser?.email}
                spreadsheetInfo={spreadsheetInfo}
                isSyncingSheets={isSyncingSheets}
                onConnectGoogle={handleConnectGoogle}
                onDisconnectGoogle={handleDisconnectGoogle}
                onSyncAllToDrive={handleSyncAllToDrive}
              />
            )}
          </>
        )}
      </main>

      {/* Official Certificate Modal */}
      <CertificateModal
        apprentice={certificateApprentice}
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
      />

      {/* Floating Video Tutorial Modal */}
      <VideoTutorialModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
      />

      {/* Institutional Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <SenaLogo className="w-6 h-6 shrink-0" fill="#39a900" />
            <div className="flex items-center gap-2">
              <span className="font-bold text-white">SENA Inducción 360</span>
              <span aria-hidden="true">·</span>
              <span>Servicio Nacional de Aprendizaje - República de Colombia</span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Reglamento Acuerdo 009 de 2024 (Actualizado Acuerdo 002 de 2026)</span>
            <span aria-hidden="true">·</span>
            <span>SofiaPlus & Zajuna LMS</span>
            <span aria-hidden="true">·</span>
            <span>Línea Gratuita Nacional 01 8000 910 270</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
