"use client";

import { forwardRef, useEffect, useMemo, useState } from "react";

// Hooks
import { useTiptapEditor } from "@/hooks/use-tiptap-editor";
import { useTextAlign } from "@/components/tiptap/tiptap-ui/text-align-dropdown/use-text-align";

// Icons
import { ChevronDownIcon } from "@/components/tiptap/tiptap-icons/chevron-down-icon";
import { AlignLeftIcon } from "@/components/tiptap/tiptap-icons/align-left-icon";
import { AlignCenterIcon } from "@/components/tiptap/tiptap-icons/align-center-icon";
import { AlignRightIcon } from "@/components/tiptap/tiptap-icons/align-right-icon";
import { AlignJustifyIcon } from "@/components/tiptap/tiptap-icons/align-justify-icon";

// Tiptap Types
import type { TextAlign } from "@/components/tiptap/tiptap-ui/text-align-dropdown/use-text-align";

// Shadcn
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ALIGNMENTS: TextAlign[] = [
  "left",
  "center",
  "right",
  "justify",
];

const ICONS = {
  left: AlignLeftIcon,
  center: AlignCenterIcon,
  right: AlignRightIcon,
  justify: AlignJustifyIcon,
};

export interface TextAlignDropdownMenuProps
  extends React.ComponentPropsWithoutRef<typeof Button> {
  editor?: any;
  hideWhenUnavailable?: boolean;
  modal?: boolean;
}

function TextAlignMenuItem({
  align,
  text,
  editor,
}: {
  align: TextAlign;
  text: string;
  editor: any;
}) {
  const { isVisible, canAlign, handleTextAlign, Icon } = useTextAlign({
    editor,
    align,
    hideWhenUnavailable: false,
  });

  if (!isVisible) return null;

  return (
    <DropdownMenuItem
      disabled={!canAlign}
      onClick={(e) => {
        e.preventDefault();
        handleTextAlign();
      }}
      className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm select-none focus:bg-accent focus:text-accent-foreground"
    >
      <Icon className="tiptap-button-icon" />
      <span className="tiptap-button-text">{text}</span>
    </DropdownMenuItem>
  );
}

export const TextAlignDropdownMenu = forwardRef<
  HTMLButtonElement,
  TextAlignDropdownMenuProps
>(
  (
    {
      editor: providedEditor,
      hideWhenUnavailable = false,
      modal = true,
      children,
      ...buttonProps
    },
    ref
  ) => {
    const { editor } = useTiptapEditor(providedEditor);
    const [open, setOpen] = useState(false);
    const [selectionTick, setSelectionTick] = useState(0);

    useEffect(() => {
      if (!editor) return;

      const handleUpdate = () => {
        setSelectionTick((prev) => prev + 1);
      };

      editor.on("selectionUpdate", handleUpdate);
      editor.on("transaction", handleUpdate);

      return () => {
        editor.off("selectionUpdate", handleUpdate);
        editor.off("transaction", handleUpdate);
      };
    }, [editor]);

    const activeAlign = useMemo(() => {
      if (!editor) return "left";
      if (editor.isActive({ textAlign: "center" })) return "center";
      if (editor.isActive({ textAlign: "right" })) return "right";
      if (editor.isActive({ textAlign: "justify" })) return "justify";
      return "left";
    }, [editor, selectionTick]);

    const ActiveIcon = ICONS[activeAlign];
    
    // FIXED: Tiptap natively tracks if any custom alignment wrapper is present using string evaluation
    const hasActiveAlignment = useMemo(() => {
      if (!editor) return false;
      return editor.isActive({ textAlign: "center" }) || 
             editor.isActive({ textAlign: "right" }) || 
             editor.isActive({ textAlign: "justify" });
    }, [editor, selectionTick]);

    const canAlign =
      !!editor &&
      editor.isEditable &&
      editor.can().setTextAlign("left");

    const isVisible = !hideWhenUnavailable || !!editor;

    if (!isVisible) return null;

    return (
      <DropdownMenu
        modal={modal}
        open={open}
        onOpenChange={setOpen}
      >
        <DropdownMenuTrigger asChild>
          <Button
            ref={ref}
            type="button"
            variant="ghost"
            disabled={!canAlign}
            data-disabled={!canAlign}
            data-active-state={open || hasActiveAlignment ? "on" : "off"}
            aria-pressed={open || hasActiveAlignment}
            tabIndex={-1}
            tooltip={open ? undefined : "Text Align"}
            className={`${hasActiveAlignment ? "bg-muted text-muted-foreground" : ""}`}
            {...buttonProps}
          >
            {children ?? (
              <>
                <ActiveIcon className="tiptap-button-icon" />
                <ChevronDownIcon className="tiptap-button-dropdown-small" />
              </>
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent 
          align="start" 
          className="min-w-[120px]"
          onCloseAutoFocus={(e) => e.preventDefault()}
        >
          <DropdownMenuGroup>
            {ALIGNMENTS.map((align) => (
              <TextAlignMenuItem
                key={align}
                align={align}
                editor={editor}
                text={
                  align.charAt(0).toUpperCase() +
                  align.slice(1)
                }
              />
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
);

TextAlignDropdownMenu.displayName = "TextAlignDropdownMenu";

export default TextAlignDropdownMenu;