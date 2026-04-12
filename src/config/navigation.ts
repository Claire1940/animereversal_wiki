import type { LucideIcon } from 'lucide-react'
import {
	BookOpen,
	Gift,
	Users,
	Package,
	Sparkles,
	TrendingUp,
	Library,
	TerminalSquare,
	BarChart3,
	Trophy,
	Bell,
} from 'lucide-react'

export interface NavigationItem {
	key: string // 用于翻译键，如 'codes' -> t('nav.codes')
	path: string // URL 路径，如 '/codes'
	icon: LucideIcon // Lucide 图标组件
	isContentType: boolean // 是否对应 content/ 目录
}

export const NAVIGATION_CONFIG: NavigationItem[] = [
	{
		key: 'codes',
		path: '/codes',
		icon: Gift,
		isContentType: true,
	},
	{
		key: 'guide',
		path: '/guide',
		icon: BookOpen,
		isContentType: true,
	},
	{
		key: 'units',
		path: '/units',
		icon: Users,
		isContentType: true,
	},
	{
		key: 'items',
		path: '/items',
		icon: Package,
		isContentType: true,
	},
	{
		key: 'traits',
		path: '/traits',
		icon: Sparkles,
		isContentType: true,
	},
	{
		key: 'evolution',
		path: '/evolution',
		icon: TrendingUp,
		isContentType: true,
	},
	{
		key: 'resources',
		path: '/resources',
		icon: Library,
		isContentType: true,
	},
	{
		key: 'script',
		path: '/script',
		icon: TerminalSquare,
		isContentType: true,
	},
	{
		key: 'tier',
		path: '/tier',
		icon: BarChart3,
		isContentType: true,
	},
	{
		key: 'tierList',
		path: '/tier-list',
		icon: Trophy,
		isContentType: true,
	},
	{
		key: 'updates',
		path: '/updates',
		icon: Bell,
		isContentType: true,
	},
]

// 从配置派生内容类型列表（用于路由和内容加载）
export const CONTENT_TYPES = NAVIGATION_CONFIG.filter((item) => item.isContentType).map(
	(item) => item.path.slice(1),
) // 移除开头的 '/'

export type ContentType = (typeof CONTENT_TYPES)[number]

// 辅助函数：验证内容类型
export function isValidContentType(type: string): type is ContentType {
	return CONTENT_TYPES.includes(type as ContentType)
}
