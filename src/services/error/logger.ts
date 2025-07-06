/**
 * Logging Service
 * خدمة التسجيل
 */

import { BaseError, ErrorReport, ErrorMetrics } from './types';

// Log levels
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'critical';

// Log entry interface
export interface LogEntry {
  id: string;
  level: LogLevel;
  message: string;
  timestamp: number;
  source: string;
  userId?: string;
  sessionId?: string;
  metadata?: Record<string, any>;
  error?: BaseError;
}

// Performance metric interface
export interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

// Analytics event interface
export interface AnalyticsEvent {
  event: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  metadata?: Record<string, any>;
  timestamp: number;
}

class Logger {
  private logs: LogEntry[] = [];
  private performanceMetrics: PerformanceMetric[] = [];
  private analyticsEvents: AnalyticsEvent[] = [];
  private maxLogs: number = 1000;
  private maxMetrics: number = 500;
  private maxEvents: number = 500;
  private isEnabled: boolean = true;
  private logLevel: LogLevel = 'info';

  // Logging methods
  debug(message: string, metadata?: Record<string, any>): void {
    this.log('debug', message, metadata);
  }

  info(message: string, metadata?: Record<string, any>): void {
    this.log('info', message, metadata);
  }

  warn(message: string, metadata?: Record<string, any>): void {
    this.log('warn', message, metadata);
  }

  error(message: string, error?: BaseError, metadata?: Record<string, any>): void {
    this.log('error', message, metadata, error);
  }

  critical(message: string, error?: BaseError, metadata?: Record<string, any>): void {
    this.log('critical', message, metadata, error);
  }

  // Performance monitoring
  startTimer(name: string): () => void {
    const startTime = performance.now();

    return () => {
      const duration = performance.now() - startTime;
      this.recordPerformanceMetric(name, duration);
    };
  }

  recordPerformanceMetric(name: string, duration: number, metadata?: Record<string, any>): void {
    const metric: PerformanceMetric = {
      name,
      duration,
      timestamp: Date.now(),
      metadata,
    };

    this.performanceMetrics.push(metric);

    // Keep only recent metrics
    if (this.performanceMetrics.length > this.maxMetrics) {
      this.performanceMetrics = this.performanceMetrics.slice(-this.maxMetrics);
    }

    // Log slow operations
    if (duration > 1000) {
      this.warn(`Slow operation detected: ${name} took ${duration.toFixed(2)}ms`, metadata);
    }
  }

  // Analytics tracking
  trackEvent(
    event: string,
    category: string,
    action: string,
    label?: string,
    value?: number,
    metadata?: Record<string, any>
  ): void {
    const analyticsEvent: AnalyticsEvent = {
      event,
      category,
      action,
      label,
      value,
      metadata,
      timestamp: Date.now(),
    };

    this.analyticsEvents.push(analyticsEvent);

    // Keep only recent events
    if (this.analyticsEvents.length > this.maxEvents) {
      this.analyticsEvents = this.analyticsEvents.slice(-this.maxEvents);
    }

    // Send to analytics service
    this.sendToAnalytics(analyticsEvent);
  }

  // Error reporting
  reportError(error: BaseError, additionalData?: Record<string, any>): void {
    const errorReport: ErrorReport = {
      error,
      userAgent: this.getUserAgent(),
      url: this.getCurrentUrl(),
      timestamp: Date.now(),
      userId: this.getCurrentUserId(),
      sessionId: this.getCurrentSessionId(),
      breadcrumbs: this.getBreadcrumbs(),
    };

    // Send to error reporting service
    this.sendToErrorReporting(errorReport);

    // Log the error
    this.error(`Error reported: ${error.message}`, error, additionalData);
  }

  // Metrics and reporting
  getMetrics(): ErrorMetrics {
    const errors = this.logs.filter(log => log.level === 'error' || log.level === 'critical');
    const errorsByCategory: Record<string, number> = {};
    const errorsBySeverity: Record<string, number> = {};

    errors.forEach(error => {
      if (error.error) {
        errorsByCategory[error.error.category] = (errorsByCategory[error.error.category] || 0) + 1;
        errorsBySeverity[error.error.severity] = (errorsBySeverity[error.error.severity] || 0) + 1;
      }
    });

    return {
      totalErrors: errors.length,
      errorsByCategory,
      errorsBySeverity,
      averageResolutionTime: this.calculateAverageResolutionTime(),
      errorRate: this.calculateErrorRate(),
      lastErrorTime: this.getLastErrorTime(),
    };
  }

  getPerformanceMetrics(): PerformanceMetric[] {
    return [...this.performanceMetrics];
  }

  getAnalyticsEvents(): AnalyticsEvent[] {
    return [...this.analyticsEvents];
  }

  // Configuration
  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  setMaxLogs(max: number): void {
    this.maxLogs = max;
  }

  enable(): void {
    this.isEnabled = true;
  }

  disable(): void {
    this.isEnabled = false;
  }

  // Private methods
  private log(
    level: LogLevel,
    message: string,
    metadata?: Record<string, any>,
    error?: BaseError
  ): void {
    if (!this.isEnabled || !this.shouldLog(level)) {
      return;
    }

    const logEntry: LogEntry = {
      id: this.generateLogId(),
      level,
      message,
      timestamp: Date.now(),
      source: this.getSource(),
      userId: this.getCurrentUserId(),
      sessionId: this.getCurrentSessionId(),
      metadata,
      error,
    };

    this.logs.push(logEntry);

    // Keep only recent logs
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Console output
    this.outputToConsole(logEntry);

    // Send to external service if needed
    if (level === 'error' || level === 'critical') {
      this.sendToExternalService(logEntry);
    }
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error', 'critical'];
    const currentLevelIndex = levels.indexOf(this.logLevel);
    const messageLevelIndex = levels.indexOf(level);

    return messageLevelIndex >= currentLevelIndex;
  }

  private outputToConsole(logEntry: LogEntry): void {
    const timestamp = new Date(logEntry.timestamp).toISOString();
    const prefix = `[${timestamp}] [${logEntry.level.toUpperCase()}]`;

    switch (logEntry.level) {
      case 'debug':
        console.debug(prefix, logEntry.message, logEntry.metadata);
        break;
      case 'info':
        console.info(prefix, logEntry.message, logEntry.metadata);
        break;
      case 'warn':
        console.warn(prefix, logEntry.message, logEntry.metadata);
        break;
      case 'error':
      case 'critical':
        console.error(prefix, logEntry.message, logEntry.metadata, logEntry.error);
        break;
    }
  }

  private sendToExternalService(logEntry: LogEntry): void {
    // Send to external logging service (e.g., LogRocket, Sentry)
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'log_error', {
        error_level: logEntry.level,
        error_message: logEntry.message,
        error_code: logEntry.error?.code,
        error_category: logEntry.error?.category,
        user_id: logEntry.userId,
        session_id: logEntry.sessionId,
      });
    }
  }

  private sendToAnalytics(event: AnalyticsEvent): void {
    // Send to Google Analytics or other analytics service
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event.event, {
        event_category: event.category,
        event_action: event.action,
        event_label: event.label,
        value: event.value,
        ...event.metadata,
      });
    }
  }

  private sendToErrorReporting(report: ErrorReport): void {
    // Send to error reporting service (e.g., Sentry)
    if (typeof window !== 'undefined' && window.Sentry) {
      window.Sentry.captureException(report.error, {
        extra: {
          userAgent: report.userAgent,
          url: report.url,
          userId: report.userId,
          sessionId: report.sessionId,
          breadcrumbs: report.breadcrumbs,
        },
      });
    }
  }

  private generateLogId(): string {
    return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getSource(): string {
    if (typeof window !== 'undefined') {
      return 'client';
    }
    return 'server';
  }

  private getUserAgent(): string {
    if (typeof window !== 'undefined' && window.navigator) {
      return window.navigator.userAgent;
    }
    return 'unknown';
  }

  private getCurrentUrl(): string {
    if (typeof window !== 'undefined') {
      return window.location.href;
    }
    return 'unknown';
  }

  private getCurrentUserId(): string | undefined {
    // Get from Redux store or localStorage
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          return user.id;
        } catch {
          return undefined;
        }
      }
    }
    return undefined;
  }

  private getCurrentSessionId(): string | undefined {
    // Get from Redux store or localStorage
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sessionId') || undefined;
    }
    return undefined;
  }

  private getBreadcrumbs(): any[] {
    // Get navigation breadcrumbs from Redux store
    return [];
  }

  private calculateAverageResolutionTime(): number {
    // Calculate average time to resolve errors
    return 0;
  }

  private calculateErrorRate(): number {
    const totalLogs = this.logs.length;
    const errorLogs = this.logs.filter(log => log.level === 'error' || log.level === 'critical').length;
    return totalLogs > 0 ? (errorLogs / totalLogs) * 100 : 0;
  }

  private getLastErrorTime(): number {
    const errorLogs = this.logs.filter(log => log.level === 'error' || log.level === 'critical');
    return errorLogs.length > 0 ? errorLogs[errorLogs.length - 1].timestamp : 0;
  }

  // Clear methods
  clearLogs(): void {
    this.logs = [];
  }

  clearMetrics(): void {
    this.performanceMetrics = [];
  }

  clearEvents(): void {
    this.analyticsEvents = [];
  }

  clearAll(): void {
    this.clearLogs();
    this.clearMetrics();
    this.clearEvents();
  }
}

// Create singleton instance
export const logger = new Logger();

// Export convenience functions
export const logDebug = logger.debug.bind(logger);
export const logInfo = logger.info.bind(logger);
export const logWarn = logger.warn.bind(logger);
export const logError = logger.error.bind(logger);
export const logCritical = logger.critical.bind(logger);
export const startTimer = logger.startTimer.bind(logger);
export const trackEvent = logger.trackEvent.bind(logger);
export const reportError = logger.reportError.bind(logger);
