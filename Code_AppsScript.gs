// ═══════════════════════════════════════════════════════════════════
//  OW MATCH LOGGER — Google Apps Script  (Code.gs)
//  Versión corregida: acepta GET con parámetros URL
// ═══════════════════════════════════════════════════════════════════
//
//  INSTRUCCIONES:
//  1. Extensiones → Apps Script → pega este código
//  2. Implementar → Nueva implementación
//     · Tipo: Aplicación web
//     · Ejecutar como: Yo mismo
//     · Acceso: Cualquier persona  ← IMPORTANTE (no "con cuenta Google")
//  3. Autorizar → copiar URL → pegarla en OW_MatchLogger.html
//  4. Cada vez que modifiques el código: Nueva implementación (no editar)
// ═══════════════════════════════════════════════════════════════════

const SHEET_NAME = 'INPUT';  // ← nombre exacto de tu hoja

// ─── HANDLER GET (el que usa el app móvil) ────────────────────────
function doGet(e) {
  try {
    const p = e.parameter;   // URLSearchParams llegan aquí como objeto

    // Si no hay parámetro "mode" es solo un ping de prueba
    if (!p.mode) {
      return jsonResponse({ status: 'alive', time: new Date().toISOString() });
    }

    appendRow(p);
    return jsonResponse({ status: 'ok' });

  } catch (err) {
    return jsonResponse({ status: 'error', message: err.toString() });
  }
}

// ─── HANDLER POST (fallback / debug) ──────────────────────────────
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    appendRow(data);
    return jsonResponse({ status: 'ok' });
  } catch (err) {
    return jsonResponse({ status: 'error', message: err.toString() });
  }
}

// ─── HELPER: respuesta JSON con CORS ──────────────────────────────
function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ─── ORDEN DE COLUMNAS ────────────────────────────────────────────
// Ajusta al orden real de tu hoja INPUT
const COLUMNS = [
  'mode',          // Mode
  'map',           // Map
  'players',       // Specific player(s)
  'hero',          // Hero
  'heroBans',      // Hero bans
  'yourTeam',      // Your team
  'oppTeam',       // Opp. team
  'rank',          // Rank
  'rankPct',       // Rank %
  'modifiers',     // Modifier(s)
  'result',        // Result
  '',              // % Δ  ← fórmula automática en el sheet, va vacío
  'groupSize',     // Group size
  'dateTime',      // Date & time
  'leaver',        // Leaver
  'thrower',       // Thrower
  'smurf',         // Smurf
  'manco',         // Manco
  'obsoleto',      // Obsoleto
  'custom6',       // Custom 6
  'predictedRank', // Predicted rank
  'notes',         // Notes
];

// ─── INSERTAR FILA ────────────────────────────────────────────────
function appendRow(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error('Hoja "' + SHEET_NAME + '" no encontrada');

  const row = COLUMNS.map(key => {
    if (!key) return '';                         // columnas con fórmula
    const val = data[key];
    if (val === undefined || val === null) return '';
    return val;
  });

  sheet.appendRow(row);
}

// ─── PRUEBA MANUAL (ejecutar desde el editor) ─────────────────────
function testInsert() {
  const mock = {
    mode: 'RQ: Support',
    map: 'Oasis',
    players: 'jpGuerrero03#1689',
    hero: 'Illari',
    heroBans: 'Bastion, Jetpack Cat',
    yourTeam: '3',
    oppTeam: '1',
    rank: 'Platinum 1',
    rankPct: '45',
    modifiers: 'Expected',
    result: 'Win',
    groupSize: 'Duo (2)',
    dateTime: Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss'),
    leaver: 'None',
    thrower: 'None',
    smurf: 'None',
    manco: 'None',
    obsoleto: 'None',
    custom6: 'None',
    predictedRank: 'Platinum 1',
    notes: 'Test desde Apps Script',
  };
  appendRow(mock);
  Logger.log('✅ Fila insertada');
}
