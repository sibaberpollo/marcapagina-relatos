'use client'

import ChronologicalLayout from '@/layouts/ChronologicalLayout'

interface ChronologicalViewProps {
  items: any[]
  itemsPerPage: number
  currentPage: number
  basePath?: string
}

export default function ChronologicalView({ items, itemsPerPage, currentPage, basePath }: ChronologicalViewProps) {
  return (
    <ChronologicalLayout
      items={items}
      itemsPerPage={itemsPerPage}
      currentPage={currentPage}
      basePath={basePath}
    />
  )
}
