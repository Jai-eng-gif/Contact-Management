const STORAGE_KEY = 'contacts';

export const loadFromLocalStorage = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Load error:", error);
    return [];
  }
};

export const saveToLocalStorage = (contacts) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
  } catch (error) {
    console.error("Save error:", error);
  }
};
