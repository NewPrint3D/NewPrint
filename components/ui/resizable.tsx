'use client'

import * as React from 'react'
import { GripVerticalIcon } from 'lucide-react'
import {
  PanelGroup,
  Panel,
  PanelResizeHandle,
} from 'react-resizable-panels'

import { cn } from '@/lib/utils'

/* ================================
   Panel Group
================================ */

const ResizablePanelGroup = ({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof PanelGroup>) => {
  return (
    <PanelGroup
      className={cn(
        'flex h-full w-full data-[panel-group-direction=vertical]:flex-col',
        className
      )}
      {...props}
    />
  )
}

/* ================================
   Panel
================================ */

const ResizablePanel = (
  props: React.ComponentPropsWithoutRef<typeof Panel>
) => {
  return <Panel {...props} />
}

/* ================================
   Resize Handle
================================ */

const ResizableHandle = ({
  withHandle,
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof PanelResizeHandle> & {
  withHandle?: boolean
}) => {
  return (
    <PanelResizeHandle
      className={cn(
        'relative flex w-px items-center justify-center bg-border focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
        className
      )}
      {...props}
    >
      {withHandle && (
        <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-background">
          <GripVerticalIcon className="h-2.5 w-2.5" />
        </div>
      )}
    </PanelResizeHandle>
  )
}

export {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
}
