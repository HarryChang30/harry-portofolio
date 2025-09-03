import { derived } from 'svelte/store';
import { locale, changeLanguage, getStoredLanguage, initializeLanguage } from '../lib/i18n.js';

// Create a derived store for the current language
export const currentLanguage = derived(locale, $locale => $locale);

// Re-export the i18n functions for convenience
export { changeLanguage, getStoredLanguage, initializeLanguage };