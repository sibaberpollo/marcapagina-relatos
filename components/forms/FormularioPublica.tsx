'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FormData, FormStatus } from '../../lib/hooks/useFormState';
import { useTurnstile } from '../../lib/hooks/useTurnstile';
import { useFileUpload } from '../../lib/hooks/useFileUpload';

// Utilidad para enviar eventos a Google Analytics
function sendGAEvent({ action, category, label, value }: { action: string; category: string; label?: string; value?: string | number }) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
}

interface FormularioPublicaProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  isSubmitting: boolean;
  setIsSubmitting: (value: boolean) => void;
  status: FormStatus | null;
  setStatus: (status: FormStatus | null) => void;
  dotCount: number;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  showSource?: boolean;
  customTitle?: string;
}

const TURNSTILE_SITEKEY = process.env.NEXT_PUBLIC_TURNSTILE_SITEKEY!;

export default function FormularioPublica({
  formData,
  setFormData,
  isSubmitting,
  setIsSubmitting,
  status,
  setStatus,
  dotCount,
  handleChange,
  onSubmit,
  showSource = false,
  customTitle
}: FormularioPublicaProps) {
  
  const {
    captchaRef,
    token
  } = useTurnstile(TURNSTILE_SITEKEY);

  const {
    handleDrop,
    handleDragOver,
    handleFileInput,
    removeFile
  } = useFileUpload({ formData, setFormData });

  // Inicialización de Turnstile movida a los componentes padres (PublicaClient y ColaboradorDirectoClient)
  // Esto evita la inicialización duplicada que causa el error 600010
  
  return (
    <>
      {status && (
        <div
          className={`mx-auto max-w-2xl p-4 mb-6 rounded-lg ${
            status.success
              ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100'
              : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-100'
          }`}
        >
          {status.message}
        </div>
      )}

      <form
        onSubmit={onSubmit}
        className="mx-auto max-w-2xl space-y-6 bg-white dark:bg-gray-800 p-8 border border-black border-2 rounded-lg shadow"
        encType="multipart/form-data"
      >
        <p className="text-sm text-gray-600 dark:text-gray-400">Todos los campos son obligatorios. Los campos marcados con (<span className="text-red-600">*</span>) son requeridos.</p>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Tu correo electrónico <span className="text-red-600">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1 block w-full border border-black border-2 rounded-lg bg-gray-50 dark:bg-gray-900 p-2"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        {/* Campo para mostrar Source */}
        {showSource && (
          <div className="text-xs text-gray-500 -mt-2">
            <p>Fuente: {formData.source || 'No especificada'}</p>
          </div>
        )}

        {/* Descripción */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Presentación breve <span className="text-red-600">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            required
            className="mt-1 block w-full border border-black border-2 rounded-lg bg-gray-50 dark:bg-gray-900 p-2"
            value={formData.description}
            onChange={handleChange}
            placeholder="Cuéntanos un poco sobre ti y tu relato..."
          />
        </div>

        {/* Archivos */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Archivo (PDF, DOCX, TXT - máx. 1MB) <span className="text-red-600">*</span>
          </label>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className="mt-1 relative flex flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 p-6 text-gray-500"
          >
            <p>Arrastra y suelta tu archivo aquí o haz clic para seleccionar</p>
            <p className="text-sm text-gray-500">Máximo 1 archivo de 1MB (5-7 cuartillas)</p>
            <input
              type="file"
              accept=".pdf,.docx,.txt"
              required
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer border border-black border-2 rounded-lg"
              onChange={handleFileInput}
            />
          </div>
          {formData.files.length > 0 && (
            <ul className="mt-2 space-y-1 text-sm text-gray-700 dark:text-gray-300">
              {formData.files.map((f, i) => (
                <li
                  key={i}
                  className="flex justify-between items-center bg-gray-100 dark:bg-gray-800 p-2 rounded"
                >
                  <span className="truncate">{f.name} ({(f.size / (1024 * 1024)).toFixed(2)} MB)</span>
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    &times;
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* CAPTCHA */}
        <div className="mt-4">
          <div ref={captchaRef}></div>
        </div>

        {/* Consentimiento */}
        <div className="flex items-center">
          <input
            id="agree"
            name="agree"
            type="checkbox"
            required
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border border-black border-2 rounded-lg"
            checked={formData.agree}
            onChange={handleChange}
          />
          <label
            htmlFor="agree"
            className="ml-2 text-sm text-gray-700 dark:text-gray-300"
          >
            Acepto que este texto es original y cedo derechos de publicación a MarcaPágina. <span className="text-red-600">*</span>
          </label>
        </div>

        {/* Enviar */}
        <div>
          {!token && (
            <div className="text-sm text-red-600 mb-2">
              Completa el captcha antes de enviar (marca "No soy un robot").
            </div>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full inline-flex justify-center rounded-md py-2 px-4 shadow hover:bg-gray-900 focus:ring-2 focus:ring-gray-900 ${
              isSubmitting 
                ? 'bg-gray-500 text-white opacity-70' 
                : 'bg-black text-[#faff00]'
            }`}
          >
            {isSubmitting ? `Enviando${'.'.repeat(dotCount)}` : 'Enviar relato'}
          </button>
        </div>
      </form>
    </>
  );
} 