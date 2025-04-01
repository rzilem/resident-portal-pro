
import * as React from "react"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { SidebarProvider as SidebarContextProvider, useSidebar } from "./sidebar-context"
import { Sidebar as SidebarComponent } from "./sidebar-core"
import {
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarInput,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger
} from "./sidebar-controls"
import {
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel
} from "./sidebar-group"
import {
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton
} from "./sidebar-menu"
import {
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem
} from "./sidebar-submenu"

// Re-export everything
export {
  SidebarComponent as Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar
}

// Provide a wrapper with proper styling defaults
const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof SidebarContextProvider>
>(({ className, children, ...props }, ref) => {
  return (
    <SidebarContextProvider
      ref={ref}
      className={cn(
        "group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar",
        className
      )}
      {...props}
    >
      <TooltipProvider delayDuration={0}>
        {children}
      </TooltipProvider>
    </SidebarContextProvider>
  )
})
SidebarProvider.displayName = "SidebarProvider"

export { SidebarProvider }
