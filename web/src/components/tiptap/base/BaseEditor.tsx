"use client"

import { useEffect, useRef, useState } from "react"
import { EditorContent, EditorContext, useEditor } from "@tiptap/react"

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit"
import { Heading } from "@tiptap/extension-heading"
import { Document } from "@tiptap/extension-document"
import { Text } from "@tiptap/extension-text"
import { Image } from "@tiptap/extension-image"
import { TaskItem, TaskList } from "@tiptap/extension-list"
import { TextAlign } from "@tiptap/extension-text-align"
import { Typography } from "@tiptap/extension-typography"
import { Highlight } from "@tiptap/extension-highlight"
import { Subscript } from "@tiptap/extension-subscript"
import { Superscript } from "@tiptap/extension-superscript"
import { Selection } from "@tiptap/extensions"

// --- UI Primitives ---
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/components/tiptap/tiptap-ui-primitive/toolbar"

// --- Tiptap Node ---
import { ImageUploadNode } from "@/components/tiptap/tiptap-node/image-upload-node/image-upload-node-extension"
import { HorizontalRule } from "@/components/tiptap/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension"
import "@/components/tiptap/tiptap-node/blockquote-node/blockquote-node.scss"
import "@/components/tiptap/tiptap-node/code-block-node/code-block-node.scss"
import "@/components/tiptap/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss"
import "@/components/tiptap/tiptap-node/list-node/list-node.scss"
import "@/components/tiptap/tiptap-node/image-node/image-node.scss"
import "@/components/tiptap/tiptap-node/heading-node/heading-node.scss"
import "@/components/tiptap/tiptap-node/paragraph-node/paragraph-node.scss"

// --- Tiptap UI ---
import { HeadingDropdownMenu } from "@/components/tiptap/tiptap-ui/heading-dropdown-menu"
import { ListDropdownMenu } from "@/components/tiptap/tiptap-ui/list-dropdown-menu"
import { BlockquoteButton } from "@/components/tiptap/tiptap-ui/blockquote-button"
import { CodeBlockButton } from "@/components/tiptap/tiptap-ui/code-block-button"
import {
  ColorHighlightPopover,
  ColorHighlightPopoverContent,
  ColorHighlightPopoverButton,
} from "@/components/tiptap/tiptap-ui/color-highlight-popover"
import {
  LinkPopover,
  LinkContent,
  LinkButton,
} from "@/components/tiptap/tiptap-ui/link-popover"
import { MarkButton } from "@/components/tiptap/tiptap-ui/mark-button"
import { UndoRedoButton } from "@/components/tiptap/tiptap-ui/undo-redo-button"

// --- Icons ---
import { ArrowLeftIcon } from "@/components/tiptap/tiptap-icons/arrow-left-icon"
import { HighlighterIcon } from "@/components/tiptap/tiptap-icons/highlighter-icon"
import { LinkIcon } from "@/components/tiptap/tiptap-icons/link-icon"

// --- Hooks ---
import { useIsBreakpoint } from "@/hooks/use-is-breakpoint"

import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils"
import "@/components/tiptap/base/base-editor.scss"
import { Button } from "@/components/ui/button"
import { TextAlignDropdownMenu } from "../tiptap-ui/text-align-dropdown/text-align-dropdown"
import { cn } from "@/lib/utils"

interface BaseEditorProps {
  initialContent?: string
  onChange?: (content: string) => void
  isEditable?: boolean
  showToolbar?: boolean
  className?: string
  isTitle?: boolean
  lineClamp?: number // Added: Accept line clamping number dynamically
}

const MainToolbarContent = ({
  onHighlighterClick,
  onLinkClick,
  isMobile,
}: {
  onHighlighterClick: () => void
  onLinkClick: () => void
  isMobile: boolean
}) => {
  return (
    <>
      <ToolbarGroup>
        <UndoRedoButton action="undo" />
        <UndoRedoButton action="redo" />
      </ToolbarGroup>

      <ToolbarGroup>
        <TextAlignDropdownMenu />
      </ToolbarGroup>

      <ToolbarGroup>
        <HeadingDropdownMenu modal={false} levels={[1, 2, 3, 4, 5]} />
        <ListDropdownMenu
          modal={false}
          types={["bulletList", "orderedList", "taskList"]}
        />
        <BlockquoteButton />
        <CodeBlockButton />
      </ToolbarGroup>

      <ToolbarGroup>
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="strike" />
        <MarkButton type="code" />
        <MarkButton type="underline" />
        {!isMobile ? (
          <ColorHighlightPopover />
        ) : (
          <ColorHighlightPopoverButton onClick={onHighlighterClick} />
        )}
        {!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />}
      </ToolbarGroup>
    </>
  )
}

const MobileToolbarContent = ({
  type,
  onBack,
}: {
  type: "highlighter" | "link"
  onBack: () => void
}) => (
  <>
    <ToolbarGroup>
      <Button variant="ghost" onClick={onBack}>
        <ArrowLeftIcon className="tiptap-button-icon" />
        {type === "highlighter" ? (
          <HighlighterIcon className="tiptap-button-icon" />
        ) : (
          <LinkIcon className="tiptap-button-icon" />
        )}
      </Button>
    </ToolbarGroup>

    <ToolbarSeparator />

    {type === "highlighter" ? (
      <ColorHighlightPopoverContent />
    ) : (
      <LinkContent />
    )}
  </>
)

export function BaseEditor({
  initialContent,
  onChange,
  isEditable = true,
  showToolbar = true,
  className,
  isTitle = false,
  lineClamp,
}: BaseEditorProps) {
  const isMobile = useIsBreakpoint()
  const [mobileView, setMobileView] = useState<"main" | "highlighter" | "link">(
    "main"
  )
  const toolbarRef = useRef<HTMLDivElement>(null)

  const defaultExtensions = [
    StarterKit.configure({
      horizontalRule: false,
      link: {
        openOnClick: false,
        enableClickSelection: true,
      },
    }),
    HorizontalRule,
    TextAlign.configure({ types: ["heading", "paragraph"] }),
    TaskList,
    TaskItem.configure({ nested: true }),
    Highlight.configure({ multicolor: true }),
    Image,
    Typography,
    Superscript,
    Subscript,
    Selection,
    ImageUploadNode.configure({
      accept: "image/*",
      maxSize: MAX_FILE_SIZE,
      limit: 3,
      upload: handleImageUpload,
      onError: (error) => console.error("Upload failed:", error),
    }),
  ]

  const titleExtensions = [
    Document,
    Heading.configure({
      levels: [4],
    }),
    Text,
  ]

  const editor = useEditor({
    immediatelyRender: false,
    editable: isEditable,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
        class: "base-editor",
      },
      handleKeyDown(view, event) {
        if (isTitle && event.key === "Enter") {
          event.preventDefault()
          return true
        }

        return false
      },
    },
    extensions: isTitle ? titleExtensions : defaultExtensions,
    onUpdate: ({ editor }) => {
      if (initialized.current) {
        const html = editor.getHTML()
        onChange?.(html)
      }
    },
  })

  useEffect(() => {
    if (editor) {
      editor.setEditable(isEditable)
    }
  }, [isEditable, editor])

  useEffect(() => {
    if (!isMobile && mobileView !== "main") {
      setMobileView("main")
    }
  }, [isMobile, mobileView])

  const initialized = useRef(false)

  useEffect(() => {
    if (!editor) return

    if (editor.getHTML() !== initialContent) {
      editor.commands.setContent(initialContent || '<p></p>', {
        emitUpdate: false,
      })
    }

    initialized.current = true
  }, [editor, initialContent])

  const isClamped = lineClamp && !isEditable;
  const inlineClampStyles: React.CSSProperties = isClamped
    ? {
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: lineClamp,
        lineClamp: lineClamp,
        overflow: 'hidden',
      }
    : {};

  return (
    <div className={cn("base-editor-wrapper", className)} data-clamped={isClamped ? "true" : "false"}>      <EditorContext.Provider value={{ editor }}>
        {isEditable && showToolbar && (
          <Toolbar ref={toolbarRef}>
            {mobileView === "main" ? (
              <MainToolbarContent
                onHighlighterClick={() => setMobileView("highlighter")}
                onLinkClick={() => setMobileView("link")}
                isMobile={isMobile}
              />
            ) : (
              <MobileToolbarContent
                type={mobileView === "highlighter" ? "highlighter" : "link"}
                onBack={() => setMobileView("main")}
              />
            )}
          </Toolbar>
        )}

        <EditorContent
          editor={editor}
          role="presentation"
          className="base-editor-content"
          style={inlineClampStyles}
        />
      </EditorContext.Provider>
    </div>
  )
}