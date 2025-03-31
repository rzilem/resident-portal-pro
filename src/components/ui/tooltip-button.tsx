
import * as React from "react"
import { Button, ButtonProps } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface TooltipButtonProps extends ButtonProps {
  tooltipText: string
  tooltipSide?: "top" | "right" | "bottom" | "left"
  tooltipAlign?: "start" | "center" | "end"
}

const TooltipButton = React.forwardRef<HTMLButtonElement, TooltipButtonProps>(
  ({ tooltipText, tooltipSide = "top", tooltipAlign = "center", children, ...props }, ref) => {
    return (
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button ref={ref} {...props}>
              {children}
            </Button>
          </TooltipTrigger>
          <TooltipContent side={tooltipSide} align={tooltipAlign} className="z-50">
            <p>{tooltipText}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }
)
TooltipButton.displayName = "TooltipButton"

export { TooltipButton }
