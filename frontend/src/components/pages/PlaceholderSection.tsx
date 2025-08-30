import React from 'react';
import { Construction } from 'lucide-react';

interface PlaceholderSectionProps {
  title: string;
}

export const PlaceholderSection: React.FC<PlaceholderSectionProps> = ({ title }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      <Construction className="w-12 h-12 text-orange-500 mb-4" />
      <h1 className="text-2xl font-bold text-gray-100">
        {title} - Módulo en Desarrollo
      </h1>
    </div>
  );
};
