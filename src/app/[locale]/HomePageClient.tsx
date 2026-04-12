'use client'

import { useEffect, useState, Suspense, lazy } from 'react'
import {
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  ClipboardCheck,
  Eye,
  ExternalLink,
  Hammer,
  Home,
  Package,
  Settings,
  Sparkles,
  Star,
  TrendingUp,
} from 'lucide-react'
import Link from 'next/link'
import { useMessages } from 'next-intl'
import { VideoFeature } from '@/components/home/VideoFeature'
import { LatestGuidesAccordion } from '@/components/home/LatestGuidesAccordion'
import { NativeBannerAd, AdBanner } from '@/components/ads'
import { SidebarAd } from '@/components/ads/SidebarAd'
import { scrollToSection } from '@/lib/scrollToSection'
import { DynamicIcon } from '@/components/ui/DynamicIcon'
import type { ContentItemWithType } from '@/lib/getLatestArticles'
import type { ModuleLinkMap } from '@/lib/buildModuleLinkMap'

// Lazy load heavy components
const HeroStats = lazy(() => import('@/components/home/HeroStats'))
const FAQSection = lazy(() => import('@/components/home/FAQSection'))
const CTASection = lazy(() => import('@/components/home/CTASection'))

// Loading placeholder
const LoadingPlaceholder = ({ height = 'h-64' }: { height?: string }) => (
  <div className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`} />
)

// Conditionally render text as a link or plain span
function LinkedTitle({
  linkData,
  children,
  className,
  locale,
}: {
  linkData: { url: string; title: string } | null | undefined
  children: React.ReactNode
  className?: string
  locale: string
}) {
  if (linkData) {
    const href = locale === 'en' ? linkData.url : `/${locale}${linkData.url}`
    return (
      <Link
        href={href}
        className={`${className || ''} hover:text-[hsl(var(--nav-theme-light))] hover:underline decoration-[hsl(var(--nav-theme-light))/0.4] underline-offset-4 transition-colors`}
        title={linkData.title}
      >
        {children}
      </Link>
    )
  }
  if (className) return <span className={className}>{children}</span>
  return <>{children}</>
}

interface HomePageClientProps {
  latestArticles: ContentItemWithType[]
  moduleLinkMap: ModuleLinkMap
  locale: string
  externalLinks: {
    gamePage: string
    robloxGroup: string
    discord: string
    youtubeChannel: string
    trailer: string
  }
  videoId: string
  videoTitle: string
}

export default function HomePageClient({
  latestArticles,
  moduleLinkMap,
  locale,
  externalLinks,
  videoId,
  videoTitle,
}: HomePageClientProps) {
  const t = useMessages() as any

  // FAQ accordion states
  const [faqExpanded, setFaqExpanded] = useState<number | null>(null)

  // Scroll reveal animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('scroll-reveal-visible')
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('.scroll-reveal').forEach((el) => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* 左侧广告容器 - Fixed 定位 */}
      <aside
        className="hidden xl:block fixed top-20 w-40 z-10"
        style={{ left: 'calc((100vw - 896px) / 2 - 180px)' }}
      >
        <SidebarAd type="sidebar-160x300" adKey={process.env.NEXT_PUBLIC_AD_SIDEBAR_160X300} />
      </aside>

      {/* 右侧广告容器 - Fixed 定位 */}
      <aside
        className="hidden xl:block fixed top-20 w-40 z-10"
        style={{ right: 'calc((100vw - 896px) / 2 - 180px)' }}
      >
        <SidebarAd type="sidebar-160x600" adKey={process.env.NEXT_PUBLIC_AD_SIDEBAR_160X600} />
      </aside>

      {/* 广告位 1: 移动端横幅 Sticky */}
      {/* <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div> */}

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-6">
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">{t.hero.badge}</span>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a
                href={externalLinks.discord}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-lg transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </a>
              <a
                href={externalLinks.gamePage}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-lg transition-colors"
              >
                {t.hero.playOnSteamCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* 广告位 2: 原生横幅 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ''} />

      {/* Video Section */}
      <section className="px-4 py-12">
        <div className="scroll-reveal container mx-auto max-w-4xl">
          <div className="relative rounded-2xl overflow-hidden">
            <VideoFeature
              videoId={videoId}
              title={videoTitle}
              posterImage="/images/hero.webp"
            />
          </div>
        </div>
      </section>

      {/* Latest Updates Section */}
      <LatestGuidesAccordion articles={latestArticles} locale={locale} max={30} />

      {/* 广告位 3: 标准横幅 728×90 */}
      <AdBanner type="banner-728x90" adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90} />

      {/* Tools Grid - 16 Navigation Cards */}
      <section className="px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t.tools.title}{' '}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-muted-foreground text-lg">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {t.tools.cards.map((card: any, index: number) => {
              // 映射卡片索引到 section ID
              const sectionIds = [
                'anime-reversal-codes', 'anime-reversal-tier-list', 'anime-reversal-beginner-guide', 'anime-reversal-units',
                'anime-reversal-traits-guide', 'anime-reversal-evolutions', 'anime-reversal-secret-units', 'anime-reversal-raids',
                'anime-reversal-best-units', 'anime-reversal-update-notes', 'anime-reversal-trait-rerolls', 'anime-reversal-gems-guide',
                'anime-reversal-summon-banners', 'anime-reversal-story-mode-guide', 'anime-reversal-infinite-mode', 'anime-reversal-community-links'
              ]
              const sectionId = sectionIds[index]

              return (
                <a
                  key={index}
                  href={`#${sectionId}`}
                  onClick={(event) => {
                    event.preventDefault()
                    scrollToSection(sectionId)
                  }}
                  className="scroll-reveal group p-6 rounded-xl border border-border
                             bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                             transition-all duration-300 cursor-pointer text-left
                             hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="w-12 h-12 rounded-lg mb-4
                                  bg-[hsl(var(--nav-theme)/0.1)]
                                  flex items-center justify-center
                                  group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                  transition-colors">
                    <DynamicIcon
                      name={card.icon}
                      className="w-6 h-6 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <h3 className="font-semibold mb-2">{card.title}</h3>
                  <p className="text-sm text-muted-foreground">{card.description}</p>
                </a>
              )
            })}
          </div>
        </div>
      </section>

      {/* 广告位 4: 方形广告 300×250 */}
      <AdBanner type="banner-300x250" adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250} />

      {/* Module 1: Beginner Guide */}
      <section id="anime-reversal-codes" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['lucidBlocksBeginnerGuide']} locale={locale}>
                {t.modules.lucidBlocksBeginnerGuide.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.lucidBlocksBeginnerGuide.intro}
            </p>
          </div>

          {/* Steps */}
          <div className="scroll-reveal space-y-4 mb-10">
            {t.modules.lucidBlocksBeginnerGuide.steps.map((step: any, index: number) => (
              <div key={index} className="flex gap-4 p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[hsl(var(--nav-theme)/0.2)] border-2 border-[hsl(var(--nav-theme)/0.5)] flex items-center justify-center">
                  <span className="text-xl font-bold text-[hsl(var(--nav-theme-light))]">{index + 1}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    <LinkedTitle linkData={moduleLinkMap[`lucidBlocksBeginnerGuide::steps::${index}`]} locale={locale}>
                      {step.title}
                    </LinkedTitle>
                  </h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Tips */}
          <div className="scroll-reveal p-6 bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.3)] rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
              <h3 className="font-bold text-lg">Anime Reversal Code Tips</h3>
            </div>
            <ul className="space-y-2">
              {t.modules.lucidBlocksBeginnerGuide.quickTips.map((tip: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground text-sm">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 广告位 5: 中型横幅 468×60 */}
      <AdBanner type="banner-468x60" adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60} />

      {/* Module 2: Apotheosis Crafting */}
      <section id="anime-reversal-tier-list" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['lucidBlocksApotheosisCrafting']} locale={locale}>{t.modules.lucidBlocksApotheosisCrafting.title}</LinkedTitle></h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.lucidBlocksApotheosisCrafting.intro}</p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {t.modules.lucidBlocksApotheosisCrafting.cards.map((card: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <h3 className="font-bold text-lg mb-2 text-[hsl(var(--nav-theme-light))]">
                  <LinkedTitle linkData={moduleLinkMap[`lucidBlocksApotheosisCrafting::cards::${index}`]} locale={locale}>
                    {card.name}
                  </LinkedTitle>
                </h3>
                <p className="text-muted-foreground text-sm">{card.description}</p>
              </div>
            ))}
          </div>
          <div className="scroll-reveal flex flex-wrap gap-3 justify-center">
            {t.modules.lucidBlocksApotheosisCrafting.milestones.map((m: string, i: number) => (
              <span key={i} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-sm">
                <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />{m}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Module 3: Tools and Weapons */}
      <section id="anime-reversal-beginner-guide" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['lucidBlocksToolsAndWeapons']} locale={locale}>{t.modules.lucidBlocksToolsAndWeapons.title}</LinkedTitle></h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.lucidBlocksToolsAndWeapons.intro}</p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.modules.lucidBlocksToolsAndWeapons.items.map((item: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <Hammer className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                  <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">{item.type}</span>
                </div>
                <h3 className="font-bold mb-2">
                  <LinkedTitle linkData={moduleLinkMap[`lucidBlocksToolsAndWeapons::items::${index}`]} locale={locale}>
                    {item.name}
                  </LinkedTitle>
                </h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 4: Storage and Inventory */}
      <section id="anime-reversal-units" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['lucidBlocksStorageAndInventory']} locale={locale}>{t.modules.lucidBlocksStorageAndInventory.title}</LinkedTitle></h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.lucidBlocksStorageAndInventory.intro}</p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {t.modules.lucidBlocksStorageAndInventory.solutions.map((s: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-bold">
                    <LinkedTitle linkData={moduleLinkMap[`lucidBlocksStorageAndInventory::solutions::${index}`]} locale={locale}>
                      {s.name}
                    </LinkedTitle>
                  </h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">{s.role}</span>
                </div>
                <p className="text-muted-foreground text-sm">{s.description}</p>
              </div>
            ))}
          </div>
          <div className="scroll-reveal p-6 bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.3)] rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
              <h3 className="font-bold">Anime Reversal Unit Build Tips</h3>
            </div>
            <ul className="space-y-2">
              {t.modules.lucidBlocksStorageAndInventory.managementTips.map((tip: string, i: number) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground text-sm">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Module 5: Qualia and Base Building */}
      <section id="anime-reversal-traits-guide" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['lucidBlocksQualiaAndBaseBuilding']} locale={locale}>{t.modules.lucidBlocksQualiaAndBaseBuilding.title}</LinkedTitle></h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.lucidBlocksQualiaAndBaseBuilding.intro}</p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
            {t.modules.lucidBlocksQualiaAndBaseBuilding.cards.map((card: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <h3 className="font-bold text-lg text-[hsl(var(--nav-theme-light))]">
                    <LinkedTitle linkData={moduleLinkMap[`lucidBlocksQualiaAndBaseBuilding::cards::${index}`]} locale={locale}>
                      {card.name}
                    </LinkedTitle>
                  </h3>
                  {card.role ? (
                    <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                      {card.role}
                    </span>
                  ) : null}
                </div>
                <p className="text-muted-foreground text-sm">{card.description}</p>
                {(card.bestTrait || card.rerollPriority || card.rerollStation) ? (
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="p-3 rounded-lg border border-border bg-[hsl(var(--nav-theme)/0.06)]">
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Best Trait</p>
                      <p className="text-sm font-medium">{card.bestTrait || 'N/A'}</p>
                    </div>
                    <div className="p-3 rounded-lg border border-border bg-[hsl(var(--nav-theme)/0.06)]">
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Reroll Priority</p>
                      <p className="text-sm font-medium">{card.rerollPriority || 'N/A'}</p>
                    </div>
                    <div className="p-3 rounded-lg border border-border bg-[hsl(var(--nav-theme)/0.06)]">
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Reroll Station</p>
                      <p className="text-sm font-medium">{card.rerollStation || 'N/A'}</p>
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
          <div className="scroll-reveal grid grid-cols-2 md:grid-cols-4 gap-4">
            {t.modules.lucidBlocksQualiaAndBaseBuilding.highlights.map((h: string, i: number) => {
              const HighlightIcon = [Sparkles, TrendingUp, Settings, Home][i % 4]
              return (
                <div key={i} className="p-4 bg-white/5 border border-border rounded-xl text-center hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                  <HighlightIcon className="w-6 h-6 text-[hsl(var(--nav-theme-light))] mx-auto mb-2" />
                  <p className="text-sm">{h}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Module 6: World Regions */}
      <section id="anime-reversal-evolutions" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['lucidBlocksWorldRegions']} locale={locale}>{t.modules.lucidBlocksWorldRegions.title}</LinkedTitle></h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.lucidBlocksWorldRegions.intro}</p>
          </div>
          <div className="scroll-reveal relative pl-6 border-l-2 border-[hsl(var(--nav-theme)/0.3)] space-y-6">
            {t.modules.lucidBlocksWorldRegions.regions.map((region: any, index: number) => (
              <div key={index} className="relative">
                <div className="absolute -left-[1.65rem] w-5 h-5 rounded-full bg-[hsl(var(--nav-theme))] border-2 border-background" />
                <div className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <Eye className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                    <h3 className="font-bold">
                      <LinkedTitle linkData={moduleLinkMap[`lucidBlocksWorldRegions::regions::${index}`]} locale={locale}>
                        {region.name}
                      </LinkedTitle>
                    </h3>
                    <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">{region.type}</span>
                  </div>
                  {region.targetForm ? (
                    <p className="text-sm mb-2"><span className="text-[hsl(var(--nav-theme-light))] font-semibold">Target Form:</span> {region.targetForm}</p>
                  ) : null}
                  {region.materials ? (
                    <p className="text-sm mb-2"><span className="text-[hsl(var(--nav-theme-light))] font-semibold">Materials:</span> {region.materials}</p>
                  ) : null}
                  {region.trigger ? (
                    <p className="text-sm mb-3"><span className="text-[hsl(var(--nav-theme-light))] font-semibold">Trigger:</span> {region.trigger}</p>
                  ) : null}
                  {region.steps?.length ? (
                    <ul className="space-y-2 mb-3">
                      {region.steps.map((step: string, stepIndex: number) => (
                        <li key={stepIndex} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{step}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  <p className="text-muted-foreground text-sm">{region.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 7: Creatures and Enemies */}
      <section id="anime-reversal-secret-units" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['lucidBlocksCreaturesAndEnemies']} locale={locale}>{t.modules.lucidBlocksCreaturesAndEnemies.title}</LinkedTitle></h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.lucidBlocksCreaturesAndEnemies.intro}</p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.lucidBlocksCreaturesAndEnemies.creatures.map((c: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="text-xs px-2 py-1 rounded-full border bg-[hsl(var(--nav-theme)/0.12)] border-[hsl(var(--nav-theme)/0.35)] text-[hsl(var(--nav-theme-light))]">
                    {c.role}
                  </span>
                  {c.worthBuilding ? (
                    <span className="text-xs px-2 py-1 rounded-full border bg-[hsl(var(--nav-theme)/0.08)] border-[hsl(var(--nav-theme)/0.25)]">
                      {c.worthBuilding}
                    </span>
                  ) : null}
                </div>
                <h3 className="font-bold mb-2">
                  <LinkedTitle linkData={moduleLinkMap[`lucidBlocksCreaturesAndEnemies::creatures::${index}`]} locale={locale}>
                    {c.name}
                  </LinkedTitle>
                </h3>
                <div className="space-y-2 text-sm mb-3">
                  {c.currentRole ? (
                    <p><span className="text-[hsl(var(--nav-theme-light))] font-semibold">Current Role:</span> {c.currentRole}</p>
                  ) : null}
                  {c.prerequisites ? (
                    <p><span className="text-[hsl(var(--nav-theme-light))] font-semibold">Prerequisites:</span> {c.prerequisites}</p>
                  ) : null}
                  {c.obtainMethod ? (
                    <p><span className="text-[hsl(var(--nav-theme-light))] font-semibold">Obtain Method:</span> {c.obtainMethod}</p>
                  ) : null}
                </div>
                <p className="text-muted-foreground text-sm">{c.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 8: Mobility Gear */}
      <section id="anime-reversal-raids" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['lucidBlocksMobilityGear']} locale={locale}>{t.modules.lucidBlocksMobilityGear.title}</LinkedTitle></h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.lucidBlocksMobilityGear.intro}</p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
            {t.modules.lucidBlocksMobilityGear.items.map((item: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <ArrowRight className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                  <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">{item.type}</span>
                  {item.soloPossible ? (
                    <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.08)] border border-[hsl(var(--nav-theme)/0.25)]">
                      Solo: {item.soloPossible}
                    </span>
                  ) : null}
                </div>
                <h3 className="font-bold mb-2">
                  <LinkedTitle linkData={moduleLinkMap[`lucidBlocksMobilityGear::items::${index}`]} locale={locale}>
                    {item.name}
                  </LinkedTitle>
                </h3>
                {item.chaseTarget ? (
                  <p className="text-sm mb-2"><span className="text-[hsl(var(--nav-theme-light))] font-semibold">Chase Target:</span> {item.chaseTarget}</p>
                ) : null}
                {item.minimumCore ? (
                  <p className="text-sm mb-3"><span className="text-[hsl(var(--nav-theme-light))] font-semibold">Minimum Core:</span> {item.minimumCore}</p>
                ) : null}
                {item.bestUnits?.length ? (
                  <div className="mb-3">
                    <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-2">Best Units</p>
                    <div className="flex flex-wrap gap-2">
                      {item.bestUnits.map((unit: string, unitIndex: number) => (
                        <span key={unitIndex} className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.08)] border border-[hsl(var(--nav-theme)/0.25)]">
                          {unit}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
                {item.wavePriorities?.length ? (
                  <ul className="space-y-2 mb-3">
                    {item.wavePriorities.map((priority: string, priorityIndex: number) => (
                      <li key={priorityIndex} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{priority}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </div>
            ))}
          </div>
          <div className="scroll-reveal flex flex-wrap gap-3 justify-center">
            {t.modules.lucidBlocksMobilityGear.unlockMilestones.map((m: string, i: number) => (
              <span key={i} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-sm">
                <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />{m}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 6: 移动端横幅 320×50 */}
      <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />

      {/* Module 9: Farming and Growth */}
      <section id="anime-reversal-best-units" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['lucidBlocksFarmingAndGrowth']} locale={locale}>{t.modules.lucidBlocksFarmingAndGrowth.title}</LinkedTitle></h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.lucidBlocksFarmingAndGrowth.intro}</p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {t.modules.lucidBlocksFarmingAndGrowth.sections.map((s: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                  <h3 className="font-bold">
                    <LinkedTitle linkData={moduleLinkMap[`lucidBlocksFarmingAndGrowth::sections::${index}`]} locale={locale}>
                      {s.name}
                    </LinkedTitle>
                  </h3>
                </div>
                <p className="text-muted-foreground text-sm">{s.description}</p>
              </div>
            ))}
          </div>
          <div className="scroll-reveal flex flex-wrap gap-3 justify-center">
            {t.modules.lucidBlocksFarmingAndGrowth.growthMilestones.map((m: string, i: number) => (
              <span key={i} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-sm">
                <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />{m}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Module 10: Best Early Unlocks */}
      <section id="anime-reversal-update-notes" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['lucidBlocksBestEarlyUnlocks']} locale={locale}>{t.modules.lucidBlocksBestEarlyUnlocks.title}</LinkedTitle></h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.lucidBlocksBestEarlyUnlocks.intro}</p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.modules.lucidBlocksBestEarlyUnlocks.priorities.map((p: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                  <span className="text-xs px-2 py-1 rounded-full border bg-[hsl(var(--nav-theme)/0.18)] border-[hsl(var(--nav-theme)/0.45)] text-[hsl(var(--nav-theme-light))]">{p.priority}</span>
                </div>
                <h3 className="font-bold mb-2">
                  <LinkedTitle linkData={moduleLinkMap[`lucidBlocksBestEarlyUnlocks::priorities::${index}`]} locale={locale}>
                    {p.name}
                  </LinkedTitle>
                </h3>
                <p className="text-muted-foreground text-sm">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 11: Achievement Tracker */}
      <section id="anime-reversal-trait-rerolls" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['lucidBlocksAchievementTracker']} locale={locale}>{t.modules.lucidBlocksAchievementTracker.title}</LinkedTitle></h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.lucidBlocksAchievementTracker.intro}</p>
          </div>
          <div className="scroll-reveal space-y-6">
            {t.modules.lucidBlocksAchievementTracker.groups.map((group: any, gi: number) => (
              <div key={gi} className="p-6 bg-white/5 border border-border rounded-xl">
                <div className="flex items-center gap-2 mb-4">
                  <ClipboardCheck className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                  <h3 className="font-bold text-lg">
                    <LinkedTitle linkData={moduleLinkMap[`lucidBlocksAchievementTracker::groups::${gi}`]} locale={locale}>
                      {group.name}
                    </LinkedTitle>
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {group.achievements.map((a: any, ai: number) => (
                    <div key={ai} className="p-3 bg-white/5 border border-border rounded-lg">
                      <p className="font-semibold text-sm text-[hsl(var(--nav-theme-light))]">{a.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{a.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 12: Singleplayer FAQ */}
      <section id="anime-reversal-gems-guide" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['lucidBlocksSingleplayerAndPlatformFAQ']} locale={locale}>{t.modules.lucidBlocksSingleplayerAndPlatformFAQ.title}</LinkedTitle></h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.lucidBlocksSingleplayerAndPlatformFAQ.intro}</p>
          </div>
          <div className="scroll-reveal space-y-2">
            {t.modules.lucidBlocksSingleplayerAndPlatformFAQ.faqs.map((faq: any, index: number) => (
              <div key={index} className="border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setFaqExpanded(faqExpanded === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
                >
                  <span className="font-semibold">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform ${faqExpanded === index ? "rotate-180" : ""}`} />
                </button>
                {faqExpanded === index && (
                  <div className="px-5 pb-5 text-muted-foreground text-sm">{faq.answer}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 13: Summon Banners */}
      <section id="anime-reversal-summon-banners" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['lucidBlocksSteamDeckAndController']} locale={locale}>
                {t.modules.lucidBlocksSteamDeckAndController.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.lucidBlocksSteamDeckAndController.intro}
            </p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {t.modules.lucidBlocksSteamDeckAndController.cards.map((card: any, index: number) => (
              <div key={index} className="p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[hsl(var(--nav-theme)/0.12)] border border-[hsl(var(--nav-theme)/0.35)] flex items-center justify-center">
                    <DynamicIcon
                      name={card.icon}
                      className="w-5 h-5 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                    {card.tag}
                  </span>
                </div>
                <h3 className="font-bold mb-2 text-[hsl(var(--nav-theme-light))]">
                  <LinkedTitle linkData={moduleLinkMap[`lucidBlocksSteamDeckAndController::cards::${index}`]} locale={locale}>
                    {card.name}
                  </LinkedTitle>
                </h3>
                <p className="text-muted-foreground text-sm mb-4">{card.summary}</p>
                <ul className="space-y-2">
                  {card.bullets.map((bullet: string, bulletIndex: number) => (
                    <li key={bulletIndex} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                      <span className="text-xs text-muted-foreground">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 14: Story Mode Guide */}
      <section id="anime-reversal-story-mode-guide" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['lucidBlocksSettingsAndAccessibility']} locale={locale}>{t.modules.lucidBlocksSettingsAndAccessibility.title}</LinkedTitle></h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.lucidBlocksSettingsAndAccessibility.intro}</p>
          </div>
          <div className="scroll-reveal space-y-6">
            {t.modules.lucidBlocksSettingsAndAccessibility.stages.map((stage: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex items-start gap-3 mb-5">
                  <div className="w-11 h-11 rounded-lg bg-[hsl(var(--nav-theme)/0.12)] border border-[hsl(var(--nav-theme)/0.35)] flex items-center justify-center flex-shrink-0">
                    <DynamicIcon
                      name={stage.icon}
                      className="w-5 h-5 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[hsl(var(--nav-theme-light))]">
                      <LinkedTitle linkData={moduleLinkMap[`lucidBlocksSettingsAndAccessibility::stages::${index}`]} locale={locale}>
                        {stage.stage}
                      </LinkedTitle>
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">{stage.goal}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-[hsl(var(--nav-theme)/0.25)] bg-[hsl(var(--nav-theme)/0.06)]">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-3">Anime Reversal Recommended Units</p>
                    <div className="flex flex-wrap gap-2">
                      {stage.recommendedUnits.map((unit: string, unitIndex: number) => (
                        <span key={unitIndex} className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.14)] border border-[hsl(var(--nav-theme)/0.35)]">
                          {unit}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-[hsl(var(--nav-theme)/0.25)] bg-[hsl(var(--nav-theme)/0.06)]">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground mb-3">Anime Reversal Upgrade Order</p>
                    <ul className="space-y-2">
                      {stage.upgradeOrder.map((item: string, itemIndex: number) => (
                        <li key={itemIndex} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                          <span className="text-xs text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-4 p-4 rounded-xl border border-[hsl(var(--nav-theme)/0.25)] bg-[hsl(var(--nav-theme)/0.04)]">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground mb-3">Anime Reversal Story Clear Tips</p>
                  <ul className="space-y-2">
                    {stage.clearTips.map((tip: string, tipIndex: number) => (
                      <li key={tipIndex} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                        <span className="text-xs text-muted-foreground">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 15: Infinite Mode */}
      <section id="anime-reversal-infinite-mode" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['lucidBlocksUpdatesAndPatchNotes']} locale={locale}>{t.modules.lucidBlocksUpdatesAndPatchNotes.title}</LinkedTitle></h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.lucidBlocksUpdatesAndPatchNotes.intro}</p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {t.modules.lucidBlocksUpdatesAndPatchNotes.cards.map((card: any, index: number) => (
              <div key={index} className="p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[hsl(var(--nav-theme)/0.12)] border border-[hsl(var(--nav-theme)/0.35)] flex items-center justify-center">
                    <DynamicIcon
                      name={card.icon}
                      className="w-5 h-5 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                    {card.tag}
                  </span>
                </div>
                <h3 className="font-bold mb-2 text-[hsl(var(--nav-theme-light))]">
                  <LinkedTitle linkData={moduleLinkMap[`lucidBlocksUpdatesAndPatchNotes::cards::${index}`]} locale={locale}>
                    {card.name}
                  </LinkedTitle>
                </h3>
                <p className="text-muted-foreground text-sm mb-4">{card.summary}</p>
                <ul className="space-y-2">
                  {card.bullets.map((bullet: string, bulletIndex: number) => (
                    <li key={bulletIndex} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                      <span className="text-xs text-muted-foreground">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 16: Community Links */}
      <section id="anime-reversal-community-links" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['lucidBlocksCrashFixAndTroubleshooting']} locale={locale}>{t.modules.lucidBlocksCrashFixAndTroubleshooting.title}</LinkedTitle></h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.lucidBlocksCrashFixAndTroubleshooting.intro}</p>
          </div>
          <div className="scroll-reveal grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
            {t.modules.lucidBlocksCrashFixAndTroubleshooting.links.map((communityLink: any, index: number) => (
              <a
                key={index}
                href={communityLink.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-4 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] hover:bg-[hsl(var(--nav-theme)/0.06)] transition-colors"
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-[hsl(var(--nav-theme)/0.12)] border border-[hsl(var(--nav-theme)/0.35)] flex items-center justify-center">
                    <DynamicIcon
                      name={communityLink.icon}
                      className="w-5 h-5 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </div>
                <span className="inline-flex mb-2 text-[11px] px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">
                  {communityLink.kind}
                </span>
                <h3 className="font-bold text-sm mb-2 text-[hsl(var(--nav-theme-light))]">
                  <LinkedTitle linkData={moduleLinkMap[`lucidBlocksCrashFixAndTroubleshooting::links::${index}`]} locale={locale}>
                    {communityLink.label}
                  </LinkedTitle>
                </h3>
                <p className="text-xs text-muted-foreground">{communityLink.note}</p>
              </a>
            ))}
          </div>
          <div className="scroll-reveal p-6 bg-[hsl(var(--nav-theme)/0.06)] border border-[hsl(var(--nav-theme)/0.3)] rounded-xl">
            <h3 className="font-bold text-[hsl(var(--nav-theme-light))] mb-2">Anime Reversal Community Tracking Flow</h3>
            <p className="text-sm text-muted-foreground">
              Check Discord for alert speed, Roblox pages for official update visibility, and YouTube playlists for practical team adaptation after each patch cycle.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
          communityUrl={externalLinks.discord}
          gameUrl={externalLinks.gamePage}
        />
      </Suspense>

      {/* Ad Banner 3 */}
      <AdBanner type="banner-728x90" adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90} />

      {/* Footer */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">{t.footer.description}</p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href={externalLinks.discord}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.discord}
                  </a>
                </li>
                <li>
                  <a
                    href={externalLinks.youtubeChannel}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.twitter}
                  </a>
                </li>
                <li>
                  <a
                    href={externalLinks.robloxGroup}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamCommunity}
                  </a>
                </li>
                <li>
                  <a
                    href={externalLinks.gamePage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamStore}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">{t.footer.copyright}</p>
              <p className="text-xs text-muted-foreground">{t.footer.disclaimer}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
