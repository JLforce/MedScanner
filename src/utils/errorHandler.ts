/**
 * Centralized Error Handling & Logging Utility
 * Handles app-wide error catching, logging, and recovery
 */

import { AppError, OCRError, ParsingError, DatabaseError } from '@/types';
import { ERROR_CODES } from '@/constants';

type ErrorSeverity = 'info' | 'warning' | 'error' | 'critical';

export interface LogEntry {
  timestamp: number;
  level: ErrorSeverity;
  code: string;
  message: string;
  details?: Record<string, any>;
  stack?: string;
}

/**
 * Logger Service - centralized logging
 */
export class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  /**
   * Log a message with severity level
   */
  public log(
    level: ErrorSeverity,
    code: string,
    message: string,
    details?: Record<string, any>,
    stack?: string
  ): void {
    const entry: LogEntry = {
      timestamp: Date.now(),
      level,
      code,
      message,
      details,
      stack,
    };

    this.logs.push(entry);

    // Keep only recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Also log to console in development
    const consoleMethod = level === 'critical' ? 'error' : level === 'error' ? 'error' : 'warn';
    console[consoleMethod as 'error' | 'warn'](
      `[${code}] ${message}`,
      details || ''
    );
  }

  public info(code: string, message: string, details?: Record<string, any>): void {
    this.log('info', code, message, details);
  }

  public warn(code: string, message: string, details?: Record<string, any>): void {
    this.log('warning', code, message, details);
  }

  public error(
    code: string,
    message: string,
    details?: Record<string, any>,
    stack?: string
  ): void {
    this.log('error', code, message, details, stack);
  }

  public critical(
    code: string,
    message: string,
    details?: Record<string, any>,
    stack?: string
  ): void {
    this.log('critical', code, message, details, stack);
  }

  /**
   * Get all logs
   */
  public getLogs(): LogEntry[] {
    return [...this.logs];
  }

  /**
   * Get logs filtered by severity
   */
  public getLogsByLevel(level: ErrorSeverity): LogEntry[] {
    return this.logs.filter((log) => log.level === level);
  }

  /**
   * Clear all logs
   */
  public clearLogs(): void {
    this.logs = [];
  }

  /**
   * Export logs as JSON
   */
  public exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

/**
 * Error Factory - creates typed errors
 */
export class ErrorFactory {
  static createOCRError(
    code: OCRError['code'],
    message: string,
    details?: Record<string, any>
  ): OCRError {
    return {
      code,
      message,
      details,
      timestamp: Date.now(),
      severity: code === 'OCR_FAILED' ? 'error' : 'warning',
    };
  }

  static createParsingError(
    code: ParsingError['code'],
    message: string,
    rawText: string,
    details?: Record<string, any>
  ): ParsingError {
    return {
      code,
      message,
      rawText,
      details,
      timestamp: Date.now(),
      severity: 'warning',
    };
  }

  static createDatabaseError(
    code: DatabaseError['code'],
    message: string,
    details?: Record<string, any>
  ): DatabaseError {
    return {
      code,
      message,
      details,
      timestamp: Date.now(),
      severity: code === 'DB_INIT_FAILED' ? 'critical' : 'error',
    };
  }

  static createGenericError(
    message: string,
    code = 'UNKNOWN_ERROR',
    details?: Record<string, any>
  ): AppError {
    return {
      code,
      message,
      details,
      timestamp: Date.now(),
      severity: 'error',
    };
  }
}

/**
 * Error Handler - processes errors gracefully
 */
export class ErrorHandler {
  private static logger = Logger.getInstance();

  /**
   * Handle OCR errors
   */
  static handleOCRError(error: OCRError | Error): OCRError {
    if (error instanceof Error && 'code' in error && 'severity' in error && 'timestamp' in error) {
      const ocrError = error as OCRError;
      this.logger.error(ocrError.code, ocrError.message, ocrError.details, error.stack);
      return ocrError;
    }

    const genericError = ErrorFactory.createOCRError(
      'OCR_FAILED',
      error.message || 'Unknown OCR error',
      { originalError: error.toString() }
    );

    this.logger.error(genericError.code, genericError.message, genericError.details);
    return genericError;
  }

  /**
   * Handle parsing errors
   */
  static handleParsingError(error: ParsingError | Error, rawText: string): ParsingError {
    if (error instanceof Error && 'code' in error && 'rawText' in error && 'severity' in error && 'timestamp' in error) {
      const parseError = error as ParsingError;
      this.logger.error(parseError.code, parseError.message, parseError.details);
      return parseError;
    }

    const genericError = ErrorFactory.createParsingError(
      'PARSE_FAILED',
      error.message || 'Unknown parsing error',
      rawText,
      { originalError: error.toString() }
    );

    this.logger.error(genericError.code, genericError.message, genericError.details);
    return genericError;
  }

  /**
   * Handle database errors
   */
  static handleDatabaseError(error: DatabaseError | Error): DatabaseError {
    if (error instanceof Error && 'code' in error && 'severity' in error && 'timestamp' in error) {
      const dbError = error as DatabaseError;
      this.logger.error(
        dbError.code,
        dbError.message,
        dbError.details,
        error.stack
      );
      return dbError;
    }

    const genericError = ErrorFactory.createDatabaseError(
      'DB_QUERY_FAILED',
      error.message || 'Unknown database error',
      { originalError: error.toString() }
    );

    this.logger.error(genericError.code, genericError.message, genericError.details);
    return genericError;
  }

  /**
   * Handle generic errors
   */
  static handleError(error: Error | AppError, context?: string): AppError {
    if ('code' in error && 'severity' in error) {
      const appError = error as AppError;
      this.logger.log(appError.severity, appError.code, appError.message, appError.details);
      return appError;
    }

    const genericError = ErrorFactory.createGenericError(
      error.message || 'Unknown error',
      'UNKNOWN_ERROR',
      { context, originalError: error.toString() }
    );

    this.logger.error(genericError.code, genericError.message, genericError.details);
    return genericError;
  }

  /**
   * Simple logging wrapper for OCR errors
   */
  static logOCRError(error: Error): void {
    this.handleOCRError(error);
  }
}

export default {
  Logger,
  ErrorFactory,
  ErrorHandler,
};
