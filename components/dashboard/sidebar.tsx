'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Brain, LayoutDashboard, ChevronDown, ChevronRight, Settings, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { MCAT_SECTIONS } from '@/lib/mcat-taxonomy'
import { createClient } from '@/lib/supabase/client'

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())

  function toggleSection(id: string) {
    setExpandedSections((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col h-screen sticky top-0">
      <div className="p-5 border-b border-border flex items-center gap-2">
        <Brain className="h-6 w-6 text-primary" />
        <span className="font-bold text-foreground">MCAT Forge</span>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-1">
        <Link
          href="/dashboard"
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
            pathname === '/dashboard'
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
          )}
        >
          <LayoutDashboard className="h-4 w-4" />
          Dashboard
        </Link>

        <div className="mt-4 mb-1 px-3">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            MCAT Sections
          </p>
        </div>

        {MCAT_SECTIONS.map((section) => {
          const isExpanded = expandedSections.has(section.id)
          const isSectionActive = pathname.includes(`/study/${section.id}`)

          return (
            <div key={section.id}>
              <button
                onClick={() => toggleSection(section.id)}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isSectionActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                )}
              >
                <span>{section.shortName}</span>
                {isExpanded ? (
                  <ChevronDown className="h-3.5 w-3.5" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5" />
                )}
              </button>

              {isExpanded && (
                <div className="ml-3 mt-1 flex flex-col gap-0.5 border-l border-border pl-3">
                  {section.subsections.map((sub) => {
                    const isActive = pathname === `/study/${section.id}/${sub.id}`
                    return (
                      <Link
                        key={sub.id}
                        href={`/study/${section.id}/${sub.id}`}
                        className={cn(
                          'px-2 py-1.5 rounded-md text-xs transition-colors',
                          isActive
                            ? 'bg-primary/10 text-primary font-medium'
                            : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                        )}
                      >
                        {sub.name}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border flex flex-col gap-1">
        <Link
          href="/settings"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors w-full text-left"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
