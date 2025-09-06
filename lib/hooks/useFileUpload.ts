import { useState } from 'react'
import { FormData } from './useFormState'

interface UseFileUploadProps {
  formData: FormData
  setFormData: (data: FormData) => void
  allowedExtensions?: string[]
  maxFileSize?: number
}

export function useFileUpload({
  formData,
  setFormData,
  allowedExtensions = ['pdf', 'docx', 'txt'],
  maxFileSize = 1048576, // 1MB
}: UseFileUploadProps) {
  const processFiles = (incoming: File[]) => {
    // Si ya tenemos un archivo, ignorar
    if (formData.files.length > 0) {
      alert(
        'Solo se permite un archivo. Por favor, elimina el archivo actual antes de agregar uno nuevo.'
      )
      return []
    }

    const valid: File[] = []
    for (const file of incoming) {
      const ext = file.name.split('.').pop()?.toLowerCase()

      // Verificar extensión
      if (!ext || !allowedExtensions.includes(ext)) {
        alert(`Formato no soportado: ${file.name}`)
        continue
      }

      // Verificar tamaño
      if (file.size > maxFileSize) {
        alert(
          `El archivo ${file.name} excede el límite de 1MB (${(file.size / (1024 * 1024)).toFixed(2)}MB)`
        )
        continue
      }

      // Solo aceptar el primer archivo válido
      valid.push(file)
      break
    }

    return valid
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const dropped = Array.from(e.dataTransfer.files)
    const valid = processFiles(dropped)
    setFormData({
      ...formData,
      files: [...formData.files, ...valid],
    })
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault()

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const valid = processFiles(Array.from(e.target.files))
    setFormData({
      ...formData,
      files: [...formData.files, ...valid],
    })
  }

  const removeFile = (idx: number) => {
    const newFiles = [...formData.files]
    newFiles.splice(idx, 1)
    setFormData({
      ...formData,
      files: newFiles,
    })
  }

  return {
    handleDrop,
    handleDragOver,
    handleFileInput,
    removeFile,
  }
}
