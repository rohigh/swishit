import * as React from "react"
import { cn } from "@/lib/utils"

function buttonVariants({ variant = "default", size = "default", className = "" } = {}) {
  const base = "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
  
  const variants = {
    default: "bg-[#1A1A1A] text-white hover:bg-black",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-[#1A1A1A]/30 bg-white/80 text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white shadow-sm",
    secondary: "bg-gray-200 text-[#1A1A1A] hover:bg-gray-300",
    ghost: "hover:bg-black/5 text-[#1A1A1A]",
    link: "text-[#1A1A1A] underline-offset-4 hover:underline",
  }

  const sizes = {
    default: "h-11 px-6 py-2.5",
    sm: "h-9 rounded-full px-4 text-xs",
    lg: "h-12 rounded-full px-8 text-base",
    icon: "h-10 w-10",
  }

  return cn(base, variants[variant] || variants.default, sizes[size] || sizes.default, className)
}

const Button = React.forwardRef(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    return (
      <button
        className={buttonVariants({ variant, size, className })}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
