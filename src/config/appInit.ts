/**
 * App Initialization
 * Called on app startup to set up core services and data
 * Phase 0: Minimal setup
 * Later phases will expand this with actual service initialization
 */

import { Logger } from '@/utils/errorHandler';
import { DEFAULT_SETTINGS } from '@/constants';

const logger = Logger.getInstance();

/**
 * Initialize all app services
 * This is called once when the app starts
 */
export async function initializeApp(): Promise<void> {
  try {
    logger.info('APP_INIT', 'Starting app initialization...');

    // Phase 0: Load default settings
    logger.info('APP_INIT', 'Loading app settings...');
    // Settings will be persisted in Phase 5 with DatabaseService

    // Phase 1: Initialize camera permissions
    logger.info('APP_INIT', 'Camera permissions handled on-demand in Phase 1');

    // Phase 3: Initialize interaction database
    logger.info('APP_INIT', 'Interaction database will be seeded in Phase 3');

    // Phase 5: Initialize main database
    logger.info('APP_INIT', 'Main database will be initialized in Phase 5');

    logger.info('APP_INIT', 'App initialization complete');
  } catch (error) {
    logger.critical('APP_INIT', 'Failed to initialize app', {
      error: error instanceof Error ? error.message : String(error),
    });
    throw error; // Re-throw to show error boundary
  }
}

/**
 * Setup debugging tools (development only)
 */
export function setupDevelopmentTools(): void {
  if (!__DEV__) return;

  // Log app start
  logger.info('DEV_TOOLS', 'Development tools initialized');

  // Enable fast refresh
  const HMRClient = require('@react-native/dev-middleware').HMRClient;
  if (HMRClient) {
    // Hot module reload is handled by metro automatically
  }
}

export default {
  initializeApp,
  setupDevelopmentTools,
};
