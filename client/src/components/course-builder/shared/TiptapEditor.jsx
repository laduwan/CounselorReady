// ─────────────────────────────────────────────────────────────────────────────
// CounselorReady CourseBuilder — shared/TiptapEditor.jsx
// Reusable Tiptap v3 rich text editor.
// Outputs clean HTML compatible with CReady Viewer.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import CharacterCount from "@tiptap/extension-character-count";
import { C } from "../constants.js";

// ─── Toolbar button ───────────────────────────────────────────────────────────

function ToolBtn({ onClick, active, disabled, title, children }) {
  return (
    <button
      type="button"
      onMouseDown={e => { e.preventDefault(); onClick(); }}
      disabled={disabled}
      title={title}
      style={{
        padding: "3px 7px",
        borderRadius: 4,
        border: "none",
        background: active ? C.burgundyFaded : "transparent",
        color: active ? C.burgundy : disabled ? C.textLight : C.navy,
        cursor: disabled ? "default" : "pointer",
        fontSize: 13,
        fontWeight: active ? 700 : 400,
        lineHeight: 1.4,
      }}
    >
      {children}
    </button>
  );
}

// ─── Editor component ─────────────────────────────────────────────────────────

export default function TiptapEditor({ value = "", onChange, placeholder = "Enter content...", minHeight = 160 }) {
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        codeBlock: false,
        code: false,
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
      }),
      CharacterCount,
    ],
    content: value,
    onUpdate({ editor }) {
      onChangeRef.current(editor.getHTML());
    },
    editorProps: {
      attributes: {
        style: `min-height:${minHeight}px; padding:10px 12px; outline:none; font-size:14px; line-height:1.7; color:${C.navy};`,
      },
    },
  });

  // Sync external value changes (e.g. undo/redo from reducer)
  const lastValueRef = useRef(value);
  useEffect(() => {
    if (!editor) return;
    if (value !== lastValueRef.current && value !== editor.getHTML()) {
      editor.commands.setContent(value, false);
    }
    lastValueRef.current = value;
  }, [value, editor]);

  if (!editor) return null;

  const wordCount = editor.storage.characterCount?.words?.() ?? 0;

  return (
    <div style={{
      border: `1px solid ${C.border}`,
      borderRadius: 8,
      overflow: "hidden",
      background: C.stone,
    }}>
      {/* Toolbar */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        padding: "6px 8px",
        borderBottom: `1px solid ${C.borderLight}`,
        background: "#fff",
      }}>
        <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold (Ctrl+B)"><strong>B</strong></ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic (Ctrl+I)"><em>I</em></ToolBtn>

        <div style={{ width: 1, background: C.borderLight, margin: "2px 4px" }} />

        <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="Heading 2">H2</ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title="Heading 3">H3</ToolBtn>

        <div style={{ width: 1, background: C.borderLight, margin: "2px 4px" }} />

        <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet list">• List</ToolBtn>
        <ToolBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Numbered list">1. List</ToolBtn>

        <div style={{ width: 1, background: C.borderLight, margin: "2px 4px" }} />

        <ToolBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Blockquote (clinical vignette)">" Quote</ToolBtn>

        <div style={{ width: 1, background: C.borderLight, margin: "2px 4px" }} />

        <ToolBtn
          onClick={() => {
            const url = window.prompt("URL:");
            if (url) editor.chain().focus().setLink({ href: url }).run();
          }}
          active={editor.isActive("link")}
          title="Add link"
        >
          Link
        </ToolBtn>
        <ToolBtn
          onClick={() => editor.chain().focus().unsetLink().run()}
          disabled={!editor.isActive("link")}
          title="Remove link"
        >
          Unlink
        </ToolBtn>

        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 11, color: C.textMuted, alignSelf: "center", paddingRight: 4 }}>
          {wordCount.toLocaleString()}w
        </span>
      </div>

      {/* Editor area */}
      <div style={{ background: C.stone, position: "relative" }}>
        <EditorContent editor={editor} />
        {!value && (
          <div style={{
            position: "absolute", top: 10, left: 12,
            color: C.textLight, fontSize: 14, pointerEvents: "none",
            display: editor.isFocused ? "none" : "block",
          }}>
            {placeholder}
          </div>
        )}
      </div>
    </div>
  );
}
