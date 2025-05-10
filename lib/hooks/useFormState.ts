import { useState } from 'react';

export interface FormData {
  email: string;
  description: string;
  files: File[];
  agree: boolean;
  source: string;
}

export interface FormStatus {
  success: boolean;
  message: string;
}

export function useFormState(initialState: FormData) {
  const [formData, setFormData] = useState<FormData>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<FormStatus | null>(null);
  const [dotCount, setDotCount] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Efecto para el contador de puntos durante el envío
  const setupDotCountInterval = () => {
    if (isSubmitting) {
      const interval = setInterval(() => {
        setDotCount(prev => (prev + 1) % 4);
      }, 500);
      return () => clearInterval(interval);
    } else {
      setDotCount(0);
      return undefined;
    }
  };

  return {
    formData,
    setFormData,
    isSubmitting,
    setIsSubmitting,
    status,
    setStatus,
    dotCount,
    handleChange,
    setupDotCountInterval
  };
} 