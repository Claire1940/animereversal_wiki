import { getAllContent, CONTENT_TYPES } from '@/lib/content'
import type { Language, ContentItem } from '@/lib/content'

export interface ArticleLink {
  url: string
  title: string
}

export type ModuleLinkMap = Record<string, ArticleLink | null>

interface ArticleWithType extends ContentItem {
  contentType: string
}

// Module sub-field mapping: moduleKey -> { field, nameKey }
const MODULE_FIELDS: Record<string, { field: string; nameKey: string }> = {
  lucidBlocksBeginnerGuide: { field: 'steps', nameKey: 'title' },
  lucidBlocksApotheosisCrafting: { field: 'cards', nameKey: 'name' },
  lucidBlocksToolsAndWeapons: { field: 'items', nameKey: 'name' },
  lucidBlocksStorageAndInventory: { field: 'solutions', nameKey: 'name' },
  lucidBlocksQualiaAndBaseBuilding: { field: 'cards', nameKey: 'name' },
  lucidBlocksWorldRegions: { field: 'regions', nameKey: 'name' },
  lucidBlocksCreaturesAndEnemies: { field: 'creatures', nameKey: 'name' },
  lucidBlocksMobilityGear: { field: 'items', nameKey: 'name' },
  lucidBlocksFarmingAndGrowth: { field: 'sections', nameKey: 'name' },
  lucidBlocksBestEarlyUnlocks: { field: 'priorities', nameKey: 'name' },
  lucidBlocksAchievementTracker: { field: 'groups', nameKey: 'name' },
  lucidBlocksSingleplayerAndPlatformFAQ: { field: 'faqs', nameKey: 'question' },
  lucidBlocksSteamDeckAndController: { field: 'cards', nameKey: 'name' },
  lucidBlocksSettingsAndAccessibility: { field: 'stages', nameKey: 'stage' },
  lucidBlocksUpdatesAndPatchNotes: { field: 'cards', nameKey: 'name' },
  lucidBlocksCrashFixAndTroubleshooting: { field: 'links', nameKey: 'label' },
}

// Extra semantic keywords per module to boost matching for h2 titles
// These supplement the module title text when matching against articles
const MODULE_EXTRA_KEYWORDS: Record<string, string[]> = {
  lucidBlocksBeginnerGuide: ['codes', 'update3', 'tokyo', 'rerolls', 'gems', 'expired'],
  lucidBlocksApotheosisCrafting: ['tier list', 's tier', 'ground dps', 'control support', 'speedceo', 'meta'],
  lucidBlocksToolsAndWeapons: ['beginner guide', 'early pulls', 'ground dps', 'farm slot', 'first evolution', 'checklist'],
  lucidBlocksStorageAndInventory: ['units', 'redhair awaken', 'ruda fist', 'kirita dual', 'song woo', 'igres'],
  lucidBlocksQualiaAndBaseBuilding: ['traits', 'mandra', 'elite', 'zodiac', 'spa booster', 'trait rerolls'],
  lucidBlocksWorldRegions: ['evolutions', 'haki hat', 'traveller npc', 'ragnarok portals', 'hu tao', 'qin sha'],
  lucidBlocksCreaturesAndEnemies: ['secret units', 'hu tao', 'yoji modula', 'qinsha emperor', 'quest chain', 'elite secret'],
  lucidBlocksMobilityGear: ['raids', 'cid raid', 'jjk portal', 'ragnarok', 'stall control', 'economy opening'],
  lucidBlocksFarmingAndGrowth: ['best units', 'ss unit', 'ground damage', 'redhair awaken', 'ruda fist', 'icequeen'],
  lucidBlocksBestEarlyUnlocks: ['update notes', 'update 3', 'update 2.5', 'patch cycle', '2026-04-07', '2026-03-27'],
  lucidBlocksAchievementTracker: ['trait rerolls', 'code funnel', 'mythic traits', 'fallback traits', 'unit value', 'reroll stock'],
  lucidBlocksSingleplayerAndPlatformFAQ: ['gems guide', 'spending ladder', 'summons', 'redhair awaken', 'trait optimization', 'save gems'],
  lucidBlocksSteamDeckAndController: ['summon banners', 'currency flow', 'early banner targets', 'long-run targets', 'watchlist', 'low-priority pulls'],
  lucidBlocksSettingsAndAccessibility: ['story mode', 'early story', 'mid story', 'boss maps', 'late story push', 'farm slot'],
  lucidBlocksUpdatesAndPatchNotes: ['infinite mode', 'wave 1-20', 'wave 21-60', 'wave 60+', 'economy slot', 'boss plan'],
  lucidBlocksCrashFixAndTroubleshooting: ['community links', 'discord', 'roblox group', 'watchpixel', 'youtube', 'trailer'],
}

const FILLER_WORDS = ['anime', 'reversal', '2026', '2025', 'complete', 'the', 'and', 'for', 'how', 'with', 'our', 'this', 'your', 'all', 'from', 'learn', 'master']

function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function getSignificantTokens(text: string): string[] {
  return normalize(text)
    .split(' ')
    .filter(w => w.length > 2 && !FILLER_WORDS.includes(w))
}

function matchScore(queryText: string, article: ArticleWithType, extraKeywords?: string[]): number {
  const normalizedQuery = normalize(queryText)
  const normalizedTitle = normalize(article.frontmatter.title)
  const normalizedDesc = normalize(article.frontmatter.description || '')
  const normalizedSlug = article.slug.replace(/-/g, ' ').toLowerCase()

  let score = 0

  // Exact phrase match in title (stripped of "Anime Reversal")
  const strippedQuery = normalizedQuery.replace(/anime reversal\s*/g, '').trim()
  const strippedTitle = normalizedTitle.replace(/anime reversal\s*/g, '').trim()
  if (strippedQuery.length > 3 && strippedTitle.includes(strippedQuery)) {
    score += 100
  }

  // Token overlap from query text
  const queryTokens = getSignificantTokens(queryText)
  for (const token of queryTokens) {
    if (normalizedTitle.includes(token)) score += 20
    if (normalizedDesc.includes(token)) score += 5
    if (normalizedSlug.includes(token)) score += 15
  }

  // Extra keywords scoring (for module h2 titles)
  if (extraKeywords) {
    for (const kw of extraKeywords) {
      const normalizedKw = normalize(kw)
      if (normalizedTitle.includes(normalizedKw)) score += 15
      if (normalizedDesc.includes(normalizedKw)) score += 5
      if (normalizedSlug.includes(normalizedKw)) score += 10
    }
  }

  return score
}

function findBestMatch(
  queryText: string,
  articles: ArticleWithType[],
  extraKeywords?: string[],
  threshold = 20,
): ArticleLink | null {
  let bestScore = 0
  let bestArticle: ArticleWithType | null = null

  for (const article of articles) {
    const score = matchScore(queryText, article, extraKeywords)
    if (score > bestScore) {
      bestScore = score
      bestArticle = article
    }
  }

  if (bestScore >= threshold && bestArticle) {
    return {
      url: `/${bestArticle.contentType}/${bestArticle.slug}`,
      title: bestArticle.frontmatter.title,
    }
  }

  return null
}

export async function buildModuleLinkMap(locale: Language): Promise<ModuleLinkMap> {
  // 1. Load all articles across all content types
  const allArticles: ArticleWithType[] = []
  for (const contentType of CONTENT_TYPES) {
    const items = await getAllContent(contentType, locale)
    for (const item of items) {
      allArticles.push({ ...item, contentType })
    }
  }

  // 2. Load module data from en.json (use English for keyword matching)
  const enMessages = (await import('../locales/en.json')).default as any

  const linkMap: ModuleLinkMap = {}

  // 3. For each module, match h2 title and sub-items
  for (const [moduleKey, fieldConfig] of Object.entries(MODULE_FIELDS)) {
    const moduleData = enMessages.modules?.[moduleKey]
    if (!moduleData) continue

    // Match module h2 title (use extra keywords + lower threshold for broader matching)
    const moduleTitle = moduleData.title as string
    if (moduleTitle) {
      const extraKw = MODULE_EXTRA_KEYWORDS[moduleKey] || []
      linkMap[moduleKey] = findBestMatch(moduleTitle, allArticles, extraKw, 15)
    }

    // Match sub-items
    const subItems = moduleData[fieldConfig.field] as any[]
    if (Array.isArray(subItems)) {
      for (let i = 0; i < subItems.length; i++) {
        const itemName = subItems[i]?.[fieldConfig.nameKey] as string
        if (itemName) {
          const key = `${moduleKey}::${fieldConfig.field}::${i}`
          linkMap[key] = findBestMatch(itemName, allArticles)
        }
      }
    }
  }

  return linkMap
}
