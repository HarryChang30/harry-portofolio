import { writable, derived } from 'svelte/store';

// Create locale store
export const locale = writable('en');

// Import locale data
let localeData = {};

// Load locale data
async function loadLocaleData() {
  const [enData, zhData] = await Promise.all([
    import('./locales/en.json'),
    import('./locales/zh.json')
  ]);
  
  localeData = {
    en: enData.default,
    zh: zhData.default
  };
}

// Initialize locale data
loadLocaleData();

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
  localStorage.setItem('language', lang);
}

// Function to get stored language
export function getStoredLanguage() {
  return localStorage.getItem('language');
}

// Function to initialize language
export function initializeLanguage() {
  const storedLang = getStoredLanguage();
  if (storedLang) {
    locale.set(storedLang);
  } else {
    const browserLang = navigator.language || navigator.languages[0];
    const supportedLang = browserLang && browserLang.startsWith('zh') ? 'zh' : 'en';
    locale.set(supportedLang);
  }
}