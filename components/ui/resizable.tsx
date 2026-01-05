'use client'

import * as React from 'react'
import { GripVerticalIcon } from 'lucide-react'
import * as ResizablePrimitive from 'react-resizable-panels'

import { cn } from '@/lib/utils'

/* ----------------------------- Panel Group ----------------------------- */
const ResizablePanelGroup = React.forwardRef<
  React.ElementRef<typeof ResizablePrimitive.PanelGroup>,
  React.ComponentPropsWithoutRef<typeof ResizablePrimitive.PanelGroup>
>(({ className, ...props }, ref) => (
  <ResizablePrimitive.PanelGroup
    ref={ref}
    className={cn(
      'flex h-full w-full data-[panel-group-direction=vertical]:flex-col',
      className
    )}
    {...props}
  />
))
ResizablePanelGroup.displayName = 'ResizablePanelGroup'

/* -------------------------------- Panel -------------------------------- */
const ResizablePanel = React.forwardRef<
  React.ElementRef<typeof ResizablePrimitive.Panel>,
  React.ComponentPropsWithoutRef<typeof ResizablePrimitive.Panel>
>((props, ref) => (
  <ResizablePrimitive.Panel ref={ref} {...props} />
))
ResizablePanel.displayName = 'ResizablePanel'

/* --------------------------- Resize Handle ----------------------------- */
const ResizableHandle = React.forwardRef<
  React.ElementRef<typeof ResizablePrimitive.PanelResizeHandle>,
  React.ComponentPropsWithoutRef<
    typeof ResizablePrimitive.PanelResizeHandle
  > & {
    withHandle?: boolean
  }
>(({ className, withHandle = false, ...props }, ref) => (
  <ResizablePrimitive.PanelResizeHandle
    ref={ref}
    className={cn(
      'relative flex w-px items-center justify-center bg-border focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full',
      className
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-background">
        <GripVerticalIcon className="h-2.5 w-2.5" />
      </div>
    )}
  </ResizablePrimitive.PanelResizeHandle>
))
ResizableHandle.displayName = 'ResizableHandle'

export {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle
}
