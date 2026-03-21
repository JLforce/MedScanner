/**
 * Parsing Service - extracts structured data from raw OCR text
 * Handles medication labels, nutrition facts, and confidence scoring
 * 
 * Responsibilities:
 * - Extract drug names, dosages, and units from raw text
 * - Parse nutrition facts panels
 * - Calculate confidence scores based on regex matches
 * - Flag low-confidence results for manual review
 */

import { PARSING_CONFIG } from '@/constants';
import { ParsedMedication, ParsedNutritionFacts } from '@/types';

export interface ParsingServiceInterface {
  /**
   * Parse raw OCR text as medication label
   * @param rawText - Unstructured text from OCR
   * @param ocrConfidence - Confidence from OCR engine (0-1)
   * @returns Structured medication data with confidence score
   */
  parseMedicationLabel(rawText: string, ocrConfidence: number): Promise<ParsedMedication>;

  /**
   * Parse raw OCR text as nutrition facts
   * @param rawText - Unstructured text from OCR
   * @param ocrConfidence - Confidence from OCR engine (0-1)
   * @returns Structured nutrition data with confidence score
   */
  parseNutritionLabel(rawText: string, ocrConfidence: number): Promise<ParsedNutritionFacts>;

  /**
   * Extract drug name from text using patterns and dictionary lookup
   * @param text - Raw OCR text
   * @returns Drug name and confidence
   */
  extractDrugName(text: string): { name: string; confidence: number };

  /**
   * Extract dosage value and unit from text
   * @param text - Raw OCR text
   * @returns Dosage object with value, unit, and confidence
   */
  extractDosage(text: string): {
    value: number;
    unit: string;
    confidence: number;
  };

  /**
   * Normalize and clean extracted values
   * @param value - Value to normalize
   * @param type - Type of value (drugName, unit, etc)
   * @returns Cleaned value
   */
  normalize(value: string, type: 'drugName' | 'unit' | 'generic'): string;

  /**
   * Calculate combined confidence score
   * @param parsedConfidence - Confidence from parsing algorithm
   * @param ocrConfidence - Confidence from OCR
   * @returns Combined 0-1 score
   */
  calculateConfidence(parsedConfidence: number, ocrConfidence: number): number;

  /**
   * Determine if result requires manual review
   * @param confidence - Combined confidence score
   * @returns true if confidence below threshold
   */
  requiresManualReview(confidence: number): boolean;
}

/**
 * Parsing Service Implementation - Skeleton
 * To be completed in Phase 2
 */
export class ParsingService implements ParsingServiceInterface {
  private static instance: ParsingService;
  private drugDictionary: Set<string> = new Set();

  private constructor() {
    this.drugDictionary = new Set([
      'ASPIRIN',
      'IBUPROFEN',
      'PARACETAMOL',
      'ACETAMINOPHEN',
      'AMOXICILLIN',
      'METFORMIN',
      'LOSARTAN',
      'AMLODIPINE',
      'ATORVASTATIN',
      'OMEPRAZOLE',
      'CETIRIZINE',
      'LORATADINE',
      'SALBUTAMOL',
      'COUGH',
      'SYRUP',
      'VITAMIN',
      'FERROUS',
      'FOLIC',
      'CALCIUM',
      'MULTIVITAMIN',
    ]);
  }

  public static getInstance(): ParsingService {
    if (!ParsingService.instance) {
      ParsingService.instance = new ParsingService();
    }
    return ParsingService.instance;
  }

  async parseMedicationLabel(
    rawText: string,
    ocrConfidence: number
  ): Promise<ParsedMedication> {
    const normalizedText = this.normalize(rawText, 'generic');

    if (!normalizedText) {
      throw new Error('Invalid format: empty OCR text');
    }

    const drugNameResult = this.extractDrugName(normalizedText);
    const dosageResult = this.extractDosage(normalizedText);

    const parsedConfidence =
      drugNameResult.confidence * 0.6 + dosageResult.confidence * 0.4;
    const confidence = this.calculateConfidence(parsedConfidence, ocrConfidence);
    const requiresManualReview = this.requiresManualReview(confidence);

    const reviewReasons: string[] = [];
    if (drugNameResult.confidence < PARSING_CONFIG.MIN_DRUG_NAME_CONFIDENCE) {
      reviewReasons.push('Low confidence drug name extraction');
    }
    if (dosageResult.value <= 0) {
      reviewReasons.push('No dosage detected');
    }
    if (confidence < PARSING_CONFIG.CONFIDENCE_THRESHOLD) {
      reviewReasons.push('Overall confidence below threshold');
    }

    return {
      drugName: drugNameResult.name,
      dosage: dosageResult.value,
      unit: dosageResult.unit,
      rawText,
      confidence,
      requiresManualReview,
      reviewReason: reviewReasons.length ? reviewReasons.join('; ') : undefined,
    };
  }

  async parseNutritionLabel(
    rawText: string,
    ocrConfidence: number
  ): Promise<ParsedNutritionFacts> {
    const text = this.normalize(rawText, 'generic');

    const servingSizeMatch = text.match(/serving\s*size[:\s]*([^\n]+)/i);
    const caloriesMatch = text.match(/calories[:\s]*(\d+(?:\.\d+)?)/i);
    const sodiumMatch = text.match(/sodium[:\s]*(\d+(?:\.\d+)?)/i);
    const sugarMatch = text.match(/(?:sugar|sugars)[:\s]*(\d+(?:\.\d+)?)/i);
    const proteinMatch = text.match(/protein[:\s]*(\d+(?:\.\d+)?)/i);
    const fatMatch = text.match(/(?:total\s+)?fat[:\s]*(\d+(?:\.\d+)?)/i);
    const carbsMatch = text.match(/(?:total\s+)?(?:carb|carbohydrate)s?[:\s]*(\d+(?:\.\d+)?)/i);

    const extractedCount = [
      servingSizeMatch,
      caloriesMatch,
      sodiumMatch,
      sugarMatch,
      proteinMatch,
      fatMatch,
      carbsMatch,
    ].filter(Boolean).length;

    const parsedConfidence = Math.min(1, extractedCount / 7);
    const confidence = this.calculateConfidence(parsedConfidence, ocrConfidence);

    return {
      servingSize: this.normalize(servingSizeMatch?.[1] ?? 'Unknown', 'generic'),
      calories: Number(caloriesMatch?.[1] ?? 0),
      sodium: Number(sodiumMatch?.[1] ?? 0),
      sugar: Number(sugarMatch?.[1] ?? 0),
      protein: Number(proteinMatch?.[1] ?? 0),
      fat: Number(fatMatch?.[1] ?? 0),
      carbs: Number(carbsMatch?.[1] ?? 0),
      rawText,
      confidence,
    };
  }

  extractDrugName(text: string): { name: string; confidence: number } {
    const normalizedText = this.normalize(text, 'generic');
    const upperText = normalizedText.toUpperCase();

    for (const entry of this.drugDictionary) {
      const pattern = new RegExp(`\\b${entry}\\b`, 'i');
      if (pattern.test(upperText)) {
        return {
          name: this.normalize(entry, 'drugName'),
          confidence: 0.92,
        };
      }
    }

    const lines = normalizedText
      .split(/\n+/)
      .map((line) => line.trim())
      .filter(Boolean);

    const nonDrugKeywords =
      /(take|directions|ingredients|warning|batch|expiry|exp|lot|mfg|manufactured|tablet|capsule|syrup|mg|ml|mcg|g|iu|units?)/i;

    const candidateLine = lines.find(
      (line) =>
        line.length >= 3 &&
        line.length <= 40 &&
        !nonDrugKeywords.test(line) &&
        /[a-zA-Z]/.test(line)
    );

    if (candidateLine) {
      return {
        name: this.normalize(candidateLine, 'drugName'),
        confidence: 0.78,
      };
    }

    const fallbackMatch = normalizedText.match(/\b([A-Za-z][A-Za-z\-]{2,})(?:\s+([A-Za-z][A-Za-z\-]{2,}))?/);
    if (fallbackMatch) {
      const fallbackName = [fallbackMatch[1], fallbackMatch[2]].filter(Boolean).join(' ');
      return {
        name: this.normalize(fallbackName, 'drugName'),
        confidence: 0.45,
      };
    }

    return {
      name: 'Unknown Medication',
      confidence: 0.2,
    };
  }

  extractDosage(text: string): {
    value: number;
    unit: string;
    confidence: number;
  } {
    const normalizedText = this.normalize(text, 'generic');
    const dosageMatch = normalizedText.match(
      /(\d+(?:\.\d+)?)\s*(mg|mcg|g|ml|iu|units?|percent|%)/i
    );

    if (!dosageMatch) {
      return {
        value: 0,
        unit: 'mg',
        confidence: 0.2,
      };
    }

    const value = Number(dosageMatch[1]);
    const unit = this.normalize(dosageMatch[2], 'unit');
    const knownUnit = PARSING_CONFIG.DOSAGE_UNITS.some(
      (item) => item.toLowerCase() === unit.toLowerCase()
    );

    return {
      value: Number.isFinite(value) ? value : 0,
      unit,
      confidence: knownUnit ? 0.9 : 0.6,
    };
  }

  normalize(value: string, type: 'drugName' | 'unit' | 'generic'): string {
    const trimmed = String(value ?? '')
      .replace(/\r\n/g, '\n')
      .replace(/\s+/g, ' ')
      .trim();

    if (!trimmed) {
      return '';
    }

    if (type === 'unit') {
      const lowered = trimmed.toLowerCase();
      if (lowered === 'iu') return 'IU';
      if (lowered === 'units' || lowered === 'unit') return 'units';
      if (lowered === 'percent') return '%';
      return lowered;
    }

    if (type === 'drugName') {
      const cleaned = trimmed.replace(/[^A-Za-z0-9\-\s/]/g, ' ').replace(/\s+/g, ' ').trim();
      return cleaned
        .split(' ')
        .filter(Boolean)
        .map((token) => token.charAt(0).toUpperCase() + token.slice(1).toLowerCase())
        .join(' ');
    }

    return trimmed;
  }

  calculateConfidence(parsedConfidence: number, ocrConfidence: number): number {
    const safeParsed = Math.max(0, Math.min(1, parsedConfidence));
    const safeOcr = Math.max(0, Math.min(1, ocrConfidence));
    return Number((safeParsed * 0.7 + safeOcr * 0.3).toFixed(2));
  }

  requiresManualReview(confidence: number): boolean {
    return confidence < PARSING_CONFIG.CONFIDENCE_THRESHOLD;
  }
}

export default ParsingService;
