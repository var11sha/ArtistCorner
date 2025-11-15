import AppRoutes from "./routes/AppRoutes";
import { ThemeProvider } from "./context/ThemeContext";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <div className="app-container">
        <AppRoutes />
      </div>
    </ThemeProvider>
  );
}

export default App;
