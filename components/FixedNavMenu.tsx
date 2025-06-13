// components/FixedNavMenu.tsx
'use client'

import { useEffect, useState } from 'react'
import { CoreContent } from 'pliny/utils/contentlayer'
import Link from 'next/link'
import Image from 'next/image'
import AutoAvatar from '@/components/AutoAvatar'
import { readingTimeActivities } from '@/data/readingTimeActivities'
import { Clock } from 'lucide-react'
import ShareIcons from './ShareIcons'

interface FixedNavMenuProps {
  title: string
  authorAvatar?: string
  authorName?: string
  slug: string
  relatedPosts: CoreContent<any>[]
  author: string
  pathPrefix: string
  readingTime?: { text: string; minutes: number; time: number; words: number }
  seriesName?: string
}

// Utilidad para enviar eventos a Google Analytics
function sendGAEvent({ action, category, label, value }: { action: string; category: string; label?: string; value?: string | number }) {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}

export default function FixedNavMenu({
  title,
  authorAvatar,
  authorName,
  slug,
  relatedPosts,
  author,
  pathPrefix,
  readingTime,
  seriesName,
}: FixedNavMenuProps) {
  const [readingProgress, setReadingProgress] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)

  // Reduce title to first two words
  const shortenTitle = (t: string) => {
    const words = t.split(' ')
    return words.length <= 3 ? t : `${words.slice(0, 2).join(' ')}...`
  }

  const sortedRelatedPosts = [...relatedPosts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  // Track scroll progress with improved cross-browser compatibility
  useEffect(() => {
    function updateProgress() {
      try {
        const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop
        const content = document.getElementById('post-content')
        
        if (content) {
          const rect = content.getBoundingClientRect()
          const contentTop = rect.top + scrollY
          const contentHeight = content.offsetHeight || content.scrollHeight || rect.height
          const windowHeight = window.innerHeight || document.documentElement.clientHeight
          const maxScroll = contentTop + contentHeight - windowHeight
          
          if (scrollY <= contentTop) {
            setReadingProgress(0)
          } else if (scrollY >= maxScroll) {
            setReadingProgress(100)
          } else {
            const progress = ((scrollY - contentTop) / (maxScroll - contentTop)) * 100
            setReadingProgress(Math.max(0, Math.min(100, progress)))
          }
        } else {
          // Fallback: usar la altura total del documento
          const documentHeight = Math.max(
            document.documentElement.scrollHeight,
            document.documentElement.offsetHeight,
            document.body.scrollHeight,
            document.body.offsetHeight
          )
          const windowHeight = window.innerHeight || document.documentElement.clientHeight
          const fullHeight = documentHeight - windowHeight
          
          if (fullHeight > 0) {
            const progress = (scrollY / fullHeight) * 100
            setReadingProgress(Math.max(0, Math.min(100, progress)))
          } else {
            setReadingProgress(0)
          }
        }
      } catch (error) {
        console.warn('Error calculating reading progress:', error)
        // Fallback simple
        const scrollY = window.scrollY || 0
        const fullHeight = document.documentElement.scrollHeight - window.innerHeight
        if (fullHeight > 0) {
          setReadingProgress(Math.max(0, Math.min(100, (scrollY / fullHeight) * 100)))
        }
      }
    }
    
    // Llamar inmediatamente y luego cada vez que se haga scroll
    updateProgress()
    
    // Retraso adicional para Firefox/Vivaldi
    const timeoutId = setTimeout(() => {
      updateProgress()
    }, 100)
    
    window.addEventListener('scroll', updateProgress, { passive: true })
    window.addEventListener('resize', updateProgress, { passive: true })
    
    // Event listener adicional para cuando el DOM cambie
    const observer = new MutationObserver(() => {
      updateProgress()
    })
    
    const postContent = document.getElementById('post-content')
    if (postContent) {
      observer.observe(postContent, { childList: true, subtree: true })
    }
    
    return () => {
      clearTimeout(timeoutId)
      observer.disconnect()
      window.removeEventListener('scroll', updateProgress)
      window.removeEventListener('resize', updateProgress)
    }
  }, [])

  return (
    <>
      {/* Fixed nav container at bottom */}
      <div className="fixed bottom-0 left-0 w-full bg-white dark:bg-gray-900 shadow-sm z-50">
        {/* Progress bar */}
        <div
          id="progress-bar-component"
          style={{ width: `${readingProgress}%` }}
        />

        {/* Main row: avatar, title, reading time, toggle button */}
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center space-x-2">
            {authorAvatar ? (
              <Link href={`/autor/${author}`}>
                <Image
                  src={authorAvatar}
                  alt={authorName || 'Author'}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              </Link>
            ) : authorName ? (
              <Link href={`/autor/${author}`}>
                <AutoAvatar 
                  name={authorName} 
                  size={32} 
                  className="h-8 w-8 rounded-full bg-black text-white font-titles text-sm flex items-center justify-center"
                />
              </Link>
            ) : null}
            <span className="font-medium text-gray-900 dark:text-gray-50">
              {shortenTitle(title)}{' '}
              {readingTime && (() => {
                const mins = Math.ceil(readingTime.minutes)
                const remaining = Math.max(Math.ceil(mins * (1 - readingProgress / 100)), 0)
                const acts = readingTimeActivities[mins] || []
                return acts.length ? (
                  <button
                    onClick={() => {
                      sendGAEvent({
                        action: 'open_reading_time_modal',
                        category: 'ReadingTime',
                        label: title,
                        value: readingTime ? Math.ceil(readingTime.minutes) : undefined,
                      })
                      setModalOpen(true)
                    }}
                    className="inline-flex items-center text-gray-900 dark:text-gray-50 hover:underline"
                  >
                    <span className="flex items-center px-2 py-0.5 rounded text-sm font-bold text-gray-900 dark:text-gray-50">
                      <span>(</span>
                      <span>{remaining} min</span>
                      <Clock className="mx-1 h-4 w-4 text-gray-900 dark:text-gray-50" />
                      <span>)</span>
                    </span>
                  </button>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-sm font-bold ml-1">
                    <span>(</span>
                    <span>{remaining} min</span>
                    <Clock className="mx-1 h-4 w-4" />
                    <span>)</span>
                  </span>
                )
              })()}
            </span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                sendGAEvent({
                  action: 'toggle_author_menu',
                  category: 'AuthorMenu',
                  label: authorName || author,
                  value: !menuOpen ? 'opened' : 'closed',
                })
                setMenuOpen(!menuOpen)
                setShareOpen(false)
              }}
              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                // Arrow down icon when open
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-5 w-5 text-black dark:text-gray-50 hover:text-primary-500"
                >
                  <path d="M5 8l5 5 5-5H5z" />
                </svg>
              ) : (
                // Arrow up icon when closed
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-5 w-5 text-black dark:text-gray-50 hover:text-primary-500"
                >
                  <path d="M5 12l5-5 5 5H5z" />
                </svg>
              )}
            </button>
            <button
              onClick={() => {
                sendGAEvent({
                  action: 'toggle_share_menu',
                  category: 'ShareMenu',
                  label: slug,
                  value: !shareOpen ? 'opened' : 'closed',
                })
                setShareOpen(!shareOpen)
                setMenuOpen(false)
              }}
              className="p-1 rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
              aria-label="Compartir"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5 text-gray-700 dark:text-gray-50"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Share panel */}
        <div
          className={`overflow-hidden transition-[max-height] duration-200 ease-in-out ${
            shareOpen ? 'max-h-40' : 'max-h-0'
          }`}
        >
          <ShareIcons title={title} slug={slug} className="bg-white dark:bg-gray-900 p-4 border-t border-gray-200 dark:border-gray-700" />
        </div>

        {/* Animated related posts panel */}
        <div
          className={
            `overflow-hidden transition-[max-height] duration-200 ease-in-out ` +
            (menuOpen ? 'max-h-60' : 'max-h-0')
          }
        >
          <div className="bg-white dark:bg-gray-900 p-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-gray-50">
              {seriesName ? (
                <>Más relatos de la serie <span className="text-gray-900 dark:text-gray-50">{seriesName}</span></>
              ) : (
                <>Más {pathPrefix === 'relato' ? 'relatos' : 'artículos'} de{' '}
                  <Link href={`/autor/${author}`} className="hover:underline">
                    {authorName}
                  </Link>
                </>
              )}
            </h3>
            <ul className="space-y-1">
              {sortedRelatedPosts.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/${pathPrefix}/${post.slug}`}
                    onClick={() => setMenuOpen(false)}
                    className={`block hover:underline ${post.slug === slug ? 'font-semibold' : ''}`}
                  >
                    {post.title}{' '}
                    {post.readingTime && `(${Math.ceil(post.readingTime.minutes)} min)`}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Reading time modal with side margins */}
      {modalOpen && readingTime && (() => {
        const mins = Math.ceil(readingTime.minutes)
        const acts = readingTimeActivities[mins] || []
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div
              className="absolute inset-0 bg-black opacity-50"
              onClick={() => setModalOpen(false)}
            />
            <div className="relative bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
              <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-50">
                Cosas que se hacen en ~{mins} {mins === 1 ? 'minuto' : 'minutos'}
              </h2>
              <ul className="list-disc list-inside space-y-2 text-sm mb-4 text-gray-700 dark:text-gray-300">
                {acts.map((act) => (
                  <li key={act}>{act}</li>
                ))}
              </ul>
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-gray-900 text-primary-500 dark:bg-primary-500 dark:text-gray-900 rounded hover:bg-gray-800 dark:hover:bg-primary-600"
              >
                Cerrar
              </button>
            </div>
          </div>
        )
      })()}
    </>
  )
}