import { useEffect } from 'react';

export function useFormPersistence(storageKey, form, enabled = true) {
  // Load saved form data on mount
  useEffect(() => {
    if (!enabled) return;
    
    const savedData = localStorage.getItem(storageKey);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // Reset form with saved data to ensure proper initialization
        form.reset(parsed);
      } catch (error) {
        console.warn('Failed to load saved form data:', error);
      }
    }
  }, [storageKey, form, enabled]);

  // Save form data whenever form values change
  useEffect(() => {
    if (!enabled) return;

    const subscription = form.watch((data) => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(data));
      } catch (error) {
        console.warn('Failed to save form data:', error);
      }
    });

    return () => subscription.unsubscribe();
  }, [storageKey, form, enabled]);

  // Clear saved data
  const clearPersistedData = () => {
    localStorage.removeItem(storageKey);
  };

  return { clearPersistedData };
}