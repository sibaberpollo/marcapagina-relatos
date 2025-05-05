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
    <div className="tabs flex border-b-2 border-black dark:border-gray-700 mb-6">
      <button 
        onClick={() => handleTabChange('relatos')} 
        className={`px-4 py-2 mr-2 rounded-t-lg font-medium border-b-4 transition-colors duration-200
          ${activeTab === 'relatos' 
            ? 'bg-black text-[#faff00] border-black' 
            : 'bg-transparent text-gray-700 border-transparent hover:bg-gray-100 hover:text-black'}
        `}
      >
        Relatos
      </button>
      <button 
        onClick={() => handleTabChange('series')} 
        className={`px-4 py-2 mr-2 rounded-t-lg font-medium border-b-4 transition-colors duration-200
          ${activeTab === 'series' 
            ? 'bg-black text-[#faff00] border-black' 
            : 'bg-transparent text-gray-700 border-transparent hover:bg-gray-100 hover:text-black'}
        `}
      >
        Series
      </button>
      <button 
        onClick={() => handleTabChange('articulos')} 
        className={`px-4 py-2 rounded-t-lg font-medium border-b-4 transition-colors duration-200
          ${activeTab === 'articulos' 
            ? 'bg-black text-[#faff00] border-black' 
            : 'bg-transparent text-gray-700 border-transparent hover:bg-gray-100 hover:text-black'}
        `}
      >
        No ficción
      </button>
    </div>
  );
} 