import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './app/routes/AppRoutes';
import { AuthProvider } from './features/auth/contexts/AuthContext';
import AppToast from './shared/components/AppToast';

function App() {
  return (
    <>
      <AppToast />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
