/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { JSX } from "react";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  SELECTION_CHANGE_COMMAND,
} from "lexical";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { $isLayoutContainerNode } from "../nodes/LayoutNode";

const PRESET_COLORS = [
  { name: "Light Gray", color: "#f9fafb" },
  { name: "White", color: "#ffffff" },
  { name: "Light Blue", color: "#eff6ff" },
  { name: "Light Green", color: "#f0fdf4" },
  { name: "Light Yellow", color: "#fefce8" },
  { name: "Light Pink", color: "#fdf2f8" },
  { name: "Light Purple", color: "#faf5ff" },
  { name: "Light Orange", color: "#fff7ed" },
];

function BackgroundColorPicker({
  currentColor,
  onColorChange,
  onClose,
}: {
  currentColor: string;
  onColorChange: (color: string) => void;
  onClose: () => void;
}): JSX.Element {
  const [customColor, setCustomColor] = useState(currentColor);

  return (
    <div className="background-color-widget">
      <div className="background-color-header">
        <h3>Template Background</h3>
        <button
          className="background-color-close"
          onClick={onClose}
          aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Preset Colors */}
      <div className="background-color-presets">
        <label>Preset Colors:</label>
        <div className="background-color-grid">
          {PRESET_COLORS.map((preset) => (
            <button
              key={preset.color}
              className={`background-color-swatch ${currentColor === preset.color ? "active" : ""}`}
              style={{ backgroundColor: preset.color }}
              onClick={() => onColorChange(preset.color)}
              title={preset.name}
            />
          ))}
        </div>
      </div>

      {/* Custom Color Picker */}
      <div className="background-color-custom">
        <label htmlFor="custom-color-input">Custom Color:</label>
        <div className="background-color-input-group">
          <input
            id="custom-color-input"
            type="color"
            value={customColor}
            onChange={(e) => {
              setCustomColor(e.target.value);
              onColorChange(e.target.value);
            }}
            className="background-color-picker"
          />
          <input
            type="text"
            value={customColor}
            onChange={(e) => {
              setCustomColor(e.target.value);
              if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                onColorChange(e.target.value);
              }
            }}
            className="background-color-hex"
            placeholder="#ffffff"
            maxLength={7}
          />
        </div>
      </div>
    </div>
  );
}

export default function BackgroundColorPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const [showPicker, setShowPicker] = useState(false);
  const [currentColor, setCurrentColor] = useState("#f9fafb");
  const [templateElement, setTemplateElement] = useState<HTMLElement | null>(null);

  const updateBackgroundColor = useCallback(() => {
    editor.getEditorState().read(() => {
      const selection = $getSelection();

      if (!$isRangeSelection(selection)) {
        return;
      }

      // Find the outermost template container (top-level LayoutContainerNode)
      const anchorNode = selection.anchor.getNode();
      let topmostLayoutContainer = null;

      // Traverse up to find all LayoutContainerNodes and get the topmost one
      let current = anchorNode;
      while (current) {
        if ($isLayoutContainerNode(current)) {
          topmostLayoutContainer = current;
        }
        const parent = current.getParent();
        if (!parent) break;
        current = parent;
      }

      if (topmostLayoutContainer && $isLayoutContainerNode(topmostLayoutContainer)) {
        const key = topmostLayoutContainer.getKey();
        const domElement = editor.getElementByKey(key);
        
        if (domElement) {
          setTemplateElement(domElement as HTMLElement);
          // Get current background color from the node's state
          const bgColor = topmostLayoutContainer.getBackgroundColor();
          setCurrentColor(bgColor || "#f9fafb");
        }
      } else {
        setTemplateElement(null);
      }
    });
  }, [editor]);

  const handleColorChange = useCallback(
    (color: string) => {
      if (templateElement) {
        // Update the node's backgroundColor property (persists in JSON)
        editor.update(() => {
          const selection = $getSelection();
          if (!$isRangeSelection(selection)) {
            return;
          }

          // Find the outermost layout container
          const anchorNode = selection.anchor.getNode();
          let topmostLayoutContainer = null;

          let current = anchorNode;
          while (current) {
            if ($isLayoutContainerNode(current)) {
              topmostLayoutContainer = current;
            }
            const parent = current.getParent();
            if (!parent) break;
            current = parent;
          }

          if (topmostLayoutContainer && $isLayoutContainerNode(topmostLayoutContainer)) {
            topmostLayoutContainer.setBackgroundColor(color);
          }
        });
        
        setCurrentColor(color);
      }
    },
    [editor, templateElement]
  );

  // Convert RGB to Hex
  const rgbToHex = (rgb: string): string | null => {
    const result = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (!result) return null;
    
    const r = parseInt(result[1]);
    const g = parseInt(result[2]);
    const b = parseInt(result[3]);
    
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
  };

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        updateBackgroundColor();
        return false;
      },
      COMMAND_PRIORITY_LOW
    );
  }, [editor, updateBackgroundColor]);

  useEffect(() => {
    return editor.registerUpdateListener(() => {
      updateBackgroundColor();
    });
  }, [editor, updateBackgroundColor]);

  if (!templateElement) {
    return null;
  }

  return createPortal(
    <div className="background-color-toolbar">
      {!showPicker ? (
        <button
          className="background-color-trigger"
          onClick={() => setShowPicker(true)}
          title="Change background color">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
          <span>Background</span>
        </button>
      ) : (
        <BackgroundColorPicker
          currentColor={currentColor}
          onColorChange={handleColorChange}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>,
    document.body
  );
}

