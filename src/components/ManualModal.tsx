import React, { useState } from 'react';
import { BookOpen, X, Printer, CheckCircle, Search, HelpCircle, Shield, Award, Users, RefreshCw } from 'lucide-react';
import { SenaLogo } from '../constants/brand';

interface ManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManualModal: React.FC<ManualModalProps> = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState<'todos' | 'acceso' | 'modulos' | 'reglamento' | 'evaluacion' | 'drive' | 'faq'>('todos');
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-4xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="bg-[#1e293b] text-white px-6 py-4 flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#39A900] flex items-center justify-center text-white shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Manual de Usuario: Inducción SENA 360</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Vigencia 2026
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                Guía oficial para el Aprendiz SENA · Acuerdo 009 de 2024 / Ac. 002 de 2026
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer border border-slate-700"
              title="Imprimir o exportar manual a PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              title="Cerrar manual"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Navigation & Search Strip */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-xs font-medium">
            <button
              onClick={() => setActiveSection('todos')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                activeSection === 'todos'
                  ? 'bg-[#39A900] text-white font-bold'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              Guía Completa
            </button>
            <button
              onClick={() => setActiveSection('acceso')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                activeSection === 'acceso'
                  ? 'bg-[#39A900] text-white font-bold'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              Acceso y Registro
            </button>
            <button
              onClick={() => setActiveSection('modulos')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                activeSection === 'modulos'
                  ? 'bg-[#39A900] text-white font-bold'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              Módulos e Identidad
            </button>
            <button
              onClick={() => setActiveSection('reglamento')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                activeSection === 'reglamento'
                  ? 'bg-[#39A900] text-white font-bold'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              Reglamento (5 Cap.)
            </button>
            <button
              onClick={() => setActiveSection('evaluacion')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                activeSection === 'evaluacion'
                  ? 'bg-[#39A900] text-white font-bold'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              Evaluación y Constancia
            </button>
            <button
              onClick={() => setActiveSection('drive')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                activeSection === 'drive'
                  ? 'bg-[#39A900] text-white font-bold'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              Sincronización Drive
            </button>
            <button
              onClick={() => setActiveSection('faq')}
              className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                activeSection === 'faq'
                  ? 'bg-[#39A900] text-white font-bold'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100'
              }`}
            >
              Preguntas Frecuentes
            </button>
          </div>

          <div className="relative w-full sm:w-64 shrink-0">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar en el manual..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-[#39A900]"
            />
          </div>
        </div>

        {/* Scrollable Document Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
          {/* Section 1: Bienvenida */}
          {(activeSection === 'todos' || activeSection === 'acceso') && (
            <section className="bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 rounded-xl p-6 space-y-3">
              <div className="flex items-center gap-2.5 text-[#39A900] dark:text-[#4ade80] font-bold text-xs uppercase tracking-wider">
                <SenaLogo className="w-5 h-5 shrink-0" />
                <span>1. Bienvenida al Proceso de Inducción</span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Tu Inicio en la Formación Profesional Integral (FPI)
              </h3>
              <p>
                La plataforma <strong className="text-slate-900 dark:text-white">SENA Inducción 360</strong> es tu ambiente digital oficial para apropiar los valores, historia, derechos, deberes y normas que regirán tu etapa lectiva y productiva en el Servicio Nacional de Aprendizaje.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800/50">
                  <div className="font-bold text-emerald-800 dark:text-emerald-300">Normativa Vigente</div>
                  <div className="text-slate-600 dark:text-slate-400 mt-1">Acuerdo 009 de 2024 y Acuerdo 002 de 2026.</div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800/50">
                  <div className="font-bold text-emerald-800 dark:text-emerald-300">Criterio de Aprobación</div>
                  <div className="text-slate-600 dark:text-slate-400 mt-1">Mínimo 80% (12 de 15 aciertos) para juicio COMPETENTE.</div>
                </div>
                <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-emerald-200 dark:border-emerald-800/50">
                  <div className="font-bold text-emerald-800 dark:text-emerald-300">Certificación Oficial</div>
                  <div className="text-slate-600 dark:text-slate-400 mt-1">Constancia digital con código QR y validación en Drive.</div>
                </div>
              </div>
            </section>
          )}

          {/* Section 2: Requisitos y Acceso */}
          {(activeSection === 'todos' || activeSection === 'acceso') && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <Shield className="w-4 h-4 text-[#39A900]" />
                <span>2. Registro y Acceso con Correo SoySENA</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Requisitos Obligatorios para Aprendices
              </h3>
              <p>
                Para registrarte y garantizar la trazabilidad de tu formación, la plataforma exige los siguientes datos:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 marker:text-[#39A900]">
                <li><strong className="text-slate-900 dark:text-white">Correo institucional @soy.sena.edu.co:</strong> Requisito indispensable. Correos personales (@gmail, @hotmail, etc.) serán rechazados automáticamente por seguridad.</li>
                <li><strong className="text-slate-900 dark:text-white">Documento de identidad:</strong> Cédula de Ciudadanía (CC), Tarjeta de Identidad (TI), Cédula de Extranjería (CE) o Permiso por Protección Temporal (PPT).</li>
                <li><strong className="text-slate-900 dark:text-white">Ficha de Caracterización:</strong> Código numérico asignado a tu grupo en SofiaPlus (ej. 2874102).</li>
                <li><strong className="text-slate-900 dark:text-white">Contraseña de acceso:</strong> Puedes activar o desactivar la visibilidad con el ícono de ojo para verificar que la ingresaste correctamente.</li>
              </ul>
              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-lg text-amber-900 dark:text-amber-200 text-xs">
                💡 <strong>¿Deseas probar la plataforma primero?</strong> Puedes utilizar las cuentas demo disponibles en el portal para explorar la interfaz antes de crear tu perfil definitivo.
              </div>
            </section>
          )}

          {/* Section 3: Módulos de Aprendizaje */}
          {(activeSection === 'todos' || activeSection === 'modulos') && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <BookOpen className="w-4 h-4 text-[#39A900]" />
                <span>3. Módulo 1: Identidad y Símbolos Institucionales</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Apropiación de los Símbolos Patrios del SENA
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2">Fundador y Creación</h4>
                  <p className="text-xs">
                    Fundado en <strong>1957</strong> bajo la visión del ilustre cartagenero <strong>Rodolfo Martínez Tono</strong>, con apoyo de la OIT, gremios empresariales y sindicatos de trabajadores.
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2">El Escudo Institucional</h4>
                  <p className="text-xs">
                    Refleja los 3 sectores de la economía nacional: el <strong>Piñón</strong> (industria y construcción), el <strong>Caduceo</strong> (comercio y servicios) y la <strong>Rama de Café</strong> (agricultura).
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2">La Bandera y el Logo-símbolo</h4>
                  <p className="text-xs">
                    Bandera blanca que simboliza la paz y transparencia. El logo-símbolo plasma la figura humana erguida sobre caminos abiertos hacia el progreso y la transformación personal.
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2">Himno del SENA</h4>
                  <p className="text-xs">
                    Letra de Luis Alfredo Sánchez y música de Daniel Marlez. Encomia la juventud estudiosa y forjadora de la patria mediante el trabajo honrado.
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-500">
                👉 Recuerda presionar el botón <strong>"Marcar Módulo como Completado"</strong> al finalizar tu lectura para sumar tu avance oficial.
              </p>
            </section>
          )}

          {/* Section 4: Reglamento del Aprendiz */}
          {(activeSection === 'todos' || activeSection === 'reglamento') && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <Shield className="w-4 h-4 text-[#39A900]" />
                <span>4. Módulo 2: Derechos, Deberes y Reglamento (Ac. 009/2024 & Ac. 002/2026)</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Conoce tus Derechos, Obligaciones y el Debido Proceso
              </h3>
              <p>
                El reglamento del aprendiz fue actualizado para responder a las nuevas realidades digitales, formativas y laborales de Colombia:
              </p>
              <div className="space-y-2.5 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-slate-900 dark:text-white">Capítulo I: Principios y Pautas de Convivencia:</span> Promueve el respeto mutuo, la no discriminación, el uso responsable de las redes y la resolución pacífica de conflictos.
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-slate-900 dark:text-white">Capítulo II: Derechos del Aprendiz:</span> Derecho a recibir formación integral de excelencia, acceder a los servicios de Bienestar (salud, deporte, cultura, apoyos), ser escuchado y ejercer el debido proceso.
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-slate-900 dark:text-white">Capítulo III: Deberes del Aprendiz:</span> Portar visiblemente el carnet, asistir puntualmente a sesiones, no cometer fraude ni plagio y cuidar la infraestructura física y virtual.
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-slate-900 dark:text-white">Capítulo IV: Faltas Académicas y Disciplinarias:</span> Se dividen en leves, graves y gravísimas atendiendo criterios de intencionalidad y perjuicio.
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-slate-900 dark:text-white">Capítulo V: Medidas Formativas vs Sanciones:</span>
                  <div className="mt-1 text-slate-600 dark:text-slate-300">
                    • <em>Medidas Formativas:</em> Llamado de atención verbal y Plan de Mejoramiento (carácter formativo).<br />
                    • <em>Sanciones:</em> Condicionamiento o Cancelación de Matrícula (emitidas por Subdirección de Centro previo concepto del Comité).<br />
                    • <em>Justificación de Inasistencias:</em> Tienes un plazo estricto de <strong>3 días hábiles</strong> siguientes a la falta para radicar la justificación.
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Section 5: Evaluación y Certificación */}
          {(activeSection === 'todos' || activeSection === 'evaluacion') && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <Award className="w-4 h-4 text-[#39A900]" />
                <span>5. Módulo 3 y 4: Evaluación y Constancia Oficial</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Cómo Presentar la Prueba y Obtener tu Certificado
              </h3>
              <p>
                La prueba diagnóstica evalúa tu apropiación con 15 preguntas aleatorizadas:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-xl">
                  <h4 className="font-bold text-emerald-900 dark:text-emerald-200 text-sm mb-1">
                    Juicio: COMPETENTE (Aprobado)
                  </h4>
                  <p className="text-slate-700 dark:text-slate-300">
                    Alcanzando el <strong>80% o más</strong> (12 aciertos mínimos de 15). Se desbloquea de forma inmediata tu <strong>Constancia Oficial de Apropiación</strong> con código QR e ID de verificación.
                  </p>
                </div>
                <div className="border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/30 p-4 rounded-xl">
                  <h4 className="font-bold text-amber-900 dark:text-amber-200 text-sm mb-1">
                    Juicio: POR MEJORAR (Reintento)
                  </h4>
                  <p className="text-slate-700 dark:text-slate-300">
                    Si obtienes menos de 12 aciertos, revisa las retroalimentaciones en pantalla y pulsa el botón <strong>"Reiniciar Evaluación"</strong> para presentarla nuevamente sin límite de intentos.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Section 6: Sincronización Google Sheets */}
          {(activeSection === 'todos' || activeSection === 'drive') && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <RefreshCw className="w-4 h-4 text-[#39A900]" />
                <span>6. Auditoría y Sincronización Automática con Google Drive</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Trazabilidad Institucional en Tiempo Real
              </h3>
              <p>
                La plataforma sincroniza automáticamente tus logros con la hoja de cálculo institucional de Google Sheets gestionada por tus instructores:
              </p>
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                  <span className="w-2 h-2 rounded-full bg-[#39A900]"></span>
                  <span>Hoja "Aprendices_Registrados":</span>
                  <span className="font-normal text-slate-600 dark:text-slate-400">Guarda tu nombre, correo SoySENA, número de ficha y porcentaje de avance.</span>
                </div>
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>Hoja "Resultados_Evaluacion":</span>
                  <span className="font-normal text-slate-600 dark:text-slate-400">Registra tu puntaje porcentual, número de aciertos, juicio emitido y fecha/hora exacta.</span>
                </div>
              </div>
              <p className="text-xs text-slate-500">
                Esto garantiza que tu instructor cuente con la evidencia formal sin que tengas que enviar capturas de pantalla adicionales.
              </p>
            </section>
          )}

          {/* Section 7: FAQ */}
          {(activeSection === 'todos' || activeSection === 'faq') && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <HelpCircle className="w-4 h-4 text-[#39A900]" />
                <span>7. Preguntas Frecuentes y Solución de Problemas</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Respuestas a Dudas Comunes
              </h3>
              <div className="space-y-3 text-xs">
                <div className="border border-slate-200 dark:border-slate-700 p-3.5 rounded-lg bg-white dark:bg-slate-800/80">
                  <div className="font-bold text-slate-900 dark:text-white mb-1">
                    ¿Qué hago si no recuerdo mi contraseña o cerré la ventana?
                  </div>
                  <div className="text-slate-600 dark:text-slate-300">
                    Tu avance se guarda de manera segura en el navegador localmente. Puedes volver a ingresar con tu correo SoySENA y contraseña o usar el selector de aprendices si estás en el mismo equipo.
                  </div>
                </div>
                <div className="border border-slate-200 dark:border-slate-700 p-3.5 rounded-lg bg-white dark:bg-slate-800/80">
                  <div className="font-bold text-slate-900 dark:text-white mb-1">
                    ¿Cómo guardo mi constancia en mi celular o computador?
                  </div>
                  <div className="text-slate-600 dark:text-slate-300">
                    Abre el certificado y haz clic en el botón "Imprimir / Guardar PDF". En el cuadro de diálogo de tu navegador, selecciona "Guardar como PDF" como destino de impresión.
                  </div>
                </div>
                <div className="border border-slate-200 dark:border-slate-700 p-3.5 rounded-lg bg-white dark:bg-slate-800/80">
                  <div className="font-bold text-slate-900 dark:text-white mb-1">
                    ¿Cuál es el canal oficial de atención si requiero soporte adicional?
                  </div>
                  <div className="text-slate-600 dark:text-slate-300">
                    Puedes comunicarte con la Línea Gratuita Nacional 01 8000 910 270 o acercarte al área de Bienestar al Aprendiz en tu Centro de Formación.
                  </div>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-100 dark:bg-slate-800 px-6 py-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-[#39A900]" />
            <span>Documento oficial de inducción guardado en la raíz del proyecto: <code className="font-mono text-slate-800 dark:text-slate-200 font-bold">/manual</code></span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#39A900] hover:bg-[#2e8600] text-white font-bold rounded-lg transition-colors cursor-pointer"
          >
            Entendido, volver a la inducción
          </button>
        </div>
      </div>
    </div>
  );
};
