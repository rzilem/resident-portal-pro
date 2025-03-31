
# Tooltip Implementation Guidelines

This document outlines the standard approach for implementing tooltips on buttons and interactive elements throughout the application.

## Basic Implementation

For all buttons in the application, follow this pattern:

```tsx
<TooltipProvider delayDuration={300}>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button onClick={handleAction}>
        <Icon className="h-4 w-4" />
        Button Text
      </Button>
    </TooltipTrigger>
    <TooltipContent side="top" className="z-50">
      <p>Descriptive tooltip text</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

## Key Requirements

1. **Always use TooltipProvider**: Wrap every tooltip in a `TooltipProvider` with `delayDuration={300}`.
2. **Use asChild prop**: Always use `asChild` on `TooltipTrigger` to properly forward props.
3. **Set z-index**: Add `className="z-50"` to `TooltipContent` to ensure tooltips aren't hidden by other elements.
4. **Specify side**: Use `side="top"` (or other directions as appropriate) for `TooltipContent`.
5. **Keep text concise**: Tooltip text should be brief and describe the action.

## Using the TooltipButton Component

For simpler implementation, use the `TooltipButton` component:

```tsx
<TooltipButton
  tooltipText="Descriptive text here"
  onClick={handleAction}
  variant="default"
>
  <Icon className="h-4 w-4 mr-2" />
  Button Text
</TooltipButton>
```

## Implementation Checklist

- [ ] All buttons have tooltips
- [ ] Tooltips have descriptive text
- [ ] TooltipProvider has delayDuration set
- [ ] TooltipContent has z-50 class
- [ ] TooltipContent has appropriate side property
