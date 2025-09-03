import { writable, derived } from 'svelte/store';
import enData from './locales/en.json';
import zhData from './locales/zh.json';

// Create locale store
export const locale = writable('en');

// Import locale data synchronously
const localeData = {
  en: enData,
  zh: zhData
};

// Create a store to track if translations are ready
export const translationsReady = writable(true);

// Translation function
export const _ = derived(locale, ($locale) => {
  return (key) => {
    const keys = key.split('.');
    let value = localeData[$locale];
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }
    
    return value || key;
  };
});

// JSON function for arrays
export const json = derived(locale, ($locale) => {
  return (key) => {
    const keys = key.split('.');
    let value = localeData[$locale];
    
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return []; // Return empty array if translation not found
      }
    }
    
    return Array.isArray(value) ? value : [];
  };
});

// Function to change language
export function changeLanguage(lang) {
  locale.set(lang);
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    localStorage.setItem('language', lang);
  }
}

// Function to get stored language
export function getStoredLanguage() {
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    return localStorage.getItem('language');
  }
  return null;
}

// Function to initialize language
export function initializeLanguage() {
  // Only run on client-side
  if (typeof window === 'undefined') return;
  
  const storedLang = getStoredLanguage();
  if (storedLang) {
    locale.set(storedLang);
  } else {
    const browserLang = navigator.language || navigator.languages[0];
    const supportedLang = browserLang && browserLang.startsWith('zh') ? 'zh' : 'en';
    locale.set(supportedLang);
  }
}