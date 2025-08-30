import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Dashboard } from '../pages/Dashboard';
import { GestionUsuarios } from '../pages/GestionUsuarios';
import { PlaceholderSection } from '../pages/PlaceholderSection';

/**
 * Layout principal de la aplicación
 * Contiene sidebar y área de contenido principal
 */
export const Layout: React.FC = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  /**
   * Renderiza el contenido principal según la sección activa
   */
  const renderMainContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'usuarios':
        return <GestionUsuarios />;
      case 'asientos':
        return <PlaceholderSection 
          title="Asientos Contables"
         
        />;
      case 'cuentas':
        return <PlaceholderSection 
          title="Plan de Cuentas" 
          
        />;
      case 'diario':
        return <PlaceholderSection 
          title="Libro Diario" 
         
        />;
      case 'mayor':
        return <PlaceholderSection 
          title="Libro Mayor" 
          
        />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Sidebar */}
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
      />
      
      {/* Área de contenido principal */}
      <main className="flex-1 overflow-y-auto bg-gray-900">
        {renderMainContent()}
      </main>
    </div>
  );
};