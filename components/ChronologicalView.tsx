'use client'

import ChronologicalLayout from '@/layouts/ChronologicalLayout'

interface ChronologicalViewProps {
  items: any[]
  itemsPerPage: number
  currentPage: number
}

export default function ChronologicalView({ items, itemsPerPage, currentPage }: ChronologicalViewProps) {
  return (
    <ChronologicalLayout
      items={items}
      itemsPerPage={itemsPerPage}
      currentPage={currentPage}
    />
  )
}
