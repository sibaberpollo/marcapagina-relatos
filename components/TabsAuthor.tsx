"use client";

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

type Tab = 'relatos' | 'series' | 'articulos';

interface TabsAuthorProps {
  onTabChange: (tab: Tab) => void;
  initialTab?: Tab;
}

export default function TabsAuthor({ onTabChange, initialTab = 'relatos' }: TabsAuthorProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  // Determinar el tab activo desde los parámetros de búsqueda o usar el initialTab
  const tabParam = searchParams.get('tab') as Tab | null;
  const [activeTab, setActiveTab] = useState<Tab>(
    tabParam && (tabParam === 'relatos' || tabParam === 'series' || tabParam === 'articulos') 
      ? tabParam 
      : initialTab
  );
  
  // Actualizar la URL cuando cambie el tab
  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    onTabChange(tab);
    
    // Crear un nuevo URLSearchParams y establecer el tab
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tab);
    
    // Actualizar la URL con el nuevo parámetro sin recargar la página
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };
  
  // Escuchar cambios en los parámetros de búsqueda para mantener sincronizado el estado
  useEffect(() => {
    if (tabParam && (tabParam === 'relatos' || tabParam === 'series' || tabParam === 'articulos')) {
      setActiveTab(tabParam);
      onTabChange(tabParam);
    }
  }, [tabParam, onTabChange]);

  return (
    <div className="tabs flex border-b border-gray-200 dark:border-gray-700 mb-6">
      <button 
        onClick={() => handleTabChange('relatos')} 
        className={`px-4 py-2 mr-2 rounded-t-lg font-medium ${
          activeTab === 'relatos' 
            ? 'bg-primary-500 text-white' 
            : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
      >
        Relatos
      </button>
      <button 
        onClick={() => handleTabChange('series')} 
        className={`px-4 py-2 mr-2 rounded-t-lg font-medium ${
          activeTab === 'series' 
            ? 'bg-primary-500 text-white' 
            : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
      >
        Series
      </button>
      <button 
        onClick={() => handleTabChange('articulos')} 
        className={`px-4 py-2 rounded-t-lg font-medium ${
          activeTab === 'articulos' 
            ? 'bg-primary-500 text-white' 
            : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
      >
        No ficción
      </button>
    </div>
  );
} 