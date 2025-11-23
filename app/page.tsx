import {
  getAllRelatosForChronologicalBySite,
  getSiteBySlug,
} from '../lib/sanity'
import SectionContainer from '@/components/layout/SectionContainer'
import { Metadata } from 'next'
import siteMetadata from '@/data/siteMetadata'
import HeroSection from '@/components/home/HeroSection'
import HoroscopeCTA from '@/components/home/HoroscopeCTA'
import ContentGrid from '@/components/home/ContentGrid'
import NewsletterForm from '@/components/home/NewsletterForm'

// Metadata específica para el home
export const metadata: Metadata = {
  title: siteMetadata.title,
  description: siteMetadata.description,
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: siteMetadata.siteUrl,
    siteName: siteMetadata.title,
    images: [siteMetadata.socialBanner],
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteMetadata.title,
    description: siteMetadata.description,
    images: [siteMetadata.socialBanner],
  },
  alternates: {
    canonical: siteMetadata.siteUrl,
    types: {
      'application/rss+xml': `${siteMetadata.siteUrl}/feed.xml`,
    },
  },
}

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function Page({ searchParams }: PageProps) {
  // Fetch data for the featured Transtextos story
  let featuredTranstextos: any = null

  try {
    const transtextos = await getAllRelatosForChronologicalBySite('transtextos', { limit: 1 })
    if (transtextos && transtextos.length > 0) {
      const story = transtextos[0]
      // Extract slug from href (format: /relato/slug)
      const slug = story.href.split('/').pop() || ''

      featuredTranstextos = {
        slug: slug,
        date: story.publishedAt,
        title: story.title,
        summary: story.description,
        tags: story.tags,
        author: {
          name: story.authorName,
          avatar: story.authorImgSrc,
        },
        image: story.imgSrc,
        bgColor: story.bgColor,
      }
    }
  } catch (error) {
    console.error('Error fetching Transtextos:', error)
  }

  return (
    <>
      <div className="flex flex-col w-full">
        {/* Section 1: Hero/Intro */}
        <HeroSection />

        {/* Section 2: Horoscope CTA */}
        <HoroscopeCTA />

        {/* Section 3: Content Grid (Articles + Transtextos + Meme) */}
        <ContentGrid featuredStory={featuredTranstextos} />

        {/* Section 4: Newsletter Form */}
        <NewsletterForm />
      </div>
    </>
  )
}
