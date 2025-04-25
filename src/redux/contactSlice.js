import { createSlice } from '@reduxjs/toolkit';
import { loadFromLocalStorage, saveToLocalStorage } from './localStorage';

const initialState = {
  contacts: loadFromLocalStorage()|| [],
  editingContact: null,
};

const contactSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    addContact: (state, action) => {
      const newContact = { id: Date.now(), ...action.payload };
      state.contacts.push(newContact);
      saveToLocalStorage(state.contacts); 
    },
    updateContact: (state, action) => {
      const index = state.contacts.findIndex(c => c.id === action.payload.id);
      if (index !== -1) {
        state.contacts[index] = action.payload;
        saveToLocalStorage(state.contacts); 
      }
      state.editingContact = null;
    },
    deleteContact: (state, action) => {
      state.contacts = state.contacts.filter(c => c.id !== action.payload);
      saveToLocalStorage(state.contacts); 
    },
    setEditingContact: (state, action) => {
      state.editingContact = action.payload;
    },
    clearEditingContact: (state) => {
      state.editingContact = null;
    }
  }
});

export const {
  addContact,
  updateContact,
  deleteContact,
  setEditingContact,
  clearEditingContact
} = contactSlice.actions;

export default contactSlice.reducer;
