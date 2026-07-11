"use client";

import { forwardRef, useMemo, useState } from "react";

// Hooks
import { useTiptapEditor } from "@/hooks/use-tiptap-editor";

// Icons
import { ChevronDownIcon } from "@/components/tiptap/tiptap-icons/chevron-down-icon";
import { AlignLeftIcon } from "@/components/tiptap/tiptap-icons/align-left-icon";
import { AlignCenterIcon } from "@/components/tiptap/tiptap-icons/align-center-icon";
import { AlignRightIcon } from "@/components/tiptap/tiptap-icons/align-right-icon";
import { AlignJustifyIcon } from "@/components/tiptap/tiptap-icons/align-justify-icon";

// Tiptap
import { TextAlignButton, type TextAlign } from "@/components/tiptap/tiptap-ui/text-align-button";

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

    const activeAlign = useMemo(() => {
      if (!editor) return "left";

      if (editor.isActive({ textAlign: "center" })) return "center";
      if (editor.isActive({ textAlign: "right" })) return "right";
      if (editor.isActive({ textAlign: "justify" })) return "justify";

      return "left";
    }, [editor, editor?.state]);

    const ActiveIcon = ICONS[activeAlign];

    const canAlign =
      !!editor &&
      editor.isEditable &&
      editor.can().setTextAlign("left");

    const isVisible =
      !hideWhenUnavailable || !!editor;

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
            tooltip="Text Align"
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

        <DropdownMenuContent align="start">
          <DropdownMenuGroup>
            {ALIGNMENTS.map((align) => (
              <DropdownMenuItem
                key={align}
                asChild
              >
                <TextAlignButton
                  editor={editor}
                  align={align}
                  text={
                    align.charAt(0).toUpperCase() +
                    align.slice(1)
                  }
                />
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
);

TextAlignDropdownMenu.displayName =
  "TextAlignDropdownMenu";

export default TextAlignDropdownMenu;