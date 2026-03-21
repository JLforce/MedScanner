/**
 * Interaction Checker Service - manages offline drug-to-drug interaction checking
 * Uses local SQLite database with bundled interaction dataset
 * 
 * Responsibilities:
 * - Look up drug interactions from local database
 * - Categorize severity levels
 * - Check new medications against current medications
 * - Optional: fallback to online API when available
 */

import {
  ParsedMedication,
  CurrentMedication,
  Interaction,
  InteractionCheckResult,
  InteractionSeverity,
} from '@/types';

export interface InteractionCheckerInterface {
  /**
   * Check if new medication interacts with current medications
   * @param newMedication - Newly scanned medication
   * @param currentMedications - List of current medications
   * @returns Check result with found interactions
   */
  checkInteractions(
    newMedication: ParsedMedication,
    currentMedications: CurrentMedication[]
  ): Promise<InteractionCheckResult>;

  /**
   * Get severity of interaction between two drugs
   * @param drug1 - First drug name
   * @param drug2 - Second drug name
   * @returns Severity level or null if no interaction
   */
  getSeverity(drug1: string, drug2: string): Promise<InteractionSeverity | null>;

  /**
   * Get interaction details
   * @param drug1 - First drug name
   * @param drug2 - Second drug name
   * @returns Interaction object or null
   */
  getInteractionDetails(drug1: string, drug2: string): Promise<Interaction | null>;

  /**
   * Initialize interaction database
   * @returns Promise when database is ready
   */
  initializeDatabase(): Promise<void>;

  /**
   * Get all interactions for a given drug
   * @param drugName - Drug to look up
   * @returns Array of interactions
   */
  getInteractionsForDrug(drugName: string): Promise<Interaction[]>;

  /**
   * Search for drug by partial name (case-insensitive)
   * @param searchTerm - Partial or full drug name
   * @returns Matching drug names
   */
  searchDrugs(searchTerm: string): Promise<string[]>;
}

/**
 * Interaction Checker Service Implementation - Skeleton
 * To be completed in Phase 3
 */
export class InteractionCheckerService implements InteractionCheckerInterface {
  private static instance: InteractionCheckerService;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): InteractionCheckerService {
    if (!InteractionCheckerService.instance) {
      InteractionCheckerService.instance = new InteractionCheckerService();
    }
    return InteractionCheckerService.instance;
  }

  async checkInteractions(
    newMedication: ParsedMedication,
    currentMedications: CurrentMedication[]
  ): Promise<InteractionCheckResult> {
    throw new Error('Interaction Checker Service not yet implemented - Phase 3');
  }

  async getSeverity(drug1: string, drug2: string): Promise<InteractionSeverity | null> {
    throw new Error('Interaction Checker Service not yet implemented - Phase 3');
  }

  async getInteractionDetails(drug1: string, drug2: string): Promise<Interaction | null> {
    throw new Error('Interaction Checker Service not yet implemented - Phase 3');
  }

  async initializeDatabase(): Promise<void> {
    throw new Error('Interaction Checker Service not yet implemented - Phase 3');
  }

  async getInteractionsForDrug(drugName: string): Promise<Interaction[]> {
    throw new Error('Interaction Checker Service not yet implemented - Phase 3');
  }

  async searchDrugs(searchTerm: string): Promise<string[]> {
    throw new Error('Interaction Checker Service not yet implemented - Phase 3');
  }
}

export default InteractionCheckerService;
