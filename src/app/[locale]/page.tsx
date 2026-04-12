import type { Metadata } from 'next'
import { getLatestArticles } from '@/lib/getLatestArticles'
import { buildModuleLinkMap } from '@/lib/buildModuleLinkMap'
import { buildLanguageAlternates } from '@/lib/i18n-utils'
import type { Language } from '@/lib/content'
import type { Locale } from '@/i18n/routing'
import HomePageClient from './HomePageClient'

const SITE_NAME = 'Anime Reversal Wiki'
const SITE_DESCRIPTION =
  "Anime Reversal Wiki covers working codes, unit tier lists, traits, raids, evolutions, and progression guides for the Roblox anime tower defense game."
const SITE_KEYWORDS = [
  'Anime Reversal',
  'Roblox',
  'anime tower defense',
  'codes',
  'tier list',
  'units',
  'traits',
  'raids',
  'evolutions',
  'wiki',
]
const HOME_VIDEO_ID = 'tGztrIV0TA4'
const HOME_VIDEO_TITLE = 'Anime Reversal | Release Trailer'

const EXTERNAL_LINKS = {
  gamePage: 'https://www.roblox.com/games/85535589075948/Anime-Reversal',
  robloxGroup: 'https://www.roblox.com/communities/414406594/XTS-Production',
  discord: 'https://discord.gg/animereversal',
  youtubeChannel: 'https://www.youtube.com/@Watchpixel',
  trailer: 'https://www.youtube.com/watch?v=tGztrIV0TA4',
} as const

function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || 'https://www.animereversal.wiki'
}

interface PageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params
  const siteUrl = getSiteUrl()
  const canonicalPath = locale === 'en' ? '/' : `/${locale}`
  const heroImage = new URL('/images/hero.webp', siteUrl).toString()

  return {
    title: 'Anime Reversal Wiki - Codes, Units & Tier List',
    description: SITE_DESCRIPTION,
    keywords: SITE_KEYWORDS,
    alternates: buildLanguageAlternates('/', locale as Locale, siteUrl),
    openGraph: {
      type: 'website',
      locale,
      siteName: SITE_NAME,
      title: 'Anime Reversal Wiki - Codes, Units & Tier List',
      description: SITE_DESCRIPTION,
      url: `${siteUrl}${canonicalPath}`,
      images: [
        {
          url: heroImage,
          width: 1920,
          height: 1080,
          alt: 'Anime Reversal Wiki Hero Image',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Anime Reversal Wiki - Codes, Units & Tier List',
      description: SITE_DESCRIPTION,
      images: [heroImage],
    },
  }
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params
  const siteUrl = getSiteUrl()
  const heroImage = new URL('/images/hero.webp', siteUrl).toString()

  const latestArticles = await getLatestArticles(locale as Language, 30)
  const moduleLinkMap = await buildModuleLinkMap(locale as Language)

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        "name": SITE_NAME,
        "url": siteUrl,
        "description": SITE_DESCRIPTION,
        "image": heroImage,
      },
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        "name": SITE_NAME,
        "url": siteUrl,
        "logo": `${siteUrl}/android-chrome-512x512.png`,
        "image": heroImage,
        "sameAs": [
          EXTERNAL_LINKS.gamePage,
          EXTERNAL_LINKS.robloxGroup,
          EXTERNAL_LINKS.discord,
          EXTERNAL_LINKS.youtubeChannel,
        ],
      },
      {
        "@type": "VideoGame",
        "name": "Anime Reversal",
        "url": EXTERNAL_LINKS.gamePage,
        "gamePlatform": ["Roblox"],
        "genre": ["Tower Defense", "Anime", "Strategy"],
        "publisher": {
          "@type": "Organization",
          "name": "XTS Production",
        },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HomePageClient
        latestArticles={latestArticles}
        moduleLinkMap={moduleLinkMap}
        locale={locale}
        externalLinks={EXTERNAL_LINKS}
        videoId={HOME_VIDEO_ID}
        videoTitle={HOME_VIDEO_TITLE}
      />
    </>
  )
}
