'use client';

import { useState, useEffect, useCallback } from 'react';
import { validateApiKey } from '@/lib/ai/gemini';

const API_KEY_STORAGE_KEY = 'retroweb_gemini_api_key';

export function useApiKey() {
  const [apiKey, setApiKeyState] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load API key from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(API_KEY_STORAGE_KEY);
    setApiKeyState(stored);
    setIsLoaded(true);
  }, []);

  const setApiKey = useCallback(async (key: string): Promise<boolean> => {
    setIsValidating(true);
    
    try {
      const isValid = await validateApiKey(key);
      
      if (isValid) {
        localStorage.setItem(API_KEY_STORAGE_KEY, key);
        setApiKeyState(key);
        return true;
      }
      
      return false;
    } finally {
      setIsValidating(false);
    }
  }, []);

  const clearApiKey = useCallback(() => {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
    setApiKeyState(null);
  }, []);

  return {
    apiKey,
    hasApiKey: !!apiKey,
    isValidating,
    isLoaded,
    setApiKey,
    clearApiKey,
  };
}
