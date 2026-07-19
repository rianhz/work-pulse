"use client";

import { Activity, MouseEvent, useEffect, useRef, useState } from "react";
import { X, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Command, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";

export interface GenericItem extends Record<string, any> {
  _id: string;
}

interface GenericMultiSelectProps<T extends GenericItem> {
  selectedItems: T[];
  onChange: (items: T[]) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  itemsList: T[];
  displayKey: keyof T;
  placeholder?: string;
  searchPlaceholder?: string;
  isLoading?: boolean;
  isError?: boolean;
  isFetched?: boolean;
  id: string;
}

export function GenericMultiSelect<T extends GenericItem>({
  id,
  selectedItems = [],
  onChange,
  searchQuery,
  onSearchChange,
  itemsList = [],
  displayKey,
  placeholder = "Select items...",
  isLoading = false,
  isError = false,
  isFetched = false,
}: GenericMultiSelectProps<T>) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [localLoading, setLocalLoading] = useState(false);

  const handleSearchChange = (query: string) => {
    setOpen(true);
    setLocalLoading(true);
    onSearchChange(query);
  };

  useEffect(() => {
    if (isFetched) {
      setLocalLoading(false);
    }
  }, [isFetched]);

  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleUnselect = (itemToRemove: T, e: MouseEvent) => {
    e.stopPropagation();
    onChange(selectedItems.filter((item) => item._id !== itemToRemove._id));
  };

  const handleSelect = (item: T) => {
    const isAlreadySelected = selectedItems.some((s) => s._id === item._id);
    if (isAlreadySelected) {
      onChange(selectedItems.filter((s) => s._id !== item._id));
    } else {
      onChange([...selectedItems, item]);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
            <Input
              id={id}
              ref={inputRef}
              type="text"
              placeholder={placeholder}
              value={searchQuery}
              onChange={(e) => {
                handleSearchChange(e.target.value);
              }}
            />
        </PopoverTrigger>

        <PopoverContent 
          className={`w-[var(--radix-popover-trigger-width)] p-0 ring-0 border-none outline-none focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 ${searchQuery.length === 0  && 'hidden'}`} 
          align="start" 
          onOpenAutoFocus={(e) => e.preventDefault()}
          >
            <Command shouldFilter={false} className="w-full p-1">
              <CommandList>
                <Activity mode={(localLoading || isLoading) && searchQuery.length > 0 ? "visible" : "hidden"}>
                  <div className="flex justify-center items-center py-4">
                    <Spinner className="size-4" />
                  </div>
                </Activity>

                <Activity mode={!localLoading && !isLoading && !isError && searchQuery.length > 0 ? "visible" : "hidden"}>
                  <Activity mode={itemsList.length === 0 ? "visible" : "hidden"}>
                    <div className="text-center py-3 text-xs text-muted-foreground">
                      No records found.
                    </div>
                  </Activity>

                  {itemsList.map((item,index) => {
                    const isSelected = selectedItems.some((s) => s._id === item._id);
                    return (
                      <CommandItem
                        key={index}
                        value={`${item._id}-${String(item[displayKey])}`}
                        onSelect={() => handleSelect(item)}
                        className="flex items-center justify-between cursor-pointer py-2 px-3 rounded-sm"
                      >
                        <span className="text-sm">{String(item[displayKey])}</span>
                        <Activity mode={isSelected ? "visible" : "hidden"}>
                          <Check className="size-4 text-primary" />
                        </Activity>
                      </CommandItem>
                    );
                  })}
                </Activity>

                <Activity mode={isError ? "visible" : "hidden"}>
                  <div className="text-center py-3 text-xs text-destructive">
                    Failed to load data.
                  </div>
                </Activity>
              </CommandList>
            </Command>
        </PopoverContent>
      </Popover>

      <div className="flex flex-wrap gap-1 max-w-[90%]">
        <Activity mode={selectedItems.length > 0 ? "visible" : "hidden"}>
          {selectedItems.map((item) => (
            <Badge
              key={item._id}
              variant="secondary"
              className="flex items-center gap-1 py-0.5 text-xs"
            >
              {String(item[displayKey])}
              <button
                type="button"
                className="rounded-full outline-none hover:bg-muted-foreground/20 p-0.5 cursor-pointer"
                onClick={(e) => handleUnselect(item, e)}
              >
                <X className="size-3 text-muted-foreground hover:text-foreground"  />
              </button>
            </Badge>
          ))}
        </Activity>
      </div>
    </div>
  );
}