/**
 * App-wide constants, theme tokens, and configuration
 */

// ============= Theme Colors (Retro 1980s Aesthetic) =============

export const COLORS = {
  // Primary
  primary: '#00FFFF', // Cyan - main accent
  primaryDark: '#0080FF',
  primaryLight: '#00FFFF',

  // Status
  success: '#00FF00', // Lime green
  warning: '#FFB000', // Amber
  error: '#FF0000', // Red
  info: '#0080FF', // Blue

  // Background
  backgroundDark: '#0A0E27', // Dark blue-black
  backgroundMedium: '#1A1F3A',
  backgroundLight: '#2A3050',
  surfaceDefault: '#141829',

  // Text
  textPrimary: '#E0E0E0', // Light gray
  textSecondary: '#A0A0A0', // Medium gray
  textTertiary: '#606060', // Dark gray
  textInverse: '#0A0E27',

  // Borders
  border: '#00FFFF',
  borderMuted: '#0080FF',

  // Aliases for common usage
  CYAN: '#00FFFF',
  AMBER: '#FFB000',
  RED: '#FF0000',
  GREEN: '#00FF00',
  BLUE: '#0080FF',
  BG_DARK: '#0A0E27',
  BG_DARKER: '#141829',
  BG_MEDIUM: '#1A1F3A',
  TEXT_PRIMARY: '#E0E0E0',
  TEXT_SECONDARY: '#A0A0A0',
  ALERT_ORANGE: '#FFB000',
};

export const SEVERITY_COLORS = {
  severe: {
    background: '#FF0000',
    text: '#FFFFFF',
    border: '#FF0000',
  },
  moderate: {
    background: '#FFB000',
    text: '#0A0E27',
    border: '#FFB000',
  },
  mild: {
    background: '#0080FF',
    text: '#FFFFFF',
    border: '#0080FF',
  },
};

// ============= Typography =============

export const FONTS = {
  // Retro monospace fonts
  retro: {
    family: 'VT323',
    weight: '400',
  },
  retroAlt: {
    family: 'Share Tech Mono',
    weight: '400',
  },
  // Fallback
  default: {
    family: 'Courier New',
    weight: '400',
  },
  // Aliases for convenience
  VT323: 'VT323',
  SHARE_TECH_MONO: 'Share Tech Mono',
};

export const FONT_SIZES = {
  xs: 10,
  sm: 12,
  base: 14,
  lg: 16,
  xl: 18,
  '2xl': 20,
  '3xl': 24,
  '4xl': 28,
  '5xl': 32,
  '6xl': 36,
  '7xl': 42,
};

export const LINE_HEIGHTS = {
  tight: 1.2,
  normal: 1.5,
  relaxed: 1.75,
  loose: 2,
};

// ============= Spacing =============

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 40,
  '4xl': 48,
  // Aliases for convenience
  SMALL: 8,
  MEDIUM: 16,
  LARGE: 24,
  XLARGE: 32,
};

// ============= Layout & Touch Targets =============

export const TOUCH_TARGET_MIN = 48; // dp, WCAG accessible minimum
export const BUTTON_HEIGHT = 48;
export const BUTTON_HEIGHT_LARGE = 56;

// ============= Timing & Animations =============

export const ANIMATION_DURATION = {
  fast: 100,
  normal: 300,
  slow: 500,
  verySlow: 1000,
};

// ============= OCR & Detection =============

export const OCR_CONFIG = {
  CONFIDENCE_THRESHOLD: 0.60, // 60% minimum
  LOW_CONFIDENCE_THRESHOLD: 0.50,
  LOCK_ON_CONSECUTIVE_FRAMES: 5, // Must detect in 5+ consecutive frames
  FRAME_PROCESSING_INTERVAL: 300, // ms
  TEXT_DETECTION_TIMEOUT: 1500, // ms
  // Aliases
  MIN_FRAME_INTERVAL: 1500, // ms between frame processing
  STABILITY_THRESHOLD: 3, // Frames for text lock-on
  LOW_LIGHT_THRESHOLD: 0.3, // Brightness threshold
};

// ============= Parsing =============

export const PARSING_CONFIG = {
  CONFIDENCE_THRESHOLD: 0.70, // 70% for high confidence
  DOSAGE_UNITS: ['mg', 'mcg', 'g', 'ml', 'IU', 'units', 'percent'],
  MIN_DRUG_NAME_CONFIDENCE: 0.65,
};

// ============= Interaction Checking =============

export const INTERACTION_CONFIG = {
  CHECK_TIMEOUT: 500, // ms
  CACHE_ENABLED: true,
  CACHE_TTL: 3600000, // 1 hour
};

// ============= Database =============

export const DB_CONFIG = {
  NAME: 'MedScanner.db',
  VERSION: 1,
  TABLE_NAMES: {
    HISTORY: 'medication_history',
    CURRENT_MEDS: 'current_medications',
    INTERACTIONS: 'drug_interactions',
    SETTINGS: 'app_settings',
  },
};

// ============= Senior Mode Settings =============

export const SENIOR_MODE_CONFIG = {
  FONT_SIZE_MULTIPLIER: 1.5,
  SPACING_MULTIPLIER: 1.3,
  TOUCH_TARGET_MULTIPLIER: 1.2,
  SIMPLIFIED_UI: true,
  DEFAULT_HAPTIC_ENABLED: true,
};

// ============= Settings Defaults =============

export const DEFAULT_SETTINGS = {
  seniorModeEnabled: false,
  fontSizeMultiplier: 1.0,
  confidenceThreshold: 70,
  autoSaveEnabled: false,
  hapticFeedbackEnabled: true,
  language: 'en' as const,
  lastOnboardingVersion: 0,
};

// ============= Error Codes =============

export const ERROR_CODES = {
  // OCR Errors
  OCR_FAILED: 'OCR_FAILED',
  LOW_CONFIDENCE: 'LOW_CONFIDENCE',
  NO_TEXT_DETECTED: 'NO_TEXT_DETECTED',
  FRAME_PROCESSING_ERROR: 'FRAME_PROCESSING_ERROR',
  CAMERA_PERMISSION_DENIED: 'CAMERA_PERMISSION_DENIED',

  // Parsing Errors
  PARSE_FAILED: 'PARSE_FAILED',
  INVALID_FORMAT: 'INVALID_FORMAT',
  NO_DOSAGE_FOUND: 'NO_DOSAGE_FOUND',

  // Database Errors
  DB_INIT_FAILED: 'DB_INIT_FAILED',
  DB_QUERY_FAILED: 'DB_QUERY_FAILED',
  DB_WRITE_FAILED: 'DB_WRITE_FAILED',
  MIGRATION_FAILED: 'MIGRATION_FAILED',

  // Interaction Errors
  INTERACTION_CHECK_FAILED: 'INTERACTION_CHECK_FAILED',
  DATABASE_LOOKUP_FAILED: 'DATABASE_LOOKUP_FAILED',
};

// ============= Regulatory & Legal =============

export const MEDICAL_DISCLAIMER = `DISCLAIMER: This app is NOT a substitute for professional medical advice. \
Always consult your doctor, pharmacist, or healthcare provider before starting, stopping, or changing any medication. \
In case of emergency, call 911 (or your local emergency number) immediately.`;

// ============= Regex Patterns =============

export const REGEX_PATTERNS = {
  DOSAGE: /(\d+(?:\.\d+)?)\s*(mg|mcg|g|ml|IU|units|percent)/gi,
  DOSAGE_RANGE: /(\d+\.?\d*)\s*[-–]\s*(\d+\.?\d*)\s*(mg|mcg|g|ml|IU)/gi,
  STRENGTH: /(\d+)\s*(mg|mcg|gram|ml)\s*(?:per|\/|\*)?/i,
  QUANTITY: /(\d+)\s*(?:tablet|cap|capsule|tab|dose)/i,
  COMMON_UNITS: /(?:mg|mcg|g|ml|IU|mmol|units|percent)/i,
};

// ============= Navigation Routes =============

export const ROUTES = {
  HOME: 'Home',
  SCANNER: 'Scanner',
  REVIEW: 'Review',
  HISTORY: 'History',
  CURRENT_MEDS: 'CurrentMeds',
  INTERACTION_WARNING: 'InteractionWarning',
  SETTINGS: 'Settings',
  ONBOARDING: 'Onboarding',
};

// ============= Haptic Patterns =============

export const HAPTIC_PATTERNS = {
  LIGHT: 'impactLight',
  MEDIUM: 'impactMedium',
  HEAVY: 'impactHeavy',
  SUCCESS: 'notificationSuccess',
  WARNING: 'notificationWarning',
  ERROR: 'notificationError',
};

