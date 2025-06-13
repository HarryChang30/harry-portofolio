import { writable } from 'svelte/store';
import { locale } from 'svelte-i18n';

// Create a writable store with initial value from localStorage or default to 'en'
const storedLanguage = typeof localStorage !== 'undefined' ? localStorage.getItem('language') || 'en' : 'en';
const language = writable(storedLanguage);

// Set the initial locale
locale.set(storedLanguage);

// Subscribe to changes and update localStorage and locale
if (typeof localStorage !== 'undefined') {
  language.subscribe(value => {
    localStorage.setItem('language', value);
    locale.set(value);
  });
}

export default language;