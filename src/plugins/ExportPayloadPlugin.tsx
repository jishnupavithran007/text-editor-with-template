/**
 * Plugin to export and test the editor payload for backend submission
 */

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $generateHtmlFromNodes } from "@lexical/html";
import { useCallback } from "react";

export interface EditorPayload {
  editorStateJSON: string;
  html: string;
  timestamp: string;
  metadata?: {
    wordCount: number;
    characterCount: number;
  };
}

export default function ExportPayloadPlugin() {
  const [editor] = useLexicalComposerContext();

  const getEditorPayload = useCallback((): EditorPayload => {
    let editorStateJSON = "";
    let html = "";
    let wordCount = 0;
    let characterCount = 0;

    editor.getEditorState().read(() => {
      // Get JSON serialization
      editorStateJSON = JSON.stringify(
        editor.getEditorState().toJSON(),
        null,
        2
      );

      // Get HTML representation
      html = $generateHtmlFromNodes(editor, null);

      // Calculate metadata
      const text = editor.getEditorState().read(() => {
        return editor.getRootElement()?.textContent || "";
      });

      characterCount = text.length;
      wordCount = text.trim().split(/\s+/).filter(Boolean).length;
    });

    return {
      editorStateJSON,
      html,
      timestamp: new Date().toISOString(),
      metadata: {
        wordCount,
        characterCount,
      },
    };
  }, [editor]);

  const handleTestPayload = useCallback(() => {
    const payload = getEditorPayload();
    console.log(payload, "payload");
  }, [getEditorPayload]);

  // Expose the handler globally for toolbar access
  (window as any).__testEditorPayload = handleTestPayload;

  return null;
}

// Helper function to escape HTML for display
function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}
