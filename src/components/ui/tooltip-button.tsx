
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface TooltipButtonProps extends ButtonProps {
  tooltipText: string;
  tooltipSide?: 'top' | 'right' | 'bottom' | 'left';
  tooltipAlign?: 'start' | 'center' | 'end';
  tooltipDelayDuration?: number;
  disabled?: boolean;
}

export const TooltipButton = React.forwardRef<HTMLButtonElement, TooltipButtonProps>(
  ({ tooltipText, tooltipSide = 'top', tooltipAlign = 'center', tooltipDelayDuration = 300, children, disabled = false, ...props }, ref) => {
    return (
      <TooltipProvider delayDuration={tooltipDelayDuration}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button ref={ref} {...props} disabled={disabled}>
              {children}
            </Button>
          </TooltipTrigger>
          <TooltipContent side={tooltipSide} align={tooltipAlign} className="z-50">
            <p>{tooltipText}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
);

TooltipButton.displayName = 'TooltipButton';
