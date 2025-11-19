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
  $getRoot,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_HIGH,
  INSERT_PARAGRAPH_COMMAND,
  KEY_ENTER_COMMAND,
} from "lexical";
import { useEffect } from "react";

import { $isLayoutContainerNode } from "../nodes/LayoutNode";

/**
 * Plugin to restrict editing when a template is present
 * - Allows editing within the template
 * - Prevents adding content outside the template
 * - Prevents breaking out of the template
 */
export default function TemplateRestrictionPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // Check if template exists in the editor
    const hasTemplate = () => {
      let templateExists = false;
      editor.getEditorState().read(() => {
        const root = $getRoot();
        const children = root.getChildren();
        templateExists = children.some((child) => $isLayoutContainerNode(child));
      });
      return templateExists;
    };

    // Prevent Enter key from creating paragraphs at root level
    const removeEnterCommand = editor.registerCommand(
      KEY_ENTER_COMMAND,
      (event) => {
        if (!hasTemplate()) {
          return false;
        }

        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return false;
        }

        // Check if we're at the root level
        const anchorNode = selection.anchor.getNode();
        const topLevelNode = anchorNode.getTopLevelElement();
        
        // If the top level node is the template container, allow normal behavior
        // This lets users edit within the template
        if (topLevelNode && $isLayoutContainerNode(topLevelNode)) {
          return false; // Allow editing within template
        }

        // Prevent creating new content at root level
        event?.preventDefault();
        return true;
      },
      COMMAND_PRIORITY_HIGH
    );

    // Prevent inserting paragraphs outside the template
    const removeInsertParagraphCommand = editor.registerCommand(
      INSERT_PARAGRAPH_COMMAND,
      () => {
        if (!hasTemplate()) {
          return false;
        }

        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return false;
        }

        const anchorNode = selection.anchor.getNode();
        const topLevelNode = anchorNode.getTopLevelElement();
        
        // Only allow within template
        if (topLevelNode && $isLayoutContainerNode(topLevelNode)) {
          return false;
        }

        // Prevent insertion outside template
        return true;
      },
      COMMAND_PRIORITY_HIGH
    );

    // Monitor content changes to ensure template remains the only root content
    const removeUpdateListener = editor.registerUpdateListener(
      ({ editorState }) => {
        editorState.read(() => {
          const root = $getRoot();
          const children = root.getChildren();
          
          // Check if there's a template
          const hasTemplateNode = children.some((child) =>
            $isLayoutContainerNode(child)
          );

          if (hasTemplateNode && children.length > 1) {
            // If there's a template and other nodes, remove the other nodes
            editor.update(() => {
              const root = $getRoot();
              const children = root.getChildren();
              
              for (let i = children.length - 1; i >= 0; i--) {
                const child = children[i];
                if (!$isLayoutContainerNode(child)) {
                  child.remove();
                }
              }
            });
          }
        });
      }
    );

    return () => {
      removeEnterCommand();
      removeInsertParagraphCommand();
      removeUpdateListener();
    };
  }, [editor]);

  return null;
}

