# Plan de Sincronización Automática con Google Sheets y Google Drive

Plan para la integración nativa entre el portal de inducción **SENA 360** y **Google Workspace (Google Drive & Google Sheets)**, garantizando que el registro de aprendices, el avance por módulos y los resultados de evaluación diagnóstica queden almacenados y sincronizados en tiempo real en la nube institucional.

---

### Decisiones Críticas y Preferencias Confirmadas

> [!IMPORTANT]
> **Decisiones validadas con el usuario:**
> - **Creación Automática en Drive**: Al conectar la cuenta de Google, el sistema creará automáticamente en Google Drive la hoja oficial titulada `SENA - Registro y Evaluaciones de Inducción 2026`.
> - **Sincronización en Tiempo Real**: Los datos se transmitirán automáticamente en segundo plano tras el registro inicial de cada aprendiz, al completar cada módulo formativo (*Identidad*, *Reglamento*) y al finalizar la evaluación de conocimientos.
> - **Estructura en Dos Pestañas**:
>   1. `Aprendices_Registrados`: Censo institucional de aprendices, datos de contacto `@soy.sena.edu.co`, documento, ficha, programa formativo y estado de avance.
>   2. `Resultados_Evaluacion`: Registro detallado de calificaciones, porcentaje de acierto, juicio evaluativo (*COMPETENTE* / *REQUIERE REFUERZO*), fecha y código de constancia digital.

---

## 1. Visión General del Flujo

```
┌────────────────────────────────────────────────────────────────────────┐
│                        APRENDIZ / INSTRUCTOR                          │
│  - Registro con correo @soy.sena.edu.co                                │
│  - Progreso en módulos: Identidad, Reglamento 5 Capítulos, Dilemas     │
│  - Presentación y envío de la Evaluación de Apropiación (15 preguntas) │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ Eventos en tiempo real
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│               SERVICIO DE SINCRONIZACIÓN GOOGLE SHEETS                 │
│  - Autenticación OAuth 2.0 (Scopes: spreadsheets, drive.file)          │
│  - Creación / Detección de Hoja Institucional en Google Drive          │
│  - Cola de eventos y actualización por lotes (Batch Update / Append)   │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │ Google Sheets REST API
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       GOOGLE DRIVE / GOOGLE SHEETS                     │
│  Archivo: "SENA - Registro y Evaluaciones de Inducción 2026"           │
│  ├─ Pestaña 1: [Aprendices_Registrados]                                │
│  └─ Pestaña 2: [Resultados_Evaluacion]                                 │
└────────────────────────────────────────────────────────────────────────┘
```

El instructor y el equipo de inducción contarán con un botón de acceso directo para abrir la hoja de cálculo en Google Drive con un solo clic, inspeccionar el estado de sincronización y forzar sincronizaciones manuales en caso de desconexión.

---

## 2. Experiencia de Usuario y Diseño de la Interfaz

### 2.1 Conexión con Google Drive
- **Barra de Estado en el Panel de Instructor**:
  - Indicador de estado: `Conectado a Google Drive` (verde) con el nombre de la hoja activa y enlace directo para abrirla en una pestaña nueva de Google Sheets.
  - Botón `Vincular / Crear Hoja en Drive` en caso de no estar autenticado aún.
  - Indicador de última sincronización (ej. *"Última sincronización: hace 5 segundos"*).

### 2.2 Notificaciones y Retroalimentación al Aprendiz
- Al registrarse con su correo `@soy.sena.edu.co`: Mensaje de confirmación y sincronización en la nube.
- Al culminar un módulo formativo o la evaluación: Microindicador no intrusivo *"Progreso guardado y sincronizado en la hoja institucional de Drive"*.
- Modo sin conexión tolerante: Si la conexión a Google Drive no está activa en ese instante, los datos se almacenan localmente en `localStorage` y se sincronizan en cuanto se restablezca la sesión.

---

## 3. Estructura y Columnas de la Hoja de Cálculo

### Pestaña 1: `Aprendices_Registrados`
| Columna | Nombre de Campo | Descripción / Formato |
| :--- | :--- | :--- |
| **A** | `Timestamp_Registro` | Fecha y hora exacta de registro (YYYY-MM-DD HH:MM:SS) |
| **B** | `Nombres_Apellidos` | Nombre completo del aprendiz |
| **C** | `Tipo_Documento` | CC, TI, CE, PEP |
| **D** | `Numero_Documento` | Documento de identidad |
| **E** | `Correo_Soy_SENA` | Correo oficial `@soy.sena.edu.co` |
| **F** | `Numero_Ficha` | Código de ficha de caracterización (ej. 2824910) |
| **G** | `Programa_Formacion` | Nombre del programa académico |
| **H** | `Regional` | Regional SENA correspondiente |
| **I** | `Centro_Formacion` | Nombre del centro formativo |
| **J** | `Modulos_Completados` | Lista de módulos completados (ej. *Identidad, Reglamento*) |
| **K** | `Estado_Induccion` | *Iniciada*, *En Progreso*, *Completada* |
| **L** | `Ultima_Actualizacion` | Fecha y hora del último evento |

### Pestaña 2: `Resultados_Evaluacion`
| Columna | Nombre de Campo | Descripción / Formato |
| :--- | :--- | :--- |
| **A** | `Timestamp_Evaluacion` | Fecha y hora de envío del examen |
| **B** | `Numero_Documento` | Llave foránea del aprendiz |
| **C** | `Nombres_Apellidos` | Nombre del evaluado |
| **D** | `Numero_Ficha` | Ficha asignada |
| **E** | `Correo_Soy_SENA` | Correo institucional |
| **F** | `Aciertos` | Preguntas correctas (sobre 15) |
| **G** | `Total_Preguntas` | 15 preguntas diagnósticas |
| **H** | `Porcentaje_Nota` | Porcentaje obtenido (0% - 100%) |
| **I** | `Juicio_Evaluativo` | `COMPETENTE` (≥ 80%) o `REQUIERE REFUERZO` (< 80%) |
| **J** | `Codigo_Certificado` | Identificador de constancia oficial digital |
| **K** | `Estado_Certificacion` | *Emitido* o *Pendiente de Refuerzo* |

---

## 4. Arquitectura Técnica y Estrategia de Implementación

### 4.1 Permisos y Scopes de Google Workspace OAuth
Para dar cumplimiento al principio de mínimo privilegio (*Least Privilege Principle*):
- `https://www.googleapis.com/auth/spreadsheets`: Para crear y actualizar las pestañas y celdas de la hoja.
- `https://www.googleapis.com/auth/drive.file`: Para crear el archivo en Google Drive del usuario sin solicitar acceso a todos los demás archivos personales de su Drive.

### 4.2 Módulo de Integración (`src/services/googleSheetsService.ts`)
- `ensureSpreadsheetExists()`:
  - Verifica si existe una hoja previamente guardada en la configuración local.
  - Si no existe, invoca `spreadsheets.create` con título `SENA - Registro y Evaluaciones de Inducción 2026`, creando las 2 pestañas preconfiguradas con cabeceras formateadas y estilo institucional verde SENA (`#39A900`).
- `syncApprenticeProfile(apprentice)`:
  - Realiza un *upsert* (actualización de fila existente buscando por número de documento o inserción al final con `spreadsheets.values.append`).
- `syncQuizResult(apprentice, quizResult)`:
  - Agrega el registro de auditoría en la pestaña `Resultados_Evaluacion`.
- `syncBatchAll(learners)`:
  - Permite volcar todos los aprendices existentes en el sistema a la hoja con una sola operación por lotes.

### 4.3 Puntos de Intercepción en la Aplicación
1. `src/App.tsx`:
   - En `handleRegisterApprentice`: Llama a `syncApprenticeProfile(newApprentice)`.
   - En `handleMarkModuleCompleted`: Actualiza la fila del aprendiz en Drive.
   - En `handleSaveQuizResult`: Llama a `syncQuizResult(currentApprentice, result)` y actualiza el estado en `Aprendices_Registrados`.
2. `src/components/InstructorDashboard.tsx`:
   - Agrega tarjeta de control y estado de **Google Drive & Sheets**:
     - Botón de conectar/reconectar Google Workspace.
     - Botón "Abrir Hoja en Google Drive".
     - Botón "Sincronizar Todas las Fichas Ahora".
     - Registro del último estado de sincronización con insignias de éxito/error.

---

## 5. Fases de Ejecución

1. **Fase 1: Configuración de Permisos OAuth**:
   - Iniciar el flujo de autorización para Google Sheets y Google Drive con la herramienta interactiva de AI Studio.
2. **Fase 2: Implementación del Servicio Google Sheets**:
   - Creación del servicio cliente para manejo de Google Sheets API (creación de plantilla, formateo de cabeceras, inserción y actualización por documento).
3. **Fase 3: Conexión de Eventos en Tiempo Real**:
   - Vincular el registro de aprendices, avance de módulos y finalización de evaluación al servicio de sincronización.
4. **Fase 4: Panel de Control en Dashboard de Instructores**:
   - Incorporar controles de visualización, apertura del archivo en Drive y sincronización masiva.
5. **Fase 5: Validación y Pruebas**:
   - Verificación de compilación sin errores, validación de persistencia y pruebas de flujo completo.
