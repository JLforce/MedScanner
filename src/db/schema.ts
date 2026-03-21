/**
 * Database Schema & Migrations for MedScanner
 * Uses SQLite with versioned schema
 * 
 * Version 1: Initial schema with core tables
 */

export const DB_SCHEMA_V1 = {
  /**
   * Medication History Table
   * Stores all scanned medications with full details
   */
  MEDICATION_HISTORY: `
    CREATE TABLE IF NOT EXISTS medication_history (
      id TEXT PRIMARY KEY,
      drug_name TEXT NOT NULL,
      dosage REAL NOT NULL,
      unit TEXT NOT NULL,
      scan_date INTEGER NOT NULL,
      raw_ocr_text TEXT,
      ocr_confidence REAL,
      parse_confidence REAL,
      flagged_interactions TEXT,
      notes TEXT,
      created_at INTEGER DEFAULT (CAST(unixepoch() AS integer))
    )
  `,

  /**
   * Current Medications Table
   * Tracks medications the user is actively taking
   */
  CURRENT_MEDICATIONS: `
    CREATE TABLE IF NOT EXISTS current_medications (
      id TEXT PRIMARY KEY,
      drug_name TEXT NOT NULL,
      dosage REAL NOT NULL,
      unit TEXT NOT NULL,
      date_added INTEGER NOT NULL,
      notes TEXT,
      created_at INTEGER DEFAULT (CAST(unixepoch() AS integer))
    )
  `,

  /**
   * Drug Interactions Database
   * Bundled interactions data - populated on first init
   */
  INTERACTIONS: `
    CREATE TABLE IF NOT EXISTS drug_interactions (
      id TEXT PRIMARY KEY,
      drug_1 TEXT NOT NULL,
      drug_2 TEXT NOT NULL,
      severity TEXT NOT NULL,
      description TEXT,
      recommendation TEXT,
      created_at INTEGER DEFAULT (CAST(unixepoch() AS integer))
    )
  `,

  /**
   * App Settings Table
   * Stores user preferences and configuration
   */
  APP_SETTINGS: `
    CREATE TABLE IF NOT EXISTS app_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      type TEXT DEFAULT 'string',
      updated_at INTEGER DEFAULT (CAST(unixepoch() AS integer))
    )
  `,
};

/**
 * Indices for performance
 * Indexed columns allow faster queries
 */
export const DB_INDICES = {
  MEDICATION_HISTORY_SCAN_DATE: `
    CREATE INDEX IF NOT EXISTS idx_medication_history_scan_date
    ON medication_history(scan_date DESC)
  `,

  MEDICATION_HISTORY_DRUG_NAME: `
    CREATE INDEX IF NOT EXISTS idx_medication_history_drug_name
    ON medication_history(drug_name COLLATE NOCASE)
  `,

  CURRENT_MEDICATIONS_DRUG_NAME: `
    CREATE INDEX IF NOT EXISTS idx_current_medications_drug_name
    ON current_medications(drug_name COLLATE NOCASE)
  `,

  INTERACTIONS_DRUG_LOOKUP: `
    CREATE INDEX IF NOT EXISTS idx_interactions_drug_lookup
    ON drug_interactions(drug_1 COLLATE NOCASE, drug_2 COLLATE NOCASE)
  `,
};

/**
 * Initial interaction data seed
 * Sample interaction data to bundle with app
 * 
 * In production, this would be sourced from:
 * - RxNav API (if building online version)
 * - DrugBank academic dataset
 * - OpenFDA database
 */
export const SAMPLE_INTERACTIONS_SEED = [
  {
    id: 'int_001',
    drug_1: 'warfarin',
    drug_2: 'aspirin',
    severity: 'severe',
    description: 'Increased bleeding risk. Both are blood thinners.',
    recommendation: 'Consult your doctor before taking together.',
  },
  {
    id: 'int_002',
    drug_1: 'metformin',
    drug_2: 'alcohol',
    severity: 'moderate',
    description: 'May increase risk of lactic acidosis.',
    recommendation: 'Limit alcohol consumption.',
  },
  {
    id: 'int_003',
    drug_1: 'lisinopril',
    drug_2: 'potassium',
    severity: 'moderate',
    description: 'May cause dangerously high potassium levels.',
    recommendation: 'Have potassium levels monitored regularly.',
  },
  {
    id: 'int_004',
    drug_1: 'simvastatin',
    drug_2: 'clarithromycin',
    severity: 'severe',
    description:
      'Increases statin levels, high risk of muscle damage. Use different antibiotic.',
    recommendation: 'Inform doctor - may need medication switch.',
  },
  {
    id: 'int_005',
    drug_1: 'prozac',
    drug_2: 'tramadol',
    severity: 'severe',
    description: 'Risk of serotonin syndrome, a potentially life-threatening condition.',
    recommendation: 'Avoid this combination. Consult doctor immediately.',
  },
  {
    id: 'int_006',
    drug_1: 'sertraline',
    drug_2: 'ibuprofen',
    severity: 'mild',
    description: 'May increase risk of gastrointestinal bleeding.',
    recommendation: 'Take with food. Monitor for unusual bleeding or bruising.',
  },
];

/**
 * Migration strategy
 * Versioned approach for future schema updates
 */
export interface Migration {
  version: number;
  description: string;
  up: string[]; // SQL statements to run
  down: string[]; // Rollback statements
}

export const MIGRATIONS: Migration[] = [
  {
    version: 1,
    description: 'Initial schema with core tables',
    up: Object.values(DB_SCHEMA_V1).concat(Object.values(DB_INDICES)),
    down: [
      'DROP TABLE IF EXISTS medication_history;',
      'DROP TABLE IF EXISTS current_medications;',
      'DROP TABLE IF EXISTS drug_interactions;',
      'DROP TABLE IF EXISTS app_settings;',
      'DROP INDEX IF EXISTS idx_medication_history_scan_date;',
      'DROP INDEX IF EXISTS idx_medication_history_drug_name;',
      'DROP INDEX IF EXISTS idx_current_medications_drug_name;',
      'DROP INDEX IF EXISTS idx_interactions_drug_lookup;',
    ],
  },
  // Future migrations go here (v2, v3, etc.)
];

/**
 * Get current schema version
 */
export const CURRENT_SCHEMA_VERSION = MIGRATIONS.length;

/**
 * SQL Queries - Common operations
 */
export const QUERIES = {
  // Medication History
  INSERT_MEDICATION: `
    INSERT INTO medication_history 
    (id, drug_name, dosage, unit, scan_date, raw_ocr_text, ocr_confidence, parse_confidence)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `,

  GET_MEDICATION_BY_ID: `
    SELECT * FROM medication_history WHERE id = ?
  `,

  GET_MEDICATION_HISTORY: `
    SELECT * FROM medication_history 
    ORDER BY scan_date DESC 
    LIMIT ?
  `,

  DELETE_MEDICATION: `
    DELETE FROM medication_history WHERE id = ?
  `,

  CLEAR_HISTORY: `
    DELETE FROM medication_history
  `,

  // Current Medications
  INSERT_CURRENT_MED: `
    INSERT INTO current_medications 
    (id, drug_name, dosage, unit, date_added)
    VALUES (?, ?, ?, ?, ?)
  `,

  GET_CURRENT_MEDS: `
    SELECT * FROM current_medications 
    ORDER BY date_added DESC
  `,

  REMOVE_CURRENT_MED: `
    DELETE FROM current_medications WHERE id = ?
  `,

  // Interactions
  GET_INTERACTIONS_FOR_DRUG: `
    SELECT * FROM drug_interactions
    WHERE drug_1 = ? OR drug_2 = ?
  `,

  FIND_INTERACTION: `
    SELECT * FROM drug_interactions
    WHERE (drug_1 = ? AND drug_2 = ?) OR (drug_1 = ? AND drug_2 = ?)
  `,

  // Settings
  SET_SETTING: `
    INSERT OR REPLACE INTO app_settings (key, value, type)
    VALUES (?, ?, ?)
  `,

  GET_SETTING: `
    SELECT value FROM app_settings WHERE key = ?
  `,

  // Stats
  GET_STATS: `
    SELECT 
      COUNT(*) as total_scans,
      (SELECT COUNT(*) FROM current_medications) as current_meds_count,
      MAX(scan_date) as last_scan_date
    FROM medication_history
  `,
};
