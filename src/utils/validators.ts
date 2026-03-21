/**
 * Validators - common data validation functions
 */

export const Validators = {
  /**
   * Validate drug name format
   */
  isDrugNameValid(name: string): boolean {
    if (!name || name.trim().length === 0) return false;
    if (name.length > 100) return false;
    // Allow letters, numbers, spaces, hyphens, parentheses
    return /^[a-zA-Z0-9\s\-\(\)]+$/.test(name);
  },

  /**
   * Validate dosage number
   */
  isDosageValid(value: number): boolean {
    return value > 0 && value < 1000000;
  },

  /**
   * Validate dosage unit
   */
  isUnitValid(unit: string): boolean {
    const validUnits = ['mg', 'mcg', 'g', 'ml', 'IU', 'units', 'percent'];
    return validUnits.includes(unit.toLowerCase());
  },

  /**
   * Validate confidence score (0-1 or 0-100)
   */
  isConfidenceValid(value: number): boolean {
    return (value >= 0 && value <= 1) || (value > 1 && value <= 100);
  },

  /**
   * Normalize confidence to 0-1 range
   */
  normalizeConfidence(value: number): number {
    if (value > 1) return value / 100;
    return value;
  },

  /**
   * Validate URL
   */
  isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Validate email
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },
};

export default Validators;
