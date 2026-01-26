'use client'

import * as Tooltip from '@radix-ui/react-tooltip'
import { ReactNode } from 'react'
import { HelpIcon } from './HelpIcon'

interface HelpTooltipProps {
  children: ReactNode
  className?: string
}

export function HelpTooltip({ children, className }: HelpTooltipProps) {
  return (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button type="button" className={className}>
            <HelpIcon />
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            className="z-50 max-w-xs px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg"
            sideOffset={5}
          >
            {children}
            <Tooltip.Arrow className="fill-gray-900" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  )
}
