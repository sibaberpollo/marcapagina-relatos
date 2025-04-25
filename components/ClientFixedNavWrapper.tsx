// components/ClientFixedNavWrapper.tsx
'use client'

import dynamic from 'next/dynamic'
import { CoreContent } from 'pliny/utils/contentlayer'

const FixedNavMenu = dynamic(
  () => import('@/components/FixedNavMenu'),
  { ssr: false }
)

interface ClientFixedNavWrapperProps {
  title: string
  authorAvatar?: string
  authorName?: string
  slug: string
  relatedPosts: CoreContent<any>[]
  author: string
  pathPrefix: string
}

export default function ClientFixedNavWrapper({
  title,
  authorAvatar,
  authorName,
  slug,
  relatedPosts,
  author,
  pathPrefix
}: ClientFixedNavWrapperProps) {
  return (
    <FixedNavMenu
      title={title}
      authorAvatar={authorAvatar}
      authorName={authorName}
      slug={slug}
      relatedPosts={relatedPosts}
      author={author}
      pathPrefix={pathPrefix}
    />
  )
}
