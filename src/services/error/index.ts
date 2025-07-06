/**
 * Error Service Export
 * تصدير خدمة الأخطاء
 */

// Export types
export * from './types';

// Export error handler
export {
  errorHandler,
  createError,
  handleError,
  handleAsyncError,
} from './errorHandler';

// Export logger
export {
  logger,
  logDebug,
  logInfo,
  logWarn,
  logError,
  logCritical,
  startTimer,
  trackEvent,
  reportError,
} from './logger';

// Re-export all for easy access
export * from './types';
export * from './errorHandler';
export * from './logger';