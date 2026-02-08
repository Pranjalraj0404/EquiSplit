import React, { createContext, useState, useMemo } from 'react';

export const ColorModeContext = createContext({ mode: 'light', toggleColorMode: () => {} });

export function ColorModeProvider({ children }) {
  const [mode, setMode] = useState('light');

  const toggleColorMode = () => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const value = useMemo(() => ({ mode, toggleColorMode }), [mode]);

  return (
    <ColorModeContext.Provider value={value}>
      {children}
    </ColorModeContext.Provider>
  );
}
