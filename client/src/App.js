// theme
import ThemeProvider from './theme';
import Router from './routes'
import { ColorModeProvider } from './contexts/ColorModeContext';


function App() {
  return (
    <ColorModeProvider>
      <ThemeProvider>
        <Router />
      </ThemeProvider>
    </ColorModeProvider>
  );
}

export default App;
