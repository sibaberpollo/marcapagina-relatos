'use client'

import { useState, useEffect } from 'react'
import ChronologicalLayout from '@/layouts/ChronologicalLayout'
import LoadingSpinner from './LoadingSpinner'

interface ChronologicalViewProps {
  items: any[]
  itemsPerPage: number
  currentPage: number
}

export default function ChronologicalView({ items, itemsPerPage, currentPage }: ChronologicalViewProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500) // Pequeño delay para asegurar que el spinner se muestre

    return () => clearTimeout(timer)
  }, [currentPage])

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <ChronologicalLayout 
      items={items}
      itemsPerPage={itemsPerPage}
      currentPage={currentPage}
    />
  )
} 