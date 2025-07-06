/**
 * Jest Setup File for GraphQL System Tests
 * ملف إعداد Jest لاختبارات نظام GraphQL
 */

import '@testing-library/jest-dom';
import 'whatwg-fetch';

// Mock environment variables
process.env.NODE_ENV = "test";
process.env.NEXT_PUBLIC_ODOO_API_URL =
	"ttps://coffee-selection-staging-20784644.dev.odoo.com/graphql/vsf";
process.env.NEXT_PUBLIC_ODOO_API_TOKEN =
	"d22fb86e790ba068c5b3bcfb801109892f3a0b38";
process.env.NEXT_PUBLIC_ODOO_URL =
	"https://coffee-selection-staging-20784644.dev.odoo.com";
process.env.NEXT_PUBLIC_ODOO_DB_NAME = "coffee-selection-staging";

// Mock WebSocket for real-time tests
class MockWebSocket {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;

  readyState = MockWebSocket.CONNECTING;
  url: string;
  protocol: string;
  onopen: ((event: Event) => void) | null = null;
  onclose: ((event: CloseEvent) => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;

  constructor(url: string, protocol?: string) {
    this.url = url;
    this.protocol = protocol || '';

    setTimeout(() => {
      this.readyState = MockWebSocket.OPEN;
      if (this.onopen) {
        this.onopen(new Event('open'));
      }
    }, 100);
  }

  send(data: string) {
    if (this.readyState !== MockWebSocket.OPEN) {
      throw new Error('WebSocket is not open');
    }
  }

  close(code?: number, reason?: string) {
    this.readyState = MockWebSocket.CLOSING;
    setTimeout(() => {
      this.readyState = MockWebSocket.CLOSED;
      if (this.onclose) {
        this.onclose(new CloseEvent('close', { code, reason }));
      }
    }, 100);
  }
}

// Set global WebSocket mock
(global as any).WebSocket = MockWebSocket;

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = jest.fn();
  disconnect = jest.fn();
  unobserve = jest.fn();
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});

Object.defineProperty(global, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});

// Mock ResizeObserver
class MockResizeObserver {
  observe = jest.fn();
  disconnect = jest.fn();
  unobserve = jest.fn();
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: MockResizeObserver,
});

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock
});

// Mock console methods for cleaner test output
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render is no longer supported') ||
       args[0].includes('Warning: An invalid form control') ||
       args[0].includes('Warning: componentWillReceiveProps'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };

  console.warn = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('componentWillReceiveProps') ||
       args[0].includes('componentWillUpdate'))
    ) {
      return;
    }
    originalWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});

// Mock fetch for network requests
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
    headers: new Headers(),
    redirected: false,
    statusText: 'OK',
    type: 'basic',
    url: '',
    clone: jest.fn(),
    body: null,
    bodyUsed: false,
    arrayBuffer: () => Promise.resolve(new ArrayBuffer(0)),
    blob: () => Promise.resolve(new Blob()),
    formData: () => Promise.resolve(new FormData()),
  } as Response)
);

// Mock Image constructor
(global as any).Image = class {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  src: string = '';

  constructor() {
    setTimeout(() => {
      if (this.onload) {
        this.onload();
      }
    }, 100);
  }
};

// Mock URL.createObjectURL
Object.defineProperty(URL, 'createObjectURL', {
  writable: true,
  value: jest.fn(() => 'mocked-url'),
});

Object.defineProperty(URL, 'revokeObjectURL', {
  writable: true,
  value: jest.fn(),
});

// Mock crypto for UUID generation
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: () => 'mocked-uuid-' + Math.random().toString(36).substr(2, 9),
    getRandomValues: (arr: any) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256);
      }
      return arr;
    },
  },
});

// Mock performance API
Object.defineProperty(global, 'performance', {
  value: {
    now: jest.fn(() => Date.now()),
    mark: jest.fn(),
    measure: jest.fn(),
    getEntriesByName: jest.fn(() => []),
    getEntriesByType: jest.fn(() => []),
  },
});

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn((cb) => {
  setTimeout(cb, 16);
  return 1;
});

global.cancelAnimationFrame = jest.fn();

// Mock requestIdleCallback
global.requestIdleCallback = jest.fn((cb) => {
  setTimeout(cb, 1);
  return 1;
});

global.cancelIdleCallback = jest.fn();

// Mock Notification API
(global as any).Notification = class {
  static permission = 'granted';
  static requestPermission = jest.fn(() => Promise.resolve('granted'));

  constructor(title: string, options?: NotificationOptions) {
    // Mock notification
  }

  close = jest.fn();
};

// Mock geolocation
Object.defineProperty(navigator, 'geolocation', {
  value: {
    getCurrentPosition: jest.fn((success) => {
      success({
        coords: {
          latitude: 24.7136,
          longitude: 46.6753,
          accuracy: 100,
          altitude: null,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
        },
        timestamp: Date.now(),
      });
    }),
    watchPosition: jest.fn(),
    clearWatch: jest.fn(),
  },
});

// Mock clipboard API
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: jest.fn(() => Promise.resolve()),
    readText: jest.fn(() => Promise.resolve('mocked text')),
  },
});

// Mock service worker
Object.defineProperty(navigator, 'serviceWorker', {
  value: {
    register: jest.fn(() => Promise.resolve()),
    ready: Promise.resolve({
      unregister: jest.fn(() => Promise.resolve(true)),
    }),
  },
});

// Global test utilities
(global as any).testUtils = {
  // Wait for async operations
  waitFor: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),

  // Mock GraphQL response
  mockGraphQLResponse: (data: any, errors?: any[]) => ({
    data,
    errors,
    loading: false,
    networkStatus: 7,
  }),

  // Mock Apollo Client
  mockApolloClient: {
    query: jest.fn(),
    mutate: jest.fn(),
    subscribe: jest.fn(),
    readQuery: jest.fn(),
    writeQuery: jest.fn(),
    resetStore: jest.fn(),
    clearStore: jest.fn(),
  },

  // Mock user data
  mockUser: {
    id: '1',
    name: 'أحمد محمد',
    email: 'ahmed@example.com',
    phone: '+966501234567',
    role: 'CUSTOMER',
    isVerified: true,
  },

  // Mock product data
  mockProduct: {
    id: '1',
    name: 'قهوة عربية مختصة',
    price: 45.99,
    salePrice: 39.99,
    sku: 'COFFEE-001',
    isActive: true,
    stock: {
      isInStock: true,
      quantity: 100,
      stockStatus: 'IN_STOCK',
    },
  },

  // Mock order data
  mockOrder: {
    id: '1',
    number: 'ORDER-001',
    status: 'CONFIRMED',
    total: 130.78,
    currency: 'SAR',
    items: [],
    customer: {
      id: '1',
      name: 'أحمد محمد',
      email: 'ahmed@example.com',
    },
  },

  // Mock Aramex shipment data
  mockAramexShipment: {
    id: '1',
    orderId: 'ORDER-001',
    awbNumber: '1234567890',
    status: 'IN_TRANSIT',
    trackingUrl: 'https://www.aramex.com/track/1234567890',
    cost: {
      amount: 25.50,
      currency: 'SAR',
      formatted: '25.50 ر.س',
    },
  },
};

// Setup and teardown hooks
beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks();

  // Reset localStorage and sessionStorage
  localStorageMock.clear();
  sessionStorageMock.clear();

  // Reset fetch mock
  (fetch as jest.Mock).mockClear();
});

afterEach(() => {
  // Cleanup after each test
  jest.restoreAllMocks();
});

// Global error handler for unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Increase timeout for async operations
jest.setTimeout(30000);