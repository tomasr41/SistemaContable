import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LoginForm } from './components/auth/LoginForm';
import { Layout } from './components/layout/Layout';

/**
 * Componente principal de la aplicación
 * Maneja el routing entre login y layout principal según autenticación
 */
const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();   // usa el hook para saber si el usuario esta autenticado.

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>         
          <p className="text-gray-300">Cargando Sistema Contable...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, mostrar formulario de login
  if (!isAuthenticated) {
    return <LoginForm />;
  }

  // Si está autenticado, mostrar layout principal
  return <Layout />;
};

/**
 * App principal envuelta en AuthProvider para contexto global
 */
function App() {
  return (
    <AuthProvider>       {/* <-- nuevo */}
      <div className="min-h-screen bg-gray-900 text-gray-100">
        <AppContent />
      </div>
    </AuthProvider>
  );
}


export default App;