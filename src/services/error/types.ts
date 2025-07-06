/**
 * Error Types and Interfaces
 * أنواع وواجهات الأخطاء
 */

// Error severity levels
export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

// Error categories
export type ErrorCategory =
  | 'authentication'
  | 'authorization'
  | 'validation'
  | 'network'
  | 'server'
  | 'database'
  | 'business'
  | 'unknown';

// Error types
export interface BaseError {
  id: string;
  message: string;
  code: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  timestamp: number;
  source: string;
  userId?: string;
  sessionId?: string;
  metadata?: Record<string, any>;
}

export interface ValidationError extends BaseError {
  category: 'validation';
  field?: string;
  value?: any;
  constraints?: string[];
}

export interface NetworkError extends BaseError {
  category: 'network';
  url?: string;
  method?: string;
  statusCode?: number;
  responseText?: string;
}

export interface ServerError extends BaseError {
  category: 'server';
  endpoint?: string;
  statusCode?: number;
  responseData?: any;
}

export interface AuthenticationError extends BaseError {
  category: 'authentication';
  action?: string;
  tokenExpired?: boolean;
  invalidCredentials?: boolean;
}

export interface AuthorizationError extends BaseError {
  category: 'authorization';
  resource?: string;
  action?: string;
  requiredPermissions?: string[];
}

export interface BusinessError extends BaseError {
  category: 'business';
  businessRule?: string;
  affectedEntity?: string;
  entityId?: string;
}

// Error response types
export interface ErrorResponse {
  success: false;
  error: BaseError;
  message: string;
  timestamp: number;
  requestId?: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  timestamp: number;
  path: string;
  method: string;
}

// Error handling result
export interface ErrorHandlingResult {
  handled: boolean;
  shouldRetry: boolean;
  retryAfter?: number;
  fallbackAction?: string;
  userMessage?: string;
}

// Error reporting data
export interface ErrorReport {
  error: BaseError;
  userAgent: string;
  url: string;
  timestamp: number;
  userId?: string;
  sessionId?: string;
  breadcrumbs: ErrorBreadcrumb[];
}

export interface ErrorBreadcrumb {
  message: string;
  category: string;
  timestamp: number;
  data?: Record<string, any>;
}

// Error metrics
export interface ErrorMetrics {
  totalErrors: number;
  errorsByCategory: Record<ErrorCategory, number>;
  errorsBySeverity: Record<ErrorSeverity, number>;
  averageResolutionTime: number;
  errorRate: number;
  lastErrorTime: number;
}

// Error configuration
export interface ErrorConfig {
  enableLogging: boolean;
  enableReporting: boolean;
  enableRetry: boolean;
  maxRetries: number;
  retryDelay: number;
  criticalErrorThreshold: number;
  errorSamplingRate: number;
  ignoredErrors: string[];
  customErrorHandlers: Record<string, (error: BaseError) => void>;
}