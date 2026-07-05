import React, { useEffect, useState, useMemo } from 'react'
import { useTimezoneSelect, allTimezones } from 'react-timezone-select'
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverAnchor,
} from "@/components/ui/popover"

interface TimezoneDropdownProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

export function TimezoneDropdown({ value, onChange, className }: TimezoneDropdownProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { options } = useTimezoneSelect({ labelStyle: 'original', timezones: allTimezones })

  useEffect(() => {
    if (!value) {
      const systemTz = Intl.DateTimeFormat().resolvedOptions().timeZone
      const cityName = systemTz.split('/').pop()?.replace('_', ' ')
      
      const matchedOption = options.find((opt) => {
        const valueMatch = opt.value === systemTz
        const labelMatch = cityName ? opt.label.includes(cityName) : false
        return valueMatch || labelMatch
      })

      onChange(matchedOption?.value || "UTC")
    }
  }, [value, options, onChange])

  const activeLabel = useMemo(() => {
    return options.find((tz) => tz.value === value)?.label || ""
  }, [value, options])

  useEffect(() => {
    setSearchQuery(activeLabel)
  }, [activeLabel])

  const filteredOptions = useMemo(() => {
    if (!searchQuery || searchQuery === activeLabel) return options
    return options.filter((tz) => 
      tz.label.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery, options, activeLabel])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverAnchor asChild>
        <div className={cn("relative w-full", className)}>
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setOpen(true)
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 200)} 
            placeholder="Search timezone..."
            className="pr-10 cursor-text w-full"
          />
          <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none opacity-50" />
        </div>
      </PopoverAnchor>

      <PopoverContent 
        className="w-[var(--radix-popover-trigger-width)] p-1 max-h-[250px] overflow-y-auto gap-0"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {filteredOptions.length === 0 ? (
          <div className="py-2 px-3 text-sm text-muted-foreground text-center">
            No timezone found.
          </div>
        ) : (
          filteredOptions.map((tz) => (
            <div
              key={tz.value}
              onMouseDown={(e) => {
                e.preventDefault()
                onChange(tz.value)
                setOpen(false)
              }}
              className={cn(
                "flex items-center justify-between px-3 py-2 text-sm rounded-sm cursor-pointer hover:bg-accent hover:text-accent-foreground select-none",
                value === tz.value && "bg-accent/50 font-medium"
              )}
            >
              <span>{tz.label}</span>
              {value === tz.value && <Check className="h-4 w-4 shrink-0 ml-2" />}
            </div>
          ))
        )}
      </PopoverContent>
    </Popover>
  )
}