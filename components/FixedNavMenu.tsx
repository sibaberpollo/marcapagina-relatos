// components/FixedNavMenu.tsx
'use client'

import { useEffect, useState } from 'react'
import { CoreContent } from 'pliny/utils/contentlayer'
import Link from 'next/link'
import Image from 'next/image'
import AutoAvatar from '@/components/AutoAvatar'
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

  // Track scroll progress
  useEffect(() => {
    function updateProgress() {
      const scrollY = window.scrollY
      const content = document.getElementById('post-content')
      if (content) {
        const contentTop = content.getBoundingClientRect().top + window.scrollY
        const maxScroll = contentTop + content.offsetHeight - window.innerHeight
        if (scrollY <= contentTop) {
          setReadingProgress(0)
        } else if (scrollY >= maxScroll) {
          setReadingProgress(100)
        } else {
          setReadingProgress(((scrollY - contentTop) / (maxScroll - contentTop)) * 100)
        }
      } else {
        const fullHeight = document.documentElement.scrollHeight - window.innerHeight
        setReadingProgress(fullHeight ? (scrollY / fullHeight) * 100 : 0)
      }
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
          id="progress-bar-component"
          className="h-1 bg-[var(--color-gray-950)] dark:bg-[var(--color-accent)]"
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
          <div className="bg-white dark:bg-gray-900 p-4 border-t border-gray-200 dark:border-gray-700 flex justify-around">
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  const url = window.location.href
                  window.open(
                    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
                    '_blank',
                    'noopener,noreferrer,width=600,height=400'
                  )
                  sendGAEvent({ action: 'share_facebook', category: 'Share', label: slug })
                }
              }}
              className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Facebook"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 text-[#1877F2]">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </button>
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  const url = window.location.href
                  window.open(
                    `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
                    '_blank',
                    'noopener,noreferrer,width=600,height=400'
                  )
                  sendGAEvent({ action: 'share_twitter', category: 'Share', label: slug })
                }
              }}
              className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Twitter"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 text-[#1DA1F2]">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
            </button>
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  const url = window.location.href
                  window.open(
                    `https://wa.me/?text=${encodeURIComponent(url)}`,
                    '_blank',
                    'noopener,noreferrer'
                  )
                  sendGAEvent({ action: 'share_whatsapp', category: 'Share', label: slug })
                }
              }}
              className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="WhatsApp"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 text-[#25D366]">
                <path d="M17.472 14.614c-.297-.149-1.758-.867-2.03-.967-.272-.099-.471-.148-.671.15-.199.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.757-1.653-2.054-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.15-.174.199-.298.298-.497.099-.198.05-.372-.025-.521-.074-.149-.671-1.611-.918-2.206-.242-.58-.487-.5-.671-.508-.173-.008-.372-.009-.571-.009-.199 0-.521.075-.795.373-.273.298-1.042 1.016-1.042 2.478 0 1.462 1.067 2.875 1.215 3.074.149.198 2.095 3.2 5.072 4.487.709.306 1.263.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.291.173-1.413-.074-.123-.272-.198-.57-.347zM11.997 1.929c-5.51 0-9.969 4.458-9.969 9.969a9.95 9.95 0 001.369 5.061L.939 22.154l5.348-2.811a9.96 9.96 0 005.71 1.653c5.51 0 9.97-4.459 9.97-9.97S17.508 1.929 11.997 1.929z" />
              </svg>
            </button>
            <button
              onClick={() => {
                if (typeof window !== 'undefined') {
                  const url = window.location.href
                  navigator.clipboard.writeText(url)
                  alert('Enlace copiado al portapapeles')
                  sendGAEvent({ action: 'share_copy', category: 'Share', label: slug })
                }
              }}
              className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Copiar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-5 w-5 text-gray-700">
                <path d="M16 1H4a1 1 0 00-1 1v14h2V3h11V1z" />
                <path d="M21 5H8a1 1 0 00-1 1v16a1 1 0 001 1h13a1 1 0 001-1V6a1 1 0 00-1-1zm-1 16H9V7h11v14z" />
              </svg>
            </button>
          </div>
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