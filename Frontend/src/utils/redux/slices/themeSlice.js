import { createSlice } from '@reduxjs/toolkit';

const themeSlice = createSlice({
    name: 'theme',
    initialState: {
        isDarkMode: localStorage.getItem('darkMode') === 'true',
    },
    reducers: {
        toggleDarkMode: (state) => {
        state.isDarkMode = !state.isDarkMode;
        localStorage.setItem('darkMode', state.isDarkMode);
        document.documentElement.setAttribute('data-theme', state.isDarkMode ? 'dark' : 'light');
        },
    },
});

export const { toggleDarkMode } = themeSlice.actions;
export default themeSlice.reducer;
