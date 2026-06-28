"use client";

import * as React from "react";
import { CalendarIcon } from "lucide-react";
import moment from "moment";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";


interface BaseDatePickerProps {
  value: Date | string | null | undefined;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  formatString?: string;
  className?: string;
  disabled?: boolean;
}

export function BaseDatePicker({
  value,
  onChange,
  placeholder = "Select date",
  formatString = "DD MMM YYYY",
  className,
  disabled = false,
}: BaseDatePickerProps) {
  const [open, setOpen] = React.useState(false);

  const dateValue = value ? new Date(value) : undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          id="date"
          disabled={disabled}
          className={cn(
            "justify-between w-full font-normal text-left bg-input/50 hover:bg-input/50! aria-expanded:bg-input/50!",
            !value && "text-muted-foreground",
            className
          )}
        >
          {value ? moment(value).format(formatString) : placeholder}
          <CalendarIcon className={cn("h-4 w-4", disabled && "opacity-50")} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto overflow-hidden p-0" align="start">
        <Calendar
          mode="single"
          captionLayout="dropdown"
          selected={dateValue}
          onSelect={(date) => {
            onChange(date);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}