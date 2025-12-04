/**
 * Test setup file
 * Configures test environment and mocks Chrome APIs
 */

import '@testing-library/jest-dom';

// Mock Chrome APIs for testing
(global as any).chrome = {
  runtime: {
    onInstalled: {
      addListener: () => {}
    },
    onMessage: {
      addListener: () => {}
    },
    sendMessage: (message: any, callback?: (response: any) => void) => {
      if (callback) callback({});
    }
  },
  storage: {
    sync: {
      get: (keys: any, callback: (items: any) => void) => {
        callback({});
      },
      set: (items: any, callback?: () => void) => {
        if (callback) callback();
      }
    },
    local: {
      get: (keys: any, callback: (items: any) => void) => {
        callback({});
      },
      set: (items: any, callback?: () => void) => {
        if (callback) callback();
      }
    }
  },
  tabs: {
    query: (queryInfo: any, callback: (tabs: any[]) => void) => {
      callback([]);
    },
    sendMessage: () => Promise.resolve()
  }
};
