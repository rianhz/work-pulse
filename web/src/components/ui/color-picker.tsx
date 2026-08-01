"use client";

import { Button, ButtonProps } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { HexColorPicker } from "react-colorful";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export function ColorPicker({
  value,
  onChange,
}: ColorPickerProps) {
  return (
    <div className="space-y-3 w-full">
      <HexColorPicker color={value} onChange={onChange} className="w-full!" />
    </div>
  );
}

interface Props {
  value: string;
  onChange: (color: string) => void;
  children?: React.ReactNode;
  buttonProps?: ButtonProps;
}

export function ColorPickerButton({
  value,
  onChange,
  children,
  buttonProps,
}: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="relative"
          {...buttonProps}
        >
          {children}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-auto p-4"
        align="start"
      >
        <ColorPicker
          value={value}
          onChange={onChange}
        />
      </PopoverContent>
    </Popover>
  );
}