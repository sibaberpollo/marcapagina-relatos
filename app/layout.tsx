import 'css/tailwind.css'
import 'pliny/search/algolia.css'
import 'remark-github-blockquote-alert/alert.css'

import { Playfair_Display, Source_Serif_4 } from 'next/font/google'
import { Analytics, AnalyticsConfig } from 'pliny/analytics'
import { SearchProvider, SearchConfig } from 'pliny/search'
import ConditionalHeader from '@/components/ConditionalHeader'
import ConditionalTopBar from '@/components/ConditionalTopBar'
import Footer from '@/components/Footer'
import Breadcrumbs from '@/components/Breadcrumbs'
import SectionContainer from '@/components/SectionContainer'
import ConditionalBackgroundWrapper from '@/components/ConditionalBackgroundWrapper'
import siteMetadata from '@/data/siteMetadata'
import OrganizationSchema from '@/components/OrganizationSchema'
import { ThemeProviders } from './theme-providers'
import { Metadata } from 'next'
import Script from 'next/script'
import { ThemeProvider } from 'next-themes'
import { SpeedInsights } from '@vercel/speed-insights/next'
import CookieBanner from '@/components/CookieBanner'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})
const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-source-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.title}`,
  },
  description: siteMetadata.description,
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: './',
    siteName: siteMetadata.title,
    images: [siteMetadata.socialBanner],
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: './',
    types: {
      'application/rss+xml': `${siteMetadata.siteUrl}/feed.xml`,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    title: siteMetadata.title,
    card: 'summary_large_image',
    images: [siteMetadata.socialBanner],
  },
}



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const basePath = process.env.BASE_PATH || ''
  const gaId = siteMetadata.analytics?.googleAnalytics?.googleAnalyticsId

  return (
    <html
      lang={siteMetadata.language}
      className={`scroll-smooth ${playfair.variable} ${sourceSerif.variable}`}
      suppressHydrationWarning
    >
      <head>
        {gaId && (
          <>
            {/* Consent Mode v2: default denied */}
            <Script id="consent-default" strategy="beforeInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('consent', 'default', {
                  ad_storage: 'denied',
                  analytics_storage: 'denied',
                  ad_user_data: 'denied',
                  ad_personalization: 'denied',
                  wait_for_update: 2000
                });
                window.acceptAllConsent = function(){
                  gtag('consent', 'update', {
                    ad_storage: 'granted',
                    analytics_storage: 'granted',
                    ad_user_data: 'granted',
                    ad_personalization: 'granted'
                  });
                }
                window.acceptAnalyticsOnly = function(){
                  gtag('consent', 'update', {
                    analytics_storage: 'granted',
                    ad_storage: 'denied',
                    ad_user_data: 'denied',
                    ad_personalization: 'denied'
                  });
                }
              `}
            </Script>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="gtag-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}  
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname
                });
              `}
            </Script>
          </>
        )}

        {/* Favicons & meta tags */}
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href={`${basePath}/static/favicons/apple-touch-icon.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href={`${basePath}/static/favicons/favicon-32x32.png`}
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href={`${basePath}/static/favicons/favicon-16x16.png`}
        />
        <link rel="manifest" href={`${basePath}/static/favicons/site.webmanifest`} />
        <link
          rel="mask-icon"
          href={`${basePath}/static/favicons/safari-pinned-tab.svg`}
          color="#5bbad5"
        />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: light)"
          content="#fff"
        />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: dark)"
          content="#000"
        />
        <link
          rel="alternate"
          type="application/rss+xml"
          href={`${basePath}/feed.xml`}
        />
        <OrganizationSchema />
      </head>
      <body className="antialiased font-serif bg-white text-black">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <ThemeProviders>
            <Analytics analyticsConfig={siteMetadata.analytics as AnalyticsConfig} />
            <SpeedInsights />
            <ConditionalHeader />
            <ConditionalTopBar />
            <ConditionalBackgroundWrapper>
              <SectionContainer>
                <Breadcrumbs />
              </SectionContainer>
              <SearchProvider searchConfig={siteMetadata.search as SearchConfig}>
                <main className="mb-auto font-serif bg-white text-black">{children}</main>
              </SearchProvider>
            </ConditionalBackgroundWrapper>
            <Footer />
            <CookieBanner />
          </ThemeProviders>
        </ThemeProvider>
      </body>
    </html>
  )
}