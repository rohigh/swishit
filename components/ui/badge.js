import * as React from "react"
import { cn } from "@/lib/utils"

function badgeVariants({ variant = "default", className = "" } = {}) {
  const base = "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold font-mono tracking-widest uppercase transition-colors"
  const variants = {
    default: "border-transparent bg-[#1A1A1A] text-white",
    secondary: "border-transparent bg-gray-200 text-[#1A1A1A]",
    destructive: "border-transparent bg-red-600 text-white",
    outline: "border-[#1A1A1A]/30 text-[#1A1A1A] bg-white/80",
  }
  return cn(base, variants[variant] || variants.default, className)
}

function Badge({ className, variant = "default", ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
