
import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    const handleCutPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      // Allow paste events to propagate normally
      console.log(`Input ${e.type} event`, props.id);
    };

    // Log when input receives focus and blur events
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      console.log(`Input ${e.type} event`, props.id);
      if (props.onFocus) props.onFocus(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      console.log(`Input ${e.type} event`, props.id);
      if (props.onBlur) props.onBlur(e);
    };

    // Monitor input events
    const handleInput = (e: React.FormEvent<HTMLInputElement>) => {
      console.log(`Input change event`, e.currentTarget.value);
    };

    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        onPaste={handleCutPaste}
        onCut={handleCutPaste}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onInput={handleInput}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
