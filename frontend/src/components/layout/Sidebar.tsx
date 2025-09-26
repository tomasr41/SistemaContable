import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, 
  FileText, 
  BookOpen, 
  Calendar, 
  PieChart, 
  LogOut,
  ChevronRight,
  Library
} from 'lucide-react';

/**
 * Props que recibe el Sidebar
 * activeSection: la sección actualmente activa (para destacar)
 * onSectionChange: función para cambiar la sección activa
 */
interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

/**
 * Cada elemento del menú tiene un id, label, icono
 * y opcionalmente los permisos requeridos para verlo
 */
interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  requiredResource?: string;
  requiredAction?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeSection, onSectionChange }) => {
  const { usuario, logout, hasPermission } = useAuth();

  //  todos los items del menú, con sus permisos si los tienen
  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: PieChart },
    { id: 'usuarios', label: 'Gestión de Usuarios', icon: Users, requiredResource: 'usuarios', requiredAction: 'gestionar' },
    { id: 'cuentas', label: 'Plan de Cuentas', icon: BookOpen, requiredResource: 'plan-cuentas', requiredAction: 'ver' },
    { id: 'asientos', label: 'Asientos Contables', icon: FileText, requiredResource: 'asientos', requiredAction: 'ver' },
    { id: 'diario', label: 'Libro Diario', icon: Calendar, requiredResource: 'libro-diario', requiredAction: 'ver' },
    { id: 'mayor', label: 'Libro Mayor', icon: Library, requiredResource: 'libro-mayor', requiredAction: 'ver' },
    
  ];

  /**
   * Verifica si un item del menú debe mostrarse
   * - Si no tiene permisos requeridos, lo mostramos a todos
   * - Si tiene permisos, usamos el hasPermission del contexto
   */
  const canViewMenuItem = (item: MenuItem): boolean => {
    if (!item.requiredResource || !item.requiredAction) return true;
    return hasPermission(item.requiredResource, item.requiredAction);
  };

  /**
   * Cambia la sección activa
   */
  const handleMenuClick = (section: string) => {
    onSectionChange(section);
  };

  return (
    <div className="w-65 bg-gray-800 border-r border-gray-700 flex flex-col h-full">
      {/* Header del sidebar */}
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-xl font-bold text-gray-100 mb-2">Sistema Contable</h2>
        <div className="text-sm text-gray-400">
          <p className="font-medium text-gray-300">{usuario?.nombreUsuario}</p>
          <p className="capitalize">{usuario?.rol}</p>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems
          .filter(canViewMenuItem) // Solo mostramos los que el usuario puede ver
          .map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'}`} />
                <span className="font-medium">{item.label}</span>
                <ChevronRight className={`w-4 h-4 ml-auto transition-transform ${isActive ? 'rotate-90' : ''}`} />
              </button>
            );
          })}
      </nav>

      {/* Footer con logout */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-red-600 hover:text-white rounded-lg transition-all duration-200 group"
        >
          <LogOut className="w-5 h-5 text-gray-400 group-hover:text-white" />
          <span className="font-medium">Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};