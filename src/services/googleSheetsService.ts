import { ApprenticeProfile, QuizResult } from '../types/sena';

export interface SpreadsheetInfo {
  spreadsheetId: string;
  spreadsheetUrl: string;
  title: string;
  lastSyncedAt: string;
}

const STORAGE_KEY = 'sena_sheets_config_2026';

export const getStoredSpreadsheetInfo = (): SpreadsheetInfo | null => {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const saveSpreadsheetInfo = (info: SpreadsheetInfo) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(info));
  }
};

export const clearSpreadsheetInfo = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
};

/**
 * Ensures the Google Sheets document exists in Google Drive.
 * If not already created, creates a new spreadsheet with the 2 required tabs:
 * 1. "Aprendices_Registrados"
 * 2. "Resultados_Evaluacion"
 */
export const ensureSpreadsheetExists = async (
  accessToken: string
): Promise<SpreadsheetInfo> => {
  const existing = getStoredSpreadsheetInfo();

  // Verify existing spreadsheet is accessible
  if (existing?.spreadsheetId) {
    try {
      const checkRes = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${existing.spreadsheetId}?fields=spreadsheetId,spreadsheetUrl,properties.title`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (checkRes.ok) {
        const data = await checkRes.json();
        return {
          spreadsheetId: data.spreadsheetId,
          spreadsheetUrl: data.spreadsheetUrl,
          title: data.properties?.title || existing.title,
          lastSyncedAt: new Date().toISOString(),
        };
      }
    } catch (e) {
      console.warn('No se pudo verificar la hoja existente, creando una nueva:', e);
    }
  }

  // Create new institutional spreadsheet
  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        title: 'SENA - Registro y Evaluaciones de Inducción 2026',
        locale: 'es_CO',
        timeZone: 'America/Bogota',
      },
      sheets: [
        {
          properties: {
            title: 'Aprendices_Registrados',
            gridProperties: {
              frozenRowCount: 1,
            },
          },
        },
        {
          properties: {
            title: 'Resultados_Evaluacion',
            gridProperties: {
              frozenRowCount: 1,
            },
          },
        },
      ],
    }),
  });

  if (!createRes.ok) {
    const errText = await createRes.text();
    throw new Error(`Error al crear la hoja en Google Drive: ${errText}`);
  }

  const createdData = await createRes.json();
  const spreadsheetId = createdData.spreadsheetId;
  const spreadsheetUrl = createdData.spreadsheetUrl;

  // Initialize Headers in Tab 1: Aprendices_Registrados
  const headersTab1 = [
    'Timestamp_Registro',
    'Nombres_Apellidos',
    'Tipo_Doc',
    'Numero_Doc',
    'Correo_Soy_SENA',
    'Numero_Ficha',
    'Programa_Formacion',
    'Regional',
    'Centro_Formacion',
    'Modulos_Completados',
    'Estado_Induccion',
    'Ultima_Actualizacion',
  ];

  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Aprendices_Registrados!A1:L1?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [headersTab1],
      }),
    }
  );

  // Initialize Headers in Tab 2: Resultados_Evaluacion
  const headersTab2 = [
    'Timestamp_Evaluacion',
    'Numero_Doc',
    'Nombres_Apellidos',
    'Numero_Ficha',
    'Correo_Soy_SENA',
    'Aciertos',
    'Total_Preguntas',
    'Porcentaje_Nota',
    'Juicio_Evaluativo',
    'Codigo_Certificado',
    'Estado_Certificacion',
  ];

  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Resultados_Evaluacion!A1:K1?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [headersTab2],
      }),
    }
  );

  const info: SpreadsheetInfo = {
    spreadsheetId,
    spreadsheetUrl,
    title: 'SENA - Registro y Evaluaciones de Inducción 2026',
    lastSyncedAt: new Date().toISOString(),
  };

  saveSpreadsheetInfo(info);
  return info;
};

/**
 * Upsert an apprentice into the "Aprendices_Registrados" sheet.
 * If document number already exists in column D, updates that row; otherwise appends.
 */
export const syncApprenticeToSheet = async (
  accessToken: string,
  apprentice: ApprenticeProfile
): Promise<void> => {
  const sheetInfo = await ensureSpreadsheetExists(accessToken);
  const now = new Date().toLocaleString('es-CO');

  const inductionStatus =
    apprentice.quizStatus === 'passed'
      ? 'Aprobada / Competente'
      : apprentice.completedModules.length >= 3
      ? 'En Evaluación'
      : apprentice.completedModules.length > 0
      ? 'En Progreso'
      : 'Iniciada';

  const rowValues = [
    apprentice.quizDate || now,
    apprentice.name,
    apprentice.documentType,
    apprentice.documentNumber,
    apprentice.email,
    apprentice.ficha,
    apprentice.programName,
    apprentice.regional,
    apprentice.center,
    apprentice.completedModules.join(', ') || 'Ninguno',
    inductionStatus,
    now,
  ];

  // Check if learner already exists in column D (Numero_Doc)
  const getColD = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetInfo.spreadsheetId}/values/Aprendices_Registrados!D:D`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  let targetRowIndex = -1;
  if (getColD.ok) {
    const data = await getColD.json();
    const rows: string[][] = data.values || [];
    for (let i = 0; i < rows.length; i++) {
      if (rows[i][0] && rows[i][0].toString().trim() === apprentice.documentNumber.trim()) {
        targetRowIndex = i + 1; // 1-indexed row number
        break;
      }
    }
  }

  if (targetRowIndex > 1) {
    // Update existing row
    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetInfo.spreadsheetId}/values/Aprendices_Registrados!A${targetRowIndex}:L${targetRowIndex}?valueInputOption=USER_ENTERED`,
      {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [rowValues],
        }),
      }
    );
  } else {
    // Append new row
    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetInfo.spreadsheetId}/values/Aprendices_Registrados!A1:append?valueInputOption=USER_ENTERED`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [rowValues],
        }),
      }
    );
  }

  saveSpreadsheetInfo({
    ...sheetInfo,
    lastSyncedAt: new Date().toISOString(),
  });
};

/**
 * Appends a quiz evaluation result to "Resultados_Evaluacion"
 * and updates the status in "Aprendices_Registrados".
 */
export const syncQuizResultToSheet = async (
  accessToken: string,
  apprentice: ApprenticeProfile,
  result: QuizResult
): Promise<void> => {
  const sheetInfo = await ensureSpreadsheetExists(accessToken);
  const now = result.date || new Date().toLocaleString('es-CO');
  const percentage = Math.round((result.score / result.totalQuestions) * 100);

  const evalRow = [
    now,
    apprentice.documentNumber,
    apprentice.name,
    apprentice.ficha,
    apprentice.email,
    result.score,
    result.totalQuestions,
    `${percentage}%`,
    result.passed ? 'COMPETENTE' : 'REQUIERE REFUERZO',
    result.passed
      ? apprentice.certificateId || `SENA-IND-${apprentice.ficha}-${apprentice.documentNumber.slice(-4)}`
      : 'N/A',
    result.passed ? 'Certificado Emitido' : 'Pendiente de Refuerzo',
  ];

  // Append to Resultados_Evaluacion
  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetInfo.spreadsheetId}/values/Resultados_Evaluacion!A1:append?valueInputOption=USER_ENTERED`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [evalRow],
      }),
    }
  );

  // Update learner in Aprendices_Registrados as well
  await syncApprenticeToSheet(accessToken, {
    ...apprentice,
    quizScore: result.score,
    quizTotal: result.totalQuestions,
    quizStatus: result.passed ? 'passed' : 'failed',
    quizDate: now,
    certificateId: result.passed
      ? apprentice.certificateId || `SENA-IND-${apprentice.ficha}-${apprentice.documentNumber.slice(-4)}`
      : undefined,
  });
};

/**
 * Syncs all learners into the Google Sheet in batch.
 */
export const syncAllLearnersBatch = async (
  accessToken: string,
  learners: ApprenticeProfile[]
): Promise<{ total: number; sheetUrl: string }> => {
  const sheetInfo = await ensureSpreadsheetExists(accessToken);

  for (const learner of learners) {
    await syncApprenticeToSheet(accessToken, learner);
    // If learner has a passed quiz, also ensure evaluation row is present
    if (learner.quizStatus === 'passed' && learner.quizScore !== undefined) {
      await syncQuizResultToSheet(accessToken, learner, {
        score: learner.quizScore,
        totalQuestions: learner.quizTotal || 12,
        percentage: Math.round(((learner.quizScore) / (learner.quizTotal || 12)) * 100),
        passed: true,
        date: learner.quizDate || new Date().toLocaleString('es-CO'),
        answers: [],
        timeSpentSeconds: 120,
      });
    }
  }

  saveSpreadsheetInfo({
    ...sheetInfo,
    lastSyncedAt: new Date().toISOString(),
  });

  return {
    total: learners.length,
    sheetUrl: sheetInfo.spreadsheetUrl,
  };
};
