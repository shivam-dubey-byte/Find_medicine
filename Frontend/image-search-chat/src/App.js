import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import SearchChat from './components/SearchChat';

function App() {
  return (
    <ThemeProvider>
      <SearchChat />
    </ThemeProvider>
  );
}

export default App;