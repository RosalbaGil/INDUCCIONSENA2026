import React, { useState, useEffect } from 'react';
import { QUIZ_QUESTIONS } from '../data/senaData';
import { ApprenticeProfile, QuizResult } from '../types/sena';
import { SenaLogo } from '../constants/brand';

interface AssessmentSectionProps {
  apprentice: ApprenticeProfile;
  onSaveQuizResult: (result: QuizResult) => void;
  onOpenCertificate: () => void;
}

export const AssessmentSection: React.FC<AssessmentSectionProps> = ({
  apprentice,
  onSaveQuizResult,
  onOpenCertificate,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isExamSubmitted, setIsExamSubmitted] = useState<boolean>(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [feedbackMode, setFeedbackMode] = useState<'instant' | 'exam'>('instant');

  // Timer effect
  useEffect(() => {
    let interval: number;
    if (isTimerRunning && !isExamSubmitted) {
      interval = window.setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, isExamSubmitted]);

  const currentQ = QUIZ_QUESTIONS[currentQuestionIndex];
  const totalQuestions = QUIZ_QUESTIONS.length;
  const answeredCount = Object.keys(selectedAnswers).length;

  const handleSelectOption = (optionIndex: number) => {
    if (isExamSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionIndex,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmitQuiz = () => {
    setIsTimerRunning(false);
    setIsExamSubmitted(true);

    let correctCount = 0;
    const answerBreakdown = QUIZ_QUESTIONS.map((q) => {
      const selected = selectedAnswers[q.id];
      const isCorrect = selected === q.correctAnswer;
      if (isCorrect) correctCount++;
      return {
        questionId: q.id,
        selectedOption: selected !== undefined ? selected : -1,
        isCorrect,
      };
    });

    const percentage = Math.round((correctCount / totalQuestions) * 100);
    const passed = percentage >= 80;

    const result: QuizResult = {
      score: correctCount,
      totalQuestions,
      percentage,
      passed,
      answers: answerBreakdown,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      timeSpentSeconds: timerSeconds,
    };

    setQuizResult(result);
    onSaveQuizResult(result);
  };

  const handleRestartQuiz = () => {
    setSelectedAnswers({});
    setIsExamSubmitted(false);
    setQuizResult(null);
    setCurrentQuestionIndex(0);
    setTimerSeconds(0);
    setIsTimerRunning(true);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const selectedForCurrent = selectedAnswers[currentQ.id];
  const hasAnsweredCurrent = selectedForCurrent !== undefined;
  const isCurrentCorrect = selectedForCurrent === currentQ.correctAnswer;

  return (
    <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
          <SenaLogo className="w-5 h-5 shrink-0" />
          <span className="text-[#39A900] dark:text-[#4ade80] font-semibold">Módulo 03</span>
          <span aria-hidden="true">·</span>
          <span>Apropiación de Conocimientos</span>
          <span aria-hidden="true">·</span>
          <span>Evaluación Formativa Integral</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Evaluación Interactiva de Inducción SENA
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mt-1 max-w-2xl text-sm">
              Valida tu apropiación de la identidad institucional, derechos, deberes y normas de
              convivencia. Puntaje mínimo para alcanzar juicio <strong>COMPETENTE</strong>: 80% (10/12).
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-lg shrink-0 transition-colors">
            <div>
              <span className="text-slate-500 dark:text-slate-400">Tiempo: </span>
              <span className="font-bold text-slate-900 dark:text-white">{formatTime(timerSeconds)}</span>
            </div>
            <div className="h-4 w-px bg-slate-200 dark:bg-slate-700" />
            <div>
              <span className="text-slate-500 dark:text-slate-400">Respondidas: </span>
              <span className="font-bold text-slate-900 dark:text-white">
                {answeredCount}/{totalQuestions}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Assessment Body */}
      {!isExamSubmitted ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Question Stage Column */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 space-y-6 transition-colors">
            {/* Question Top Meta */}
            <div className="flex items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-[#39A900] dark:text-[#4ade80] uppercase font-mono">
                  Pregunta {currentQuestionIndex + 1} de {totalQuestions}
                </span>
                <span className="text-slate-300 dark:text-slate-600">·</span>
                <span className="text-slate-500 dark:text-slate-400">{currentQ.categoryLabel}</span>
              </div>

              {/* Mode toggle */}
              <div className="flex items-center gap-1 p-0.5 bg-slate-100 dark:bg-slate-800 rounded text-xs">
                <button
                  onClick={() => setFeedbackMode('instant')}
                  className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                    feedbackMode === 'instant'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-semibold shadow-2xs'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                  title="Muestra si la respuesta es correcta al instante"
                >
                  Retroalimentación Inmediata
                </button>
                <button
                  onClick={() => setFeedbackMode('exam')}
                  className={`px-2 py-1 rounded transition-colors cursor-pointer ${
                    feedbackMode === 'exam'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-semibold shadow-2xs'
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                  title="Simula examen real sin pistas hasta el envío"
                >
                  Modo Examen
                </button>
              </div>
            </div>

            {/* Question Text */}
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white leading-snug">
              {currentQ.question}
            </h3>

            {/* Options List */}
            <div className="space-y-3 pt-2">
              {currentQ.options.map((optionText, optIdx) => {
                const isSelected = selectedForCurrent === optIdx;
                const showInstantFeedback = feedbackMode === 'instant' && hasAnsweredCurrent;
                const isOptionCorrect = optIdx === currentQ.correctAnswer;

                let optionClasses =
                  'bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-600';
                if (isSelected) {
                  if (showInstantFeedback) {
                    optionClasses = isOptionCorrect
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-400 text-emerald-950 dark:text-emerald-200 ring-1 ring-emerald-400'
                      : 'bg-rose-50 dark:bg-rose-950/50 border-rose-400 text-rose-950 dark:text-rose-200 ring-1 ring-rose-400';
                  } else {
                    optionClasses =
                      'bg-emerald-50 dark:bg-emerald-950/50 border-[#39A900] dark:border-[#4ade80] text-emerald-950 dark:text-emerald-200 ring-1 ring-[#39A900] dark:ring-[#4ade80]';
                  }
                } else if (showInstantFeedback && isOptionCorrect) {
                  optionClasses = 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-700 text-emerald-950 dark:text-emerald-200';
                }

                return (
                  <button
                    key={optIdx}
                    onClick={() => handleSelectOption(optIdx)}
                    className={`w-full text-left p-4 rounded-lg border text-sm transition-all cursor-pointer ${optionClasses}`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                          isSelected
                            ? 'bg-[#39A900] border-[#39A900] text-white'
                            : 'border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800'
                        }`}
                      >
                        {String.fromCharCode(65 + optIdx)}
                      </div>
                      <span className="leading-relaxed">{optionText}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Instant Feedback Panel */}
            {feedbackMode === 'instant' && hasAnsweredCurrent && (
              <div
                className={`p-4 rounded-lg border text-xs space-y-1.5 ${
                  isCurrentCorrect
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200'
                    : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-950 dark:text-amber-200'
                }`}
              >
                <div className="font-bold flex items-center gap-1.5">
                  <span>{isCurrentCorrect ? '✓ Respuesta Correcta' : '▲ Revisa el Fundamento:'}</span>
                </div>
                <p className="leading-relaxed">{currentQ.explanation}</p>
                <div className="text-slate-500 dark:text-slate-400 font-mono text-[11px] pt-1">
                  Fuente reglamentaria: {currentQ.regulationSource}
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={handlePrev}
                disabled={currentQuestionIndex === 0}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-md transition-colors cursor-pointer"
              >
                ← Anterior
              </button>

              <div className="flex items-center gap-2">
                {currentQuestionIndex < totalQuestions - 1 ? (
                  <button
                    onClick={handleNext}
                    className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 rounded-md transition-colors cursor-pointer shadow-xs"
                  >
                    Siguiente →
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={answeredCount < totalQuestions}
                    className="px-6 py-2 text-xs font-bold text-white bg-[#39A900] hover:bg-[#2e8600] disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed rounded-md transition-colors cursor-pointer shadow-xs"
                  >
                    Finalizar y Calificar
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Question Grid Navigator */}
          <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-6 transition-colors">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Navegador de Preguntas</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Haz clic en cualquier número para revisar o cambiar tu respuesta antes de calificar.
              </p>
            </div>

            {/* Matrix of numbers */}
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-4 gap-2.5">
              {QUIZ_QUESTIONS.map((q, idx) => {
                const isCurrent = idx === currentQuestionIndex;
                const isAnswered = selectedAnswers[q.id] !== undefined;

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`h-10 rounded-md text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${
                      isCurrent
                        ? 'ring-2 ring-[#39A900] bg-slate-900 dark:bg-slate-700 text-white shadow-xs'
                        : isAnswered
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Apprentice data card */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg text-xs space-y-1.5">
              <div className="font-bold text-slate-900 dark:text-white">{apprentice.name}</div>
              <div className="text-slate-600 dark:text-slate-300">
                Ficha: <span className="font-mono">{apprentice.ficha}</span>
              </div>
              <div className="text-slate-500 dark:text-slate-400">{apprentice.programName}</div>
            </div>

            {answeredCount < totalQuestions ? (
              <div className="text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 p-3 rounded border border-amber-200 dark:border-amber-800">
                Faltan {totalQuestions - answeredCount} preguntas por responder para poder calificar.
              </div>
            ) : (
              <button
                onClick={handleSubmitQuiz}
                className="w-full py-2.5 text-xs font-bold text-white bg-[#39A900] hover:bg-[#2e8600] rounded-md transition-colors cursor-pointer shadow-xs"
              >
                Enviar Evaluación Completa
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Exam Results Summary & Diagnosis */
        quizResult && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-10 space-y-8">
            <div className="text-center max-w-xl mx-auto space-y-3">
              <div
                className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  quizResult.passed
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-900'
                }`}
              >
                Juicio Evaluativo: {quizResult.passed ? 'COMPETENTE' : 'AÚN NO COMPETENTE'}
              </div>

              <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {quizResult.passed
                  ? '¡Felicitaciones! Has apropiado el proceso de inducción'
                  : 'Requiere Plan de Mejoramiento Formativo'}
              </h3>

              <p className="text-sm text-slate-600 leading-relaxed">
                {quizResult.passed
                  ? 'Demostraste un dominio sólido de la identidad, símbolos y reglamento del SENA. Puedes descargar tu constancia oficial de inducción.'
                  : 'Obtuviste menos del 80% mínimo requerido. Revisa el análisis de respuestas a continuación y realiza un nuevo intento para consolidar los conocimientos.'}
              </p>
            </div>

            {/* Scorecard Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center">
                <div className="text-xs text-slate-500">Puntaje Obtenido</div>
                <div className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">
                  {quizResult.score} / {quizResult.totalQuestions}
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center">
                <div className="text-xs text-slate-500">Porcentaje de Acierto</div>
                <div
                  className={`text-2xl font-extrabold mt-1 font-mono ${
                    quizResult.passed ? 'text-[#39A900]' : 'text-amber-600'
                  }`}
                >
                  {quizResult.percentage}%
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center">
                <div className="text-xs text-slate-500">Mínimo Aprobatorio</div>
                <div className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">
                  80% (10 aciertos)
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center">
                <div className="text-xs text-slate-500">Tiempo Empleado</div>
                <div className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">
                  {formatTime(quizResult.timeSpentSeconds)}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              {quizResult.passed && (
                <button
                  onClick={onOpenCertificate}
                  className="px-6 py-2.5 text-sm font-bold text-white bg-[#39A900] hover:bg-[#2e8600] rounded-md transition-colors shadow-xs cursor-pointer"
                >
                  Generar y Descargar Constancia Oficial
                </button>
              )}

              <button
                onClick={handleRestartQuiz}
                className="px-5 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-md transition-colors cursor-pointer"
              >
                Realizar Nuevo Intento
              </button>
            </div>

            {/* Detailed Answers Review */}
            <div className="pt-8 border-t border-slate-200 space-y-4">
              <h4 className="text-base font-bold text-slate-900">
                Auditoría Detallada de Preguntas y Respuestas:
              </h4>

              <div className="space-y-4">
                {QUIZ_QUESTIONS.map((q, idx) => {
                  const userAnswer = selectedAnswers[q.id];
                  const isCorrect = userAnswer === q.correctAnswer;

                  return (
                    <div
                      key={q.id}
                      className={`p-4 rounded-lg border text-sm ${
                        isCorrect
                          ? 'bg-emerald-50/40 border-emerald-200'
                          : 'bg-rose-50/40 border-rose-200'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="font-semibold text-slate-900">
                          {idx + 1}. {q.question}
                        </div>
                        <div
                          className={`text-xs font-bold uppercase shrink-0 ${
                            isCorrect ? 'text-emerald-700' : 'text-rose-700'
                          }`}
                        >
                          {isCorrect ? 'Correcta' : 'Incorrecta'}
                        </div>
                      </div>

                      <div className="mt-2 text-xs space-y-1">
                        <div>
                          <span className="text-slate-500">Tu respuesta: </span>
                          <span className="font-medium text-slate-900">
                            {userAnswer !== undefined ? q.options[userAnswer] : 'Sin responder'}
                          </span>
                        </div>

                        {!isCorrect && (
                          <div>
                            <span className="text-emerald-700 font-semibold">
                              Respuesta correcta:{' '}
                            </span>
                            <span className="font-medium text-emerald-950">
                              {q.options[q.correctAnswer]}
                            </span>
                          </div>
                        )}

                        <div className="text-slate-600 pt-1 leading-relaxed">
                          <strong>Fundamento:</strong> {q.explanation}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )
      )}
    </section>
  );
};
