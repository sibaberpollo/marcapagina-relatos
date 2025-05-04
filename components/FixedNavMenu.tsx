// components/FixedNavMenu.tsx
'use client'

import { useEffect, useState } from 'react'
import { CoreContent } from 'pliny/utils/contentlayer'
import Link from 'next/link'
import Image from 'next/image'
import { readingTimeActivities } from '@/data/readingTimeActivities'
import { Clock } from 'lucide-react'

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
  const [modalOpen, setModalOpen] = useState(false)

  // Reduce title to first two words
  const shortenTitle = (t: string) => {
    const words = t.split(' ')
    return words.length <= 3 ? t : `${words.slice(0, 2).join(' ')}...`
  }

  const sortedRelatedPosts = [...relatedPosts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  // Track scroll progress
  useEffect(() => {
    function updateProgress() {
      const scrollY = window.scrollY
      const fullHeight = document.documentElement.scrollHeight - window.innerHeight
      setReadingProgress(fullHeight ? (scrollY / fullHeight) * 100 : 0)
    }
    updateProgress()
    window.addEventListener('scroll', updateProgress)
    window.addEventListener('resize', updateProgress)
    return () => {
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
          className="h-1 bg-black"
          style={{ width: `${readingProgress}%` }}
        />

        {/* Main row: avatar, title, reading time, toggle button */}
        <div className="flex items-center justify-between p-2">
          <div className="flex items-center space-x-2">
            {authorAvatar && (
              <Link href={`/autor/${author}`}> 
                <Image
                  src={authorAvatar}
                  alt={authorName || 'Author'}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              </Link>
            )}
            <span className="font-medium text-gray-900">
              {shortenTitle(title)}{' '}
              {readingTime && (() => {
                const mins = Math.ceil(readingTime.minutes)
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
                    className="inline-flex items-center text-gray-900 hover:underline"
                  >
                    <span className="flex items-center px-2 py-0.5 rounded text-sm font-bold text-black">
                      <span>(</span>
                      <span>{mins} min</span>
                      <Clock className="mx-1 h-4 w-4 text-black" />
                      <span>)</span>
                    </span>
                  </button>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-sm font-bold ml-1">
                    <span>(</span>
                    <span>{mins} min</span>
                    <Clock className="mx-1 h-4 w-4" />
                    <span>)</span>
                  </span>
                )
              })()}
            </span>
          </div>
          <button
            onClick={() => {
              sendGAEvent({
                action: 'toggle_author_menu',
                category: 'AuthorMenu',
                label: authorName || author,
                value: !menuOpen ? 'opened' : 'closed',
              })
              setMenuOpen(!menuOpen)
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
                className="h-5 w-5 text-gray-500 hover:text-primary-500"
              >
                <path d="M5 8l5 5 5-5H5z" />
              </svg>
            ) : (
              // Arrow up icon when closed
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5 text-gray-500 hover:text-primary-500"
              >
                <path d="M5 12l5-5 5 5H5z" />
              </svg>
            )}
          </button>
        </div>

        {/* Animated related posts panel */}
        <div
          className={
            `overflow-hidden transition-[max-height] duration-200 ease-in-out ` +
            (menuOpen ? 'max-h-60' : 'max-h-0')
          }
        >
          <div className="bg-white dark:bg-gray-900 p-4 border-t">
            <h3 className="text-lg font-medium mb-2">
              {seriesName ? (
                <>Más relatos de la serie <span className="text-gray-900">{seriesName}</span></>
              ) : (
                <>Más {pathPrefix === 'relato' ? 'relatos' : 'artículos'} de{' '}
                  <Link href={`/autor/${author}`} className="text-gray-500 hover:underline">
                    {authorName}
                  </Link>
                </>
              )}
            </h3>
            <ul className="space-y-1">
              {sortedRelatedPosts.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/${author}/${pathPrefix}/${post.slug}`}
                    onClick={() => setMenuOpen(false)}
                    className={`block hover:text-primary-500 ${post.slug === slug ? 'font-semibold' : ''}`}
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
              <h2 className="text-lg font-semibold mb-4">
                Cosas que se hacen en ~{mins} {mins === 1 ? 'minuto' : 'minutos'}
              </h2>
              <ul className="list-disc list-inside space-y-2 text-sm mb-4">
                {acts.map((act) => (
                  <li key={act}>{act}</li>
                ))}
              </ul>
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-black text-[#faff00] rounded hover:bg-gray-900"
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