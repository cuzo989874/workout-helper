import '@testing-library/jest-dom';
import { vi, beforeAll, afterAll } from 'vitest';

// TODO: Fix React 19 compatibility
// React 19.1.1 removed React.act from exports, causing all component tests to fail
// Need to update @testing-library/react to a version that supports React 19
// See docs/log/notepad.md for details

// Mock localStorage
const localStorageMock = (() => {
  let store: { [key: string]: string } = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
  };
})();

let originalError: typeof console.error;

beforeAll(() => {
  // Set IS_REACT_ACT_ENVIRONMENT for React 19
  // @ts-expect-error - React 19 compatibility
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;

  Object.defineProperty(globalThis, 'localStorage', {
    value: localStorageMock,
    writable: true,
  });

  // 設定全域的測試環境
  Object.defineProperty(globalThis, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });

  originalError = console.error;
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

