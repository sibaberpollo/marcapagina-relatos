// components/FixedNavMenu.tsx
'use client'

import { useEffect, useState } from 'react'
import { CoreContent } from 'pliny/utils/contentlayer'
import Link from 'next/link'

interface FixedNavMenuProps {
  title: string
  authorAvatar?: string
  authorName?: string
  slug: string
  relatedPosts: CoreContent<any>[]
  author: string    // aquí author es el slug del autor
  pathPrefix: string
}

export default function FixedNavMenu({
  title,
  authorAvatar,
  authorName,
  slug,
  relatedPosts,
  author,
  pathPrefix
}: FixedNavMenuProps) {
  const [readingProgress, setReadingProgress] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [minimized, setMinimized] = useState(false)

  const shortenTitle = (t: string, max: number = 25) =>
    t.length > max ? `${t.substring(0, max)}...` : t

  const sortedRelatedPosts = [...relatedPosts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  const toggleMinimize = () => {
    if (menuOpen) setMenuOpen(false)
    setMinimized(!minimized)
  }

  const expandIfMinimized = () => {
    if (minimized) setMinimized(false)
  }

  useEffect(() => {
    const updateReadingProgress = () => {
      const current = window.scrollY
      const full = document.documentElement.scrollHeight - window.innerHeight
      if (full) {
        setReadingProgress(Number((current / full).toFixed(2)) * 100)
      }
    }

    const handleScroll = () => {
      updateReadingProgress()
      if (menuOpen) setMenuOpen(false)
    }

    updateReadingProgress()
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', updateReadingProgress)

    const handleClickOutside = (e: MouseEvent) => {
      const tgt = e.target as HTMLElement
      if (
        menuOpen &&
        !tgt.closest('#fixed-nav-menu-component') &&
        !tgt.closest('#story-menu')
      ) {
        setMenuOpen(false)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', updateReadingProgress)
      document.removeEventListener('click', handleClickOutside)
    }
  }, [menuOpen])

  return (
    <>
      <div
        id="fixed-nav-menu-component"
        className={minimized ? 'minimized' : ''}
        onClick={expandIfMinimized}
      >
        <div
          id="minimize-handle"
          onClick={toggleMinimize}
          title={minimized ? 'Expandir menú' : 'Minimizar menú'}
        >
          <svg
            id="minimize-icon"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 
                 111.414 1.414l-4 4a1 1 0 
                 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        <div
          id="progress-bar-component"
          style={{ width: `${readingProgress}%` }}
        />

        <div id="menu-content-component">
          <div id="menu-left-section">
            {authorAvatar && (
              <Link href={`/autor/${author}`} legacyBehavior>
                <a>
                  <img
                    src={authorAvatar}
                    alt={authorName || 'Author'}
                    id="menu-avatar-component"
                  />
                </a>
              </Link>
            )}
            <div id="menu-title-component">
              {shortenTitle(title)}    
            </div>
          </div>

          <button
            id="menu-button"
            aria-label={`Ver más ${pathPrefix}`}
            onClick={(e) => {
              e.stopPropagation()
              setMenuOpen(!menuOpen)
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 
                0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        </div>
      </div>

      <div id="story-menu" className={menuOpen ? '' : 'hidden'}>
          <h3 id="story-menu-title" className="text-lg font-medium">
            Más {pathPrefix === 'relato' ? 'relatos' : 'artículos'} de{' '}
            <Link href={`/autor/${author}`} legacyBehavior>
              <a className="text-primary-500 hover:underline">
                {authorName}
              </a>
            </Link>
          </h3>
          {sortedRelatedPosts.map((post) => (
          <Link
            href={`/${author}/${pathPrefix}/${post.slug}`}
            key={post.slug}
            className={`story-menu-item ${post.slug === slug ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            {post.title}
          </Link>
        ))}
      </div>
    </>
  )
}
