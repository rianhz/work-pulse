import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip"
import { Spinner } from "@/components/ui/spinner" 
import { Slottable } from "@radix-ui/react-slot"
import { MorphIcon, type IconInput } from "morphicons/react"

export type ButtonProps =
  React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    tooltip?: React.ReactNode
    tooltipSide?: "top" | "right" | "bottom" | "left"
    icon?: IconInput | React.ComponentType<{ className?: string }> | React.ReactNode 
    iconPosition?: "left" | "right"
    iconClassName?: string
    enableIconTransition?: boolean
    loading?: boolean
  }

const buttonVariants = cva(
  "group/button cursor-pointer inline-flex shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        outline:
          "border-border hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:bg-transparent dark:hover:bg-input/30",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-muted aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-8 gap-1 px-3 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5",
        xs: "h-6 gap-1 px-2.5 text-xs has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 px-3 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        lg: "h-9 gap-1 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        icon: "size-8",
        "icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  tooltip,
  tooltipSide = "top",
  icon: IconProp,
  iconPosition = "left",
  iconClassName,
  enableIconTransition = false,
  loading = false,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button"

  // Helper to construct transition/sizing classes for icons
  const computedIconClass = cn(
    "size-4 shrink-0",
    enableIconTransition ? "transition-transform duration-300" : "transition-none",
    enableIconTransition && iconPosition === "left",
    enableIconTransition && iconPosition === "right",
    iconClassName
  )

  // Helper to determine if an icon is valid MorphIcon input (path array or MorphIcon object)
  const isMorphIconInput = (icon: unknown): icon is IconInput => {
    if (!icon) return false;
    if (Array.isArray(icon)) return true; // Tuple path arrays from "lucide"
    if (typeof icon === "object" && icon !== null && "paths" in icon) return true; // MorphIcon objects
    return false;
  };

  const renderVisual = loading ? (
    <Spinner className="animate-spin" />
  ) : IconProp ? (
    isMorphIconInput(IconProp) ? (
      <MorphIcon icon={IconProp} className={computedIconClass} />
    ) : React.isValidElement(IconProp) ? (
      IconProp
    ) : typeof IconProp === "function" ? (
      React.createElement(IconProp as React.ComponentType<{ className?: string }>, {
        className: computedIconClass,
      })
    ) : null
  ) : null;

  const button = (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      disabled={disabled || loading}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {renderVisual && iconPosition === "left" && renderVisual}
      <Slottable>{children}</Slottable>
      {renderVisual && iconPosition === "right" && renderVisual}
    </Comp>
  )

  if (!tooltip) {
    return button
  }

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          {button}
        </TooltipTrigger>

        <TooltipContent side={tooltipSide}>
          {tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export { Button, buttonVariants }