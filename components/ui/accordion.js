"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const AccordionContext = React.createContext({
  openItem: null,
  toggleItem: () => {},
})

function Accordion({ children, type = "single", collapsible = true, className = "", defaultValue = null }) {
  const [openItem, setOpenItem] = React.useState(defaultValue)

  const toggleItem = React.useCallback((value) => {
    setOpenItem((prev) => (prev === value ? (collapsible ? null : prev) : value))
  }, [collapsible])

  return (
    <AccordionContext.Provider value={{ openItem, toggleItem }}>
      <div className={cn("w-full divide-y divide-[#155E78]/15", className)}>
        {children}
      </div>
    </AccordionContext.Provider>
  )
}

function AccordionItem({ value, className = "", children, ...props }) {
  return (
    <div className={cn("border-b border-[#155E78]/15 py-1", className)} {...props}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { itemValue: value })
        }
        return child;
      })}
    </div>
  )
}

function AccordionTrigger({ className = "", children, itemValue, ...props }) {
  const { openItem, toggleItem } = React.useContext(AccordionContext)
  const isOpen = openItem === itemValue

  return (
    <div className="flex">
      <button
        onClick={() => toggleItem(itemValue)}
        className={cn(
          "flex flex-1 items-center justify-between py-4 font-body font-semibold text-base md:text-lg transition-all hover:opacity-80 text-left gap-4 leading-snug",
          className
        )}
        style={{ color: 'var(--color-text)' }}
        {...props}
      >
        <span style={{ color: 'var(--color-text)' }} className="font-semibold text-text">{children}</span>
        <svg
          className={cn(
            "h-4 w-4 shrink-0 transition-transform duration-300",
            isOpen && "rotate-180"
          )}
          style={{ color: '#1D7E9E' }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
  )
}

function AccordionContent({ className = "", children, itemValue, ...props }) {
  const { openItem } = React.useContext(AccordionContext)
  const isOpen = openItem === itemValue

  if (!isOpen) return null

  return (
    <div
      className={cn(
        "overflow-hidden text-base font-body leading-relaxed pb-5 pt-1",
        className
      )}
      {...props}
    >
      <p 
        style={{ color: 'var(--color-text)' }} 
        className="text-text font-medium leading-relaxed text-sm md:text-base opacity-100"
      >
        {children}
      </p>
    </div>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
