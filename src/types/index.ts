/**
 * Core domain types for MedScanner
 * Defines all data structures used throughout the app
 */

// ============= OCR & Scanning =============

export interface TextDetectionResult {
  text: string;
  rawText?: string; // Alias for compatibility
  confidence?: number;
  blocks: TextBlock[];
  timestamp: number;
  processingTime?: number;
  frameSize?: { width: number; height: number };
}

export interface TextBlock {
  text: string;
  confidence: number;
  boundingBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

// ============= Parsed Medication Data =============

export interface ParsedMedication {
  drugName: string;
  dosage: number;
  unit: string; // mg, mcg, g, ml, IU
  rawText: string;
  confidence: number;
  requiresManualReview: boolean;
  reviewReason?: string;
}

export interface ParsedNutritionFacts {
  servingSize: string;
  calories: number;
  sodium: number; // in mg
  sugar: number; // in g
  protein: number; // in g
  fat: number; // in g
  carbs: number; // in g
  rawText: string;
  confidence: number;
}

// ============= Medication Management =============

export interface Medication {
  id: string;
  drugName: string;
  dosage: number;
  unit: string;
  scanDate: number; // timestamp
  rawOcrText: string;
  ocrConfidence: number;
  parseConfidence: number;
  flaggedInteractions?: Interaction[];
  notes?: string;
}

export interface CurrentMedication {
  id: string;
  drugName: string;
  dosage: number;
  unit: string;
  dateAdded: number; // timestamp
  notes?: string;
}

export interface HistoryEntry {
  id: string;
  medication: Medication;
  type: 'medication' | 'nutrition';
  scanDate: number;
  status: 'pending_review' | 'saved' | 'error';
}

// ============= Drug Interactions =============

export type InteractionSeverity = 'severe' | 'moderate' | 'mild';

export interface Interaction {
  id: string;
  drug1: string;
  drug2: string;
  severity: InteractionSeverity;
  description: string;
  recommendation?: string;
  medicalDisclaimerAcknowledged?: boolean;
}

export interface InteractionCheckResult {
  hasInteractions: boolean;
  interactions: Interaction[];
  checkedAgainst: CurrentMedication[];
  timestamp: number;
}

// ============= UI & State =============

export interface ScannerState {
  isScanning: boolean;
  isLocked: boolean;
  confidence: number;
  detectionFrameCount: number;
  lastDetectionTime: number;
}

export interface ReviewScreenData {
  rawText: string;
  parsed?: ParsedMedication;
  ocrConfidence: number;
  needsManualCorrection: boolean;
  suggestedCorrections?: string[];
}

export interface WarningScreenData {
  severity: InteractionSeverity;
  conflicts: Array<{
    currentMed: CurrentMedication;
    interaction: Interaction;
  }>;
  timestamp: number;
}

// ============= Settings & Preferences =============

export interface AppSettings {
  seniorModeEnabled: boolean;
  fontSizeMultiplier: number; // 1.0 = normal, 1.5 = senior mode
  confidenceThreshold: number; // 0-100
  autoSaveEnabled: boolean;
  hapticFeedbackEnabled: boolean;
  language: 'en' | 'fil';
  lastOnboardingVersion: number;
}

// ============= Error Handling =============

export interface AppError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: number;
  severity: 'info' | 'warning' | 'error' | 'critical';
}

export interface OCRError extends AppError {
  code: 'OCR_FAILED' | 'LOW_CONFIDENCE' | 'NO_TEXT_DETECTED' | 'FRAME_PROCESSING_ERROR';
}

export interface ParsingError extends AppError {
  code: 'PARSE_FAILED' | 'INVALID_FORMAT' | 'NO_DOSAGE_FOUND';
  rawText: string;
}

export interface DatabaseError extends AppError {
  code: 'DB_INIT_FAILED' | 'DB_QUERY_FAILED' | 'DB_WRITE_FAILED' | 'MIGRATION_FAILED';
}

// ============= API Contracts =============

export interface OCRServiceInterface {
  textRecognition(frameData: any): Promise<TextDetectionResult>;
  analyzeConfidence(result: TextDetectionResult): number;
}

export interface ParsingServiceInterface {
  parseAssets(text: string): Promise<ParsedMedication>;
  parseNutrition(text: string): Promise<ParsedNutritionFacts>;
  calculateConfidence(parsed: ParsedMedication, ocrConfidence: number): number;
}

export interface InteractionCheckerInterface {
  checkInteractions(newMed: ParsedMedication, currentMeds: CurrentMedication[]): Promise<Interaction[]>;
  getSeverity(drug1: string, drug2: string): Promise<InteractionSeverity | null>;
}

export interface DatabaseServiceInterface {
  init(): Promise<void>;
  saveMedication(med: Medication): Promise<string>;
  addToCurrentMeds(med: CurrentMedication): Promise<string>;
  getCurrentMeds(): Promise<CurrentMedication[]>;
  getMedicationHistory(limit?: number): Promise<Medication[]>;
  deleteMedication(id: string): Promise<void>;
  clearHistory(): Promise<void>;
}
