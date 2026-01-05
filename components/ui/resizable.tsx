"use client"

import * as React from "react"
import { GripVerticalIcon } from "lucide-react"
import { Group, Panel, Separator } from "react-resizable-panels"

import { cn } from "@/lib/utils"

/**
 * This wrapper keeps the same API that shadcn/ui uses:
 * - ResizablePanelGroup (accepts `direction`)
 * - ResizablePanel
 * - ResizableHandle (with optional `withHandle`)
 *
 * Under the hood it uses react-resizable-panels v4.x:
 * - Group / Panel / Separator
 */

type ResizablePanelGroupProps = React.ComponentPropsWithoutRef<typeof Group> & {
  direction?: "horizontal" | "vertical"
}

const ResizablePanelGroup = React.forwardRef<HTMLDivElement, ResizablePanelGroupProps>(
  ({ className, direction = "horizontal", orientation, elementRef, ...props }, ref) => {
    return (
      <Group
        {...props}
        orientation={orientation ?? direction}
        className={cn("flex h-full w-full", className)}
        elementRef={(ref ?? elementRef) as any}
      />
    )
  }
)
ResizablePanelGroup.displayName = "ResizablePanelGroup"

type ResizablePanelProps = React.ComponentPropsWithoutRef<typeof Panel>

const ResizablePanel = React.forwardRef<HTMLDivElement, ResizablePanelProps>(
  ({ className, elementRef, ...props }, ref) => {
    return <Panel {...props} className={className} elementRef={(ref ?? elementRef) as any} />
  }
)
ResizablePanel.displayName = "ResizablePanel"

type ResizableHandleProps = React.ComponentPropsWithoutRef<typeof Separator> & {
  withHandle?: boolean
}

const ResizableHandle = React.forwardRef<HTMLDivElement, ResizableHandleProps>(
  ({ className, withHandle, elementRef, ...props }, ref) => {
    return (
      <Separator
        {...props}
        elementRef={(ref ?? elementRef) as any}
        className={cn(
          // default: vertical separator for horizontal groups
          "relative flex w-px h-full items-center justify-center bg-border",
          // if the separator is horizontal (group is vertical), swap sizes
          "aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full",
          // make it easier to grab
          "data-[separator]:cursor-col-resize aria-[orientation=horizontal]:data-[separator]:cursor-row-resize",
          className
        )}
      >
        {withHandle ? (
          <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-background">
            <GripVerticalIcon className="h-2.5 w-2.5" />
          </div>
        ) : null}
      </Separator>
    )
  }
)
ResizableHandle.displayName = "ResizableHandle"

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
