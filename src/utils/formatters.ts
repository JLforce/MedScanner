/**
 * Formatters - common data formatting functions for display
 */

export const Formatters = {
  /**
   * Format dosage for display (e.g., "10mg", "500mcg")
   */
  formatDosage(value: number, unit: string): string {
    if (value % 1 === 0) {
      return `${Math.round(value)}${unit}`;
    }
    return `${value.toFixed(2)}${unit}`;
  },

  /**
   * Format timestamp to readable date
   */
  formatDate(timestamp: number, format: 'short' | 'long' = 'short'): string {
    const date = new Date(timestamp);

    if (format === 'short') {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    }

    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  },

  /**
   * Format timestamp to time only
   */
  formatTime(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  },

  /**
   * Format confidence percentage
   */
  formatConfidence(value: number): string {
    const percentage = value > 1 ? value : value * 100;
    return `${Math.round(percentage)}%`;
  },

  /**
   * Format drug name for display (capitalize properly)
   */
  formatDrugName(name: string): string {
    return name
      .toLowerCase()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  },

  /**
   * Format interaction severity for display
   */
  formatSeverity(severity: 'severe' | 'moderate' | 'mild'): string {
    const map = {
      severe: '🔴 SEVERE',
      moderate: '🟡 MODERATE',
      mild: '🔵 MILD',
    };
    return map[severity];
  },

  /**
   * Format bytes to human-readable size
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  },

  /**
   * Truncate string with ellipsis
   */
  truncate(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  },

  /**
   * Format number with thousand separators
   */
  formatNumber(num: number): string {
    return num.toLocaleString('en-US');
  },
};

export default Formatters;
