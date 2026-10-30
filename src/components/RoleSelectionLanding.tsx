import React, { useState } from 'react';
import { ApprenticeProfile, InstructorProfile, UserRole } from '../types/sena';
import { SenaLogo } from '../constants/brand';
import { VideoTutorialModal } from './VideoTutorialModal';
import {
  GraduationCap,
  Users,
  Lock,
  Eye,
  EyeOff,
  Mail,
  User,
  CheckCircle2,
  AlertCircle,
  Building2,
  ArrowRight,
  Shield,
  KeyRound,
  IdCard,
  BookOpen,
  Sparkles,
  Play,
  Video,
} from 'lucide-react';

interface RoleSelectionLandingProps {
  onLoginApprentice: (apprentice: ApprenticeProfile) => void;
  onLoginInstructor: (instructor: InstructorProfile) => void;
  onRegisterApprentice: (apprentice: ApprenticeProfile) => void;
  onRegisterInstructor: (instructor: InstructorProfile) => void;
  learners: ApprenticeProfile[];
  instructors: InstructorProfile[];
}

export const RoleSelectionLanding: React.FC<RoleSelectionLandingProps> = ({
  onLoginApprentice,
  onLoginInstructor,
  onRegisterApprentice,
  onRegisterInstructor,
  learners,
  instructors,
}) => {
  // Selected role view: 'apprentice' or 'instructor'
  const [activeRole, setActiveRole] = useState<UserRole>('apprentice');

  // Sub-tabs for each role: 'login' | 'register'
  const [apprenticeMode, setApprenticeMode] = useState<'login' | 'register'>('login');
  const [instructorMode, setInstructorMode] = useState<'login' | 'register'>('login');

  // Video Tutorial Modal State
  const [isVideoModalOpen, setIsVideoModalOpen] = useState<boolean>(false);

  // ==========================================
  // APPRENTICE LOGIN STATE
  // ==========================================
  const [aprLoginIdentifier, setAprLoginIdentifier] = useState<string>('');
  const [aprLoginPassword, setAprLoginPassword] = useState<string>('');
  const [aprShowLoginPass, setAprShowLoginPass] = useState<boolean>(false);
  const [aprLoginError, setAprLoginError] = useState<string | null>(null);

  // ==========================================
  // APPRENTICE REGISTRATION STATE
  // ==========================================
  const [aprRegName, setAprRegName] = useState<string>('');
  const [aprRegDocType, setAprRegDocType] = useState<'CC' | 'TI' | 'CE' | 'PEP'>('CC');
  const [aprRegDocNum, setAprRegDocNum] = useState<string>('');
  const [aprRegEmailUser, setAprRegEmailUser] = useState<string>(''); // username part before @soy.sena.edu.co
  const [aprRegUsername, setAprRegUsername] = useState<string>('');
  const [aprRegPassword, setAprRegPassword] = useState<string>('');
  const [aprRegConfirmPass, setAprRegConfirmPass] = useState<string>('');
  const [aprRegFicha, setAprRegFicha] = useState<string>('2824910');
  const [aprRegProgram, setAprRegProgram] = useState<string>('Análisis y Desarrollo de Software (ADSO)');
  const [aprRegCenter, setAprRegCenter] = useState<string>('Centro de Servicios y Gestión Empresarial');
  const [aprRegRegional, setAprRegRegional] = useState<string>('Regional Antioquia');
  const [aprShowRegPass, setAprShowRegPass] = useState<boolean>(false);
  const [aprRegError, setAprRegError] = useState<string | null>(null);

  // ==========================================
  // INSTRUCTOR LOGIN STATE
  // ==========================================
  const [instLoginIdentifier, setInstLoginIdentifier] = useState<string>('');
  const [instLoginPassword, setInstLoginPassword] = useState<string>('');
  const [instShowLoginPass, setInstShowLoginPass] = useState<boolean>(false);
  const [instLoginError, setInstLoginError] = useState<string | null>(null);

  // ==========================================
  // INSTRUCTOR REGISTRATION STATE
  // ==========================================
  const [instRegName, setInstRegName] = useState<string>('');
  const [instRegDocType, setInstRegDocType] = useState<'CC' | 'TI' | 'CE' | 'PEP'>('CC');
  const [instRegDocNum, setInstRegDocNum] = useState<string>('');
  const [instRegEmail, setInstRegEmail] = useState<string>('');
  const [instRegRoleTitle, setInstRegRoleTitle] = useState<string>('Instructor Técnico Líder & Coordinador de Inducción');
  const [instRegUsername, setInstRegUsername] = useState<string>('');
  const [instRegPassword, setInstRegPassword] = useState<string>('');
  const [instRegConfirmPass, setInstRegConfirmPass] = useState<string>('');
  const [instRegRegional, setInstRegRegional] = useState<string>('Regional Antioquia');
  const [instRegCenter, setInstRegCenter] = useState<string>('Centro de Servicios y Gestión Empresarial');
  const [instRegFichas, setInstRegFichas] = useState<string>('2824910, 2831002');
  const [instShowRegPass, setInstShowRegPass] = useState<boolean>(false);
  const [instRegError, setInstRegError] = useState<string | null>(null);

  // ==========================================
  // HANDLERS - APPRENTICE
  // ==========================================
  const handleApprenticeLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAprLoginError(null);

    const identClean = aprLoginIdentifier.trim().toLowerCase();
    if (!identClean) {
      setAprLoginError('Ingresa tu usuario, correo @soy.sena.edu.co o número de documento.');
      return;
    }
    if (!aprLoginPassword) {
      setAprLoginError('Ingresa tu contraseña de acceso.');
      return;
    }

    // Search learner
    const matched = learners.find((l) => {
      const matchEmail = l.email.toLowerCase() === identClean;
      const matchDoc = l.documentNumber.trim() === identClean;
      const matchUser = l.username && l.username.toLowerCase() === identClean;
      return matchEmail || matchDoc || matchUser;
    });

    if (!matched) {
      setAprLoginError(
        'No se encontró ningún aprendiz con estos datos. Verifica tu correo @soy.sena.edu.co o documento, o regístrate en la pestaña "Registrarse".'
      );
      return;
    }

    // Check password
    const validPassword = matched.password || 'Password123*';
    if (aprLoginPassword !== validPassword) {
      setAprLoginError('Contraseña incorrecta. (Para cuentas demo, la contraseña es Password123*)');
      return;
    }

    onLoginApprentice(matched);
  };

  const handleSelectDemoApprentice = (learner: ApprenticeProfile) => {
    setAprLoginIdentifier(learner.email);
    setAprLoginPassword(learner.password || 'Password123*');
    setAprLoginError(null);
  };

  const handleApprenticeRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setAprRegError(null);

    if (!aprRegName.trim()) {
      setAprRegError('Por favor ingresa tus nombres y apellidos completos.');
      return;
    }
    if (!aprRegDocNum.trim()) {
      setAprRegError('Por favor ingresa tu número de documento.');
      return;
    }

    // Clean and validate Soy SENA email domain
    let finalEmail = aprRegEmailUser.trim().toLowerCase();
    if (!finalEmail) {
      setAprRegError('El correo institucional @soy.sena.edu.co es obligatorio.');
      return;
    }

    // If user didn't write @soy.sena.edu.co, append it
    if (!finalEmail.includes('@')) {
      finalEmail = `${finalEmail}@soy.sena.edu.co`;
    } else if (!finalEmail.endsWith('@soy.sena.edu.co')) {
      setAprRegError('El correo debe pertenecer exclusivamente al dominio @soy.sena.edu.co');
      return;
    }

    // Check if email or doc already registered
    const exists = learners.some(
      (l) => l.email.toLowerCase() === finalEmail || l.documentNumber === aprRegDocNum.trim()
    );
    if (exists) {
      setAprRegError('Ya existe un aprendiz registrado con este correo institucional o documento.');
      return;
    }

    if (!aprRegPassword || aprRegPassword.length < 6) {
      setAprRegError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (aprRegPassword !== aprRegConfirmPass) {
      setAprRegError('Las contraseñas no coinciden. Por favor verifícalas.');
      return;
    }

    const assignedUsername = aprRegUsername.trim() || finalEmail.split('@')[0];

    const newApprentice: ApprenticeProfile = {
      id: `apr-${Date.now()}`,
      name: aprRegName.trim(),
      username: assignedUsername,
      password: aprRegPassword,
      documentType: aprRegDocType,
      documentNumber: aprRegDocNum.trim(),
      email: finalEmail,
      ficha: aprRegFicha.trim() || '2824910',
      programName: aprRegProgram.trim(),
      center: aprRegCenter.trim(),
      regional: aprRegRegional.trim(),
      completedModules: [],
      quizStatus: 'not_taken',
    };

    onRegisterApprentice(newApprentice);
  };

  // ==========================================
  // HANDLERS - INSTRUCTOR
  // ==========================================
  const handleInstructorLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setInstLoginError(null);

    const identClean = instLoginIdentifier.trim().toLowerCase();
    if (!identClean) {
      setInstLoginError('Ingresa tu usuario, correo @sena.edu.co o número de documento.');
      return;
    }
    if (!instLoginPassword) {
      setInstLoginError('Ingresa tu contraseña de acceso.');
      return;
    }

    const matched = instructors.find((i) => {
      const matchEmail = i.email.toLowerCase() === identClean;
      const matchDoc = i.documentNumber && i.documentNumber.trim() === identClean;
      const matchUser = i.username && i.username.toLowerCase() === identClean;
      return matchEmail || matchDoc || matchUser;
    });

    if (!matched) {
      setInstLoginError(
        'No se encontró ningún instructor con estos datos. Verifica tus credenciales o regístrate en la pestaña "Registrarse".'
      );
      return;
    }

    const validPassword = matched.password || 'Password123*';
    if (instLoginPassword !== validPassword) {
      setInstLoginError('Contraseña incorrecta. (Para instructores demo, la contraseña es Password123*)');
      return;
    }

    onLoginInstructor(matched);
  };

  const handleSelectDemoInstructor = (instructor: InstructorProfile) => {
    setInstLoginIdentifier(instructor.email);
    setInstLoginPassword(instructor.password || 'Password123*');
    setInstLoginError(null);
  };

  const handleInstructorRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setInstRegError(null);

    if (!instRegName.trim()) {
      setInstRegError('Por favor ingresa tus nombres y apellidos completos.');
      return;
    }
    if (!instRegDocNum.trim()) {
      setInstRegError('Por favor ingresa tu número de documento.');
      return;
    }

    let finalEmail = instRegEmail.trim().toLowerCase();
    if (!finalEmail) {
      setInstRegError('El correo institucional @sena.edu.co es obligatorio.');
      return;
    }

    if (!finalEmail.includes('@')) {
      finalEmail = `${finalEmail}@sena.edu.co`;
    } else if (!finalEmail.endsWith('@sena.edu.co')) {
      setInstRegError('El correo del instructor debe pertenecer al dominio oficial @sena.edu.co');
      return;
    }

    const exists = instructors.some(
      (i) => i.email.toLowerCase() === finalEmail || (i.documentNumber && i.documentNumber === instRegDocNum.trim())
    );
    if (exists) {
      setInstRegError('Ya existe un instructor registrado con este correo o documento.');
      return;
    }

    if (!instRegPassword || instRegPassword.length < 6) {
      setInstRegError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (instRegPassword !== instRegConfirmPass) {
      setInstRegError('Las contraseñas no coinciden.');
      return;
    }

    const assignedFichasArray = instRegFichas
      .split(',')
      .map((f) => f.trim())
      .filter(Boolean);

    const newInstructor: InstructorProfile = {
      id: `inst-${Date.now()}`,
      name: instRegName.trim(),
      username: instRegUsername.trim() || finalEmail.split('@')[0],
      password: instRegPassword,
      documentType: instRegDocType,
      documentNumber: instRegDocNum.trim(),
      roleTitle: instRegRoleTitle.trim(),
      center: instRegCenter.trim(),
      regional: instRegRegional.trim(),
      email: finalEmail,
      assignedFichas: assignedFichasArray.length > 0 ? assignedFichasArray : ['2824910'],
    };

    onRegisterInstructor(newInstructor);
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 space-y-8 animate-fadeIn">
      {/* Header institucional */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-300 font-semibold shadow-xs">
          <SenaLogo className="w-4 h-4 shrink-0" />
          <span>Sistema Integrado de Inducción SENA 360</span>
          <span aria-hidden="true">·</span>
          <span>Vigencia 2026</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Portal de Acceso y Registro Institucional
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
          Selecciona tu rol en la comunidad SENA para iniciar sesión o registrar tu cuenta
          con tus credenciales y correo institucional.
        </p>

        {/* Video Tutorial CTA Button */}
        <div className="flex items-center justify-center pt-1">
          <button
            type="button"
            onClick={() => setIsVideoModalOpen(true)}
            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#39A900] to-emerald-600 hover:from-[#2e8600] hover:to-emerald-700 active:scale-[0.98] transition-all shadow-md hover:shadow-lg cursor-pointer group"
            title="Reproducir video tutorial oficial de la plataforma"
          >
            <div className="w-6 h-6 rounded-full bg-white/25 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play className="w-3.5 h-3.5 fill-current text-white ml-0.5" />
            </div>
            <span>Video Tutorial</span>
          </button>
        </div>
      </div>

      {/* Role Navigation Selector Tabs */}
      <div className="flex justify-center">
        <div className="p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-wrap gap-2 max-w-xl w-full">
          <button
            onClick={() => setActiveRole('apprentice')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
              activeRole === 'apprentice'
                ? 'bg-[#39A900] text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/60'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Aprendiz SENA</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                activeRole === 'apprentice' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              @soy.sena.edu.co
            </span>
          </button>

          <button
            onClick={() => setActiveRole('instructor')}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
              activeRole === 'instructor'
                ? 'bg-[#00324D] text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/60'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Instructor / Inducción</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                activeRole === 'instructor' ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              @sena.edu.co
            </span>
          </button>
        </div>
      </div>

      {/* Main Form Panels Container */}
      <div className="max-w-4xl mx-auto">
        {/* ========================================================= */}
        {/* PANEL: ROL APRENDIZ */}
        {/* ========================================================= */}
        {activeRole === 'apprentice' && (
          <div className="bg-white dark:bg-slate-900 border-2 border-emerald-500/40 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden transition-all">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#39A900] to-emerald-400" />

            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-[#39A900] shrink-0">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#39A900]">
                    <span>Portal de Aprendices</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    {apprenticeMode === 'login' ? 'Iniciar Sesión como Aprendiz' : 'Registro de Nuevo Aprendiz'}
                  </h2>
                </div>
              </div>

              {/* Sub-tab toggle: Iniciar Sesión vs Registro */}
              <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => {
                    setApprenticeMode('login');
                    setAprRegError(null);
                  }}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    apprenticeMode === 'login'
                      ? 'bg-white dark:bg-slate-900 text-[#39A900] shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Iniciar Sesión
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setApprenticeMode('register');
                    setAprLoginError(null);
                  }}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    apprenticeMode === 'register'
                      ? 'bg-white dark:bg-slate-900 text-[#39A900] shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Registrarse
                </button>
              </div>
            </div>

            {/* Error message */}
            {(aprLoginError || aprRegError) && (
              <div className="mt-4 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-200 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{aprLoginError || aprRegError}</span>
              </div>
            )}

            {/* APPRENTICE LOGIN FORM */}
            {apprenticeMode === 'login' && (
              <div className="mt-6 space-y-6">
                <form onSubmit={handleApprenticeLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                      Usuario, Correo Soy SENA o Documento de Identidad
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={aprLoginIdentifier}
                        onChange={(e) => setAprLoginIdentifier(e.target.value)}
                        placeholder="ejemplo@soy.sena.edu.co o 1023849512"
                        className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      El correo para aprendices debe ser institucional con terminación <strong>@soy.sena.edu.co</strong>
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                      Contraseña
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={aprShowLoginPass ? 'text' : 'password'}
                        value={aprLoginPassword}
                        onChange={(e) => setAprLoginPassword(e.target.value)}
                        placeholder="Ingresa tu contraseña"
                        className="w-full pl-9 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                      />
                      <button
                        type="button"
                        onClick={() => setAprShowLoginPass(!aprShowLoginPass)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                        title={aprShowLoginPass ? 'Ocultar' : 'Mostrar'}
                      >
                        {aprShowLoginPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-[#39A900] hover:bg-[#2e8600] active:scale-[0.99] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    <span>Ingresar al Aula de Inducción</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                {/* Quick Demo Pre-fill Selector */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      Cuentas de prueba rápida (1 clic):
                    </span>
                    <span className="text-[11px] text-slate-500">Clave demo: Password123*</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {learners.slice(0, 4).map((learner) => (
                      <button
                        key={learner.id}
                        type="button"
                        onClick={() => handleSelectDemoApprentice(learner)}
                        className="text-left p-2.5 rounded-lg border border-slate-200 dark:border-slate-700/80 hover:border-emerald-500 dark:hover:border-emerald-500 bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 transition-all cursor-pointer group"
                      >
                        <div className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-400 truncate">
                          {learner.name}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate">
                          {learner.email}
                        </div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500">
                          Ficha {learner.ficha} · {learner.quizStatus === 'passed' ? 'Aprobó' : 'En proceso'}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* APPRENTICE REGISTER FORM */}
            {apprenticeMode === 'register' && (
              <form onSubmit={handleApprenticeRegister} className="mt-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Nombre completo */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                      Nombres y Apellidos Completos *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={aprRegName}
                        onChange={(e) => setAprRegName(e.target.value)}
                        placeholder="Ej. Mateo Gómez Pérez"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                      />
                    </div>
                  </div>

                  {/* Tipo de Documento */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                      Tipo de Documento *
                    </label>
                    <select
                      value={aprRegDocType}
                      onChange={(e) => setAprRegDocType(e.target.value as any)}
                      className="w-full py-2 px-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                    >
                      <option value="CC">Cédula de Ciudadanía (CC)</option>
                      <option value="TI">Tarjeta de Identidad (TI)</option>
                      <option value="CE">Cédula de Extranjería (CE)</option>
                      <option value="PEP">Permiso Especial de Permanencia (PEP)</option>
                    </select>
                  </div>

                  {/* Número de Documento */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                      Número de Documento *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <IdCard className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={aprRegDocNum}
                        onChange={(e) => setAprRegDocNum(e.target.value)}
                        placeholder="Ej. 1023849512"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                      />
                    </div>
                  </div>

                  {/* CORREO INSTITUCIONAL OBLIGATORIO: SOY SENA */}
                  <div className="sm:col-span-2">
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                        <span>Correo Institucional *</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-800">
                          Requerido: @soy.sena.edu.co
                        </span>
                      </label>
                      <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
                        Dominio institucional oficial
                      </span>
                    </div>

                    <div className="flex rounded-xl shadow-xs overflow-hidden border border-slate-300 dark:border-slate-700 focus-within:ring-2 focus-within:ring-[#39A900]">
                      <div className="pl-3 py-2 flex items-center pointer-events-none text-slate-400 bg-white dark:bg-slate-900">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={aprRegEmailUser}
                        onChange={(e) => {
                          const val = e.target.value.toLowerCase().replace(/\s/g, '');
                          setAprRegEmailUser(val);
                          // Auto set username if empty
                          if (!aprRegUsername) {
                            setAprRegUsername(val.split('@')[0]);
                          }
                        }}
                        placeholder="nombre.apellido"
                        className="flex-1 px-2.5 py-2 text-xs bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none font-mono"
                      />
                      <span className="inline-flex items-center px-3 text-xs font-mono font-bold bg-slate-100 dark:bg-slate-800 text-[#39A900] dark:text-[#4ade80] border-l border-slate-300 dark:border-slate-700">
                        @soy.sena.edu.co
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      Tu correo registrado quedará como:{' '}
                      <strong className="text-emerald-700 dark:text-emerald-400 font-mono">
                        {aprRegEmailUser
                          ? aprRegEmailUser.includes('@')
                            ? aprRegEmailUser
                            : `${aprRegEmailUser}@soy.sena.edu.co`
                          : 'tuusuario@soy.sena.edu.co'}
                      </strong>
                    </p>
                  </div>

                  {/* Nombre de usuario */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                      Nombre de Usuario (Opcional)
                    </label>
                    <input
                      type="text"
                      value={aprRegUsername}
                      onChange={(e) => setAprRegUsername(e.target.value)}
                      placeholder="Ej. mateo.gomez"
                      className="w-full py-2 px-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                    />
                  </div>

                  {/* Número de Ficha */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                      Número de Ficha *
                    </label>
                    <input
                      type="text"
                      required
                      value={aprRegFicha}
                      onChange={(e) => setAprRegFicha(e.target.value)}
                      placeholder="Ej. 2824910"
                      className="w-full py-2 px-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                    />
                  </div>

                  {/* Programa de Formación */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                      Programa de Formación *
                    </label>
                    <input
                      type="text"
                      required
                      value={aprRegProgram}
                      onChange={(e) => setAprRegProgram(e.target.value)}
                      placeholder="Ej. Análisis y Desarrollo de Software (ADSO)"
                      className="w-full py-2 px-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                    />
                  </div>

                  {/* Regional y Centro */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                      Regional *
                    </label>
                    <input
                      type="text"
                      required
                      value={aprRegRegional}
                      onChange={(e) => setAprRegRegional(e.target.value)}
                      placeholder="Ej. Regional Antioquia"
                      className="w-full py-2 px-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                      Centro de Formación *
                    </label>
                    <input
                      type="text"
                      required
                      value={aprRegCenter}
                      onChange={(e) => setAprRegCenter(e.target.value)}
                      placeholder="Ej. Centro de Servicios y Gestión Empresarial"
                      className="w-full py-2 px-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                    />
                  </div>

                  {/* Contraseña */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                      Contraseña (mínimo 6 caracteres) *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={aprShowRegPass ? 'text' : 'password'}
                        required
                        value={aprRegPassword}
                        onChange={(e) => setAprRegPassword(e.target.value)}
                        placeholder="Crea tu contraseña"
                        className="w-full pl-9 pr-10 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                      />
                      <button
                        type="button"
                        onClick={() => setAprShowRegPass(!aprShowRegPass)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      >
                        {aprShowRegPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirmar Contraseña */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                      Confirmar Contraseña *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <KeyRound className="w-4 h-4" />
                      </div>
                      <input
                        type={aprShowRegPass ? 'text' : 'password'}
                        required
                        value={aprRegConfirmPass}
                        onChange={(e) => setAprRegConfirmPass(e.target.value)}
                        placeholder="Repite la contraseña"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#39A900]"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-[#39A900] hover:bg-[#2e8600] active:scale-[0.99] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Completar Registro e Ingresar a Inducción</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-center text-[11px] text-slate-500 dark:text-slate-400 mt-2">
                    Al registrarte quedas vinculado con tu correo @soy.sena.edu.co para la inducción 2026.
                  </p>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* PANEL: ROL INSTRUCTOR */}
        {/* ========================================================= */}
        {activeRole === 'instructor' && (
          <div className="bg-white dark:bg-slate-900 border-2 border-sky-500/40 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden transition-all">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#00324D] to-sky-500" />

            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-[#00324D] dark:text-sky-400 shrink-0">
                  <Users className="w-7 h-7" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400">
                    <span>Portal de Instructores y Equipo de Formación</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    {instructorMode === 'login' ? 'Iniciar Sesión como Instructor' : 'Registro de Instructor'}
                  </h2>
                </div>
              </div>

              {/* Sub-tab toggle */}
              <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => {
                    setInstructorMode('login');
                    setInstRegError(null);
                  }}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    instructorMode === 'login'
                      ? 'bg-white dark:bg-slate-900 text-[#00324D] dark:text-sky-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Iniciar Sesión
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInstructorMode('register');
                    setInstLoginError(null);
                  }}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    instructorMode === 'register'
                      ? 'bg-white dark:bg-slate-900 text-[#00324D] dark:text-sky-400 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Registrarse
                </button>
              </div>
            </div>

            {/* Error message */}
            {(instLoginError || instRegError) && (
              <div className="mt-4 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-200 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{instLoginError || instRegError}</span>
              </div>
            )}

            {/* INSTRUCTOR LOGIN FORM */}
            {instructorMode === 'login' && (
              <div className="mt-6 space-y-6">
                <form onSubmit={handleInstructorLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                      Usuario, Correo Institucional @sena.edu.co o Documento
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        value={instLoginIdentifier}
                        onChange={(e) => setInstLoginIdentifier(e.target.value)}
                        placeholder="carlos.rodriguez@sena.edu.co o 79841203"
                        className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                      Contraseña
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={instShowLoginPass ? 'text' : 'password'}
                        value={instLoginPassword}
                        onChange={(e) => setInstLoginPassword(e.target.value)}
                        placeholder="Ingresa tu contraseña de instructor"
                        className="w-full pl-9 pr-10 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-600"
                      />
                      <button
                        type="button"
                        onClick={() => setInstShowLoginPass(!instShowLoginPass)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      >
                        {instShowLoginPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-[#00324D] hover:bg-[#002235] dark:bg-sky-700 dark:hover:bg-sky-600 active:scale-[0.99] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    <span>Ingresar al Panel de Gestión de Inducción</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                {/* Quick Demo Pre-fill Selector */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      Cuentas de instructor demo (1 clic):
                    </span>
                    <span className="text-[11px] text-slate-500">Clave demo: Password123*</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {instructors.map((instructor) => (
                      <button
                        key={instructor.id}
                        type="button"
                        onClick={() => handleSelectDemoInstructor(instructor)}
                        className="text-left p-2.5 rounded-lg border border-slate-200 dark:border-slate-700/80 hover:border-sky-500 dark:hover:border-sky-500 bg-slate-50 dark:bg-slate-800/60 hover:bg-sky-50/50 dark:hover:bg-sky-950/30 transition-all cursor-pointer group"
                      >
                        <div className="text-xs font-semibold text-slate-900 dark:text-white group-hover:text-sky-700 dark:group-hover:text-sky-400 truncate">
                          {instructor.name}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate">
                          {instructor.email}
                        </div>
                        <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                          {instructor.roleTitle}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* INSTRUCTOR REGISTER FORM */}
            {instructorMode === 'register' && (
              <form onSubmit={handleInstructorRegister} className="mt-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Nombre completo */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                      Nombres y Apellidos Completos *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={instRegName}
                        onChange={(e) => setInstRegName(e.target.value)}
                        placeholder="Ej. Ing. Carlos Alberto Rodríguez"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-600"
                      />
                    </div>
                  </div>

                  {/* Documento */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                      Tipo de Documento *
                    </label>
                    <select
                      value={instRegDocType}
                      onChange={(e) => setInstRegDocType(e.target.value as any)}
                      className="w-full py-2 px-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-600"
                    >
                      <option value="CC">Cédula de Ciudadanía (CC)</option>
                      <option value="CE">Cédula de Extranjería (CE)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                      Número de Documento *
                    </label>
                    <input
                      type="text"
                      required
                      value={instRegDocNum}
                      onChange={(e) => setInstRegDocNum(e.target.value)}
                      placeholder="Ej. 79841203"
                      className="w-full py-2 px-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-600"
                    />
                  </div>

                  {/* Correo institucional SENA */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                      Correo Institucional (@sena.edu.co) *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        required
                        value={instRegEmail}
                        onChange={(e) => setInstRegEmail(e.target.value.toLowerCase().trim())}
                        placeholder="usuario@sena.edu.co"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-600 font-mono"
                      />
                    </div>
                  </div>

                  {/* Cargo / Rol formativo */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                      Cargo / Rol en la Inducción *
                    </label>
                    <input
                      type="text"
                      required
                      value={instRegRoleTitle}
                      onChange={(e) => setInstRegRoleTitle(e.target.value)}
                      placeholder="Ej. Instructor Técnico Líder / Líder de Bienestar"
                      className="w-full py-2 px-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-600"
                    />
                  </div>

                  {/* Fichas asignadas */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                      Fichas Asignadas (separadas por coma) *
                    </label>
                    <input
                      type="text"
                      required
                      value={instRegFichas}
                      onChange={(e) => setInstRegFichas(e.target.value)}
                      placeholder="Ej. 2824910, 2831002, 2795412"
                      className="w-full py-2 px-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-600"
                    />
                  </div>

                  {/* Regional y Centro */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                      Regional *
                    </label>
                    <input
                      type="text"
                      required
                      value={instRegRegional}
                      onChange={(e) => setInstRegRegional(e.target.value)}
                      placeholder="Ej. Regional Antioquia"
                      className="w-full py-2 px-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                      Centro de Formación *
                    </label>
                    <input
                      type="text"
                      required
                      value={instRegCenter}
                      onChange={(e) => setInstRegCenter(e.target.value)}
                      placeholder="Ej. Centro de Servicios y Gestión Empresarial"
                      className="w-full py-2 px-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-600"
                    />
                  </div>

                  {/* Contraseña */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                      Contraseña *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={instShowRegPass ? 'text' : 'password'}
                        required
                        value={instRegPassword}
                        onChange={(e) => setInstRegPassword(e.target.value)}
                        placeholder="Mínimo 6 caracteres"
                        className="w-full pl-9 pr-10 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-600"
                      />
                      <button
                        type="button"
                        onClick={() => setInstShowRegPass(!instShowRegPass)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      >
                        {instShowRegPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Confirmar Contraseña */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1.5">
                      Confirmar Contraseña *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <KeyRound className="w-4 h-4" />
                      </div>
                      <input
                        type={instShowRegPass ? 'text' : 'password'}
                        required
                        value={instRegConfirmPass}
                        onChange={(e) => setInstRegConfirmPass(e.target.value)}
                        placeholder="Repite la contraseña"
                        className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-600"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-[#00324D] hover:bg-[#002235] dark:bg-sky-700 dark:hover:bg-sky-600 active:scale-[0.99] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Completar Registro e Ingresar al Panel</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>

      {/* Normative footer reminder */}
      <div className="text-center text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2">
        <Shield className="w-4 h-4 text-[#39A900]" />
        <span>
          Aprobación oficial: <strong>Acuerdo 009 de 2024</strong> (Reglamento del Aprendiz SENA) con adiciones del{' '}
          <strong>Acuerdo 002 de 2026</strong>.
        </span>
      </div>

      {/* Floating Video Tutorial Modal */}
      <VideoTutorialModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
      />
    </div>
  );
};
