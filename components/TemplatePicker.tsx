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
  dark?: boolean
}[] = [
  { id: 'xalimart-white-v2', name: 'Xalimart White V2', tagline: 'Compact 550px · White body' },
  { id: 'xalimart-black-v2', name: 'Xalimart Black V2', tagline: 'Compact 550px · Black body', dark: true },
]

export default function TemplatePicker({ data, onChange }: Props) {
  return (
    <div className="max-w-6xl mx-auto px-6 pt-6 pb-2">
      <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest mb-3">
        Choose Template
      </p>
      {/* Mobile: horizontal scroll strip — sm+: grid */}
      <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 overflow-x-auto pb-1 sm:overflow-x-visible sm:pb-0 snap-x snap-mandatory">
        {TEMPLATES.map(({ id, name, tagline, dark }) => {
          const active = data.templateId === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange({ ...data, templateId: id })}
              className={cn(
                'flex flex-col items-start p-4 rounded-xl border-2 text-left',
                'transition-all hover:shadow-sm cursor-pointer snap-start',
                'flex-shrink-0 w-36 sm:w-auto',
                dark ? 'bg-zinc-900' : 'bg-white',
                active
                  ? 'border-black shadow-sm shadow-zinc-200'
                  : 'border-gray-100 hover:border-gray-300'
              )}
            >
              <span className={cn('text-sm font-semibold leading-tight', dark ? 'text-white' : active ? 'text-black' : 'text-gray-800')}>
                {name}
              </span>
              <span className={cn('text-[11px] mt-0.5 leading-tight', dark ? 'text-zinc-400' : 'text-gray-400')}>
                {tagline}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
