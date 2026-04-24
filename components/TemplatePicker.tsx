'use client'

import { cn } from '@/lib/utils'
import type { SignatureData } from '@/types/signature'

interface Props {
  data: SignatureData
  onChange: (data: SignatureData) => void
}

const TEMPLATES: {
  id: SignatureData['templateId']
  name: string
  tagline: string
  description?: string
  dark?: boolean
  hidden?: boolean
}[] = [
  { 
    id: 'xalimart-white-v2', 
    name: 'Xalimart White V2', 
    tagline: 'Standard Modern',
    description: 'Best for Gmail & Apple Mail. Clean and optimized for modern email apps.',
    hidden: true
  },
  { 
    id: 'xalimart-white-v3', 
    name: 'Xalimart White V3', 
    tagline: 'Outlook Specialized',
    description: 'Use this if you use Microsoft Outlook. Fixed spacing and layout safety.',
  },
  { 
    id: 'xalimart-black-v2', 
    name: 'Xalimart Black V2', 
    tagline: 'Standard Modern',
    description: 'Premium dark style. Best for Gmail & Apple Mail apps.',
    dark: true,
    hidden: true
  },
  { 
    id: 'xalimart-black-v3', 
    name: 'Xalimart Black V3', 
    tagline: 'Outlook Specialized',
    description: 'Premium dark style. Fixed spacing specifically for Microsoft Outlook.',
    dark: true 
  },
]

export default function TemplatePicker({ data, onChange }: Props) {
  return (
    <div className="max-w-6xl mx-auto px-6 pt-6 pb-2">
      <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest mb-3">
        Choose Template
      </p>
      {/* Mobile: horizontal scroll strip — sm+: grid */}
      <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 overflow-x-auto pb-1 sm:overflow-x-visible sm:pb-0 snap-x snap-mandatory">
        {TEMPLATES.filter(t => !t.hidden).map(({ id, name, tagline, description, dark }) => {
          const active = data.templateId === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange({ ...data, templateId: id })}
              className={cn(
                'flex flex-col items-start p-4 rounded-xl border-2 text-left h-full',
                'transition-all hover:shadow-sm cursor-pointer snap-start',
                'flex-shrink-0 w-48 sm:w-auto',
                dark ? 'bg-zinc-900' : 'bg-white',
                active
                  ? 'border-black shadow-sm shadow-zinc-200'
                  : 'border-gray-100 hover:border-gray-300'
              )}
            >
              <span className={cn('text-sm font-semibold leading-tight', dark ? 'text-white' : active ? 'text-black' : 'text-gray-800')}>
                {name}
              </span>
              <span className={cn('text-[11px] font-medium mt-0.5 leading-tight', dark ? 'text-zinc-300' : 'text-zinc-600')}>
                {tagline}
              </span>
              {description && (
                <span className={cn('text-[10px] mt-2 leading-relaxed opacity-80', dark ? 'text-zinc-400' : 'text-gray-500')}>
                  {description}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
