/**
 * Modal component for importing JSON editor state into the editor
 */

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useCallback, useState } from "react";
import "./HtmlImportModal.css";

interface HtmlImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}


export default function HtmlImportModal({
  isOpen,
  onClose,
}: HtmlImportModalProps) {
  const [editor] = useLexicalComposerContext();
  const [jsonInput, setJsonInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleImport = useCallback(() => {
    const hasJson = jsonInput.trim();

    if (!hasJson) {
      setError("Please enter JSON editor state to import");
      return;
    }

    try {
      // Import JSON editor state
      let editorState;
      try {
        editorState = JSON.parse(jsonInput);
      } catch (parseErr) {
        setError("Invalid JSON format. Please check your JSON input.");
        return;
      }

      // Replace entire editor state with JSON
      const newEditorState = editor.parseEditorState(editorState);
      editor.setEditorState(newEditorState);

      console.log("✅ JSON editor state imported successfully");

      // Success - close modal and reset
      setJsonInput("");
      setError(null);
      onClose();
    } catch (err) {
      console.error("Error importing content:", err);
      setError(
        `Failed to import: ${err instanceof Error ? err.message : "Unknown error"}`
      );
    }
  }, [editor, jsonInput, onClose]);

  const handleClear = useCallback(() => {
    setJsonInput("");
    setError(null);
  }, []);

  const handleLoadSample = useCallback(() => {
    const sampleJson = {
      root: {
        children: [
          {
            children: [
              {
                detail: 0,
                format: 1,
                mode: "normal",
                style: "",
                text: "Sample Editor State",
                type: "text",
                version: 1,
              },
            ],
            direction: "ltr",
            format: "",
            indent: 0,
            type: "heading",
            version: 1,
            tag: "h1",
          },
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: "normal",
                style: "",
                text: "This is a sample JSON editor state. It preserves all formatting, custom nodes, and editor structure perfectly.",
                type: "text",
                version: 1,
              },
            ],
            direction: "ltr",
            format: "",
            indent: 0,
            type: "paragraph",
            version: 1,
          },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "root",
        version: 1,
      },
    };

    setJsonInput(JSON.stringify(sampleJson, null, 2));
    setError(null);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="html-import-modal-overlay" onClick={onClose}>
      <div
        className="html-import-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="html-import-modal-header">
          <h2>Import Editor State</h2>
          <button
            className="html-import-modal-close"
            onClick={onClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div className="html-import-modal-body">
          <div className="html-import-info" style={{ marginBottom: "20px" }}>
            <strong>💡 Tip:</strong> Paste the JSON editor state (editorStateJSON) from your backend storage to restore the exact editor content with all formatting, images, and custom nodes preserved.
          </div>

          {/* JSON Input */}
          <div className="html-import-field">
            <label htmlFor="jsonInput" className="html-import-label">
              Editor State (JSON)
            </label>
            <textarea
              id="jsonInput"
              className="html-import-textarea"
              value={jsonInput}
              onChange={(e) => {
                setJsonInput(e.target.value);
                setError(null);
              }}
              placeholder="Paste your editor state JSON here (from backend storage)..."
              rows={14}
            />
          </div>

          {error && <div className="html-import-error">{error}</div>}
        </div>

        <div className="html-import-modal-footer">
          <button
            className="html-import-btn html-import-btn-secondary"
            onClick={handleLoadSample}
          >
            Load Sample
          </button>
          <button
            className="html-import-btn html-import-btn-secondary"
            onClick={handleClear}
          >
            Clear
          </button>
          <div style={{ flex: 1 }} />
          <button
            className="html-import-btn html-import-btn-secondary"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="html-import-btn html-import-btn-primary"
            onClick={handleImport}
            disabled={!jsonInput.trim()}
          >
            Import
          </button>
        </div>
      </div>
    </div>
  );
}

