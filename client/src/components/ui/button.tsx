import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils.js"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg text-xs font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7285d5] disabled:pointer-events-none disabled:opacity-50 cursor-pointer btn-press select-none",
  {
    variants: {
      variant: {
        default:
          "bg-white text-[#333641] border border-[#e9e8e6] shadow-[0_1px_2px_rgba(0,0,0,0.03)] hover:bg-[#fbfaf8] hover:border-[#dedcd8]",
        primary:
          "bg-[#7285d5] text-white shadow-[0_1px_3px_rgba(114,133,213,0.25)] hover:bg-[#6074ca]",
        subtle:
          "text-[#5a5c66] bg-transparent hover:bg-[#eeeffa] hover:text-[#333641]",
        ghost:
          "text-[#6c6e79] bg-transparent hover:bg-[#f0eee9] hover:text-[#333641]",
        destructive:
          "bg-[#d9756c] text-white hover:bg-[#c6655c] shadow-[0_1px_2px_rgba(217,117,108,0.2)]",
        danger:
          "bg-[#d9756c] text-white hover:bg-[#c6655c] shadow-[0_1px_2px_rgba(217,117,108,0.2)]",
        outline:
          "border border-[#e9e8e6] bg-transparent text-[#333641] hover:bg-[#f8f7f4]",
        secondary:
          "bg-[#f0eee9] text-[#333641] hover:bg-[#e6e4de]",
        link:
          "text-[#7285d5] underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        default: "h-8 px-3 py-1.5",
        sm: "h-7 rounded-md px-2.5 text-[11px]",
        lg: "h-9 rounded-lg px-4 text-sm",
        icon: "h-8 w-8",
        xs: "h-6 rounded px-2 text-[10px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin mr-1 inline-block" />
        )}
        {children}
      </button>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
