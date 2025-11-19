/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { JSX } from "react";

import { $createHeadingNode } from "@lexical/rich-text";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  LexicalCommand,
} from "lexical";
import { useEffect } from "react";

import { $createImageNode } from "../nodes/ImageNode";
import {
  $createLayoutContainerNode,
  $createLayoutItemNode,
  LayoutContainerNode,
  LayoutItemNode,
} from "../nodes/LayoutNode";

export type InsertTemplatePayload = {
  templateId: string;
};

export const INSERT_TEMPLATE_COMMAND: LexicalCommand<InsertTemplatePayload> =
  createCommand("INSERT_TEMPLATE_COMMAND");

function $createContactSupportTemplate() {
  // Create the main 2-column layout: 25% left, 75% right
  const layoutContainer = $createLayoutContainerNode("1fr 3fr");

  // LEFT COLUMN - Title and Description (25%)
  const leftColumn = $createLayoutItemNode();

  const titleNode = $createHeadingNode("h1");
  const titleText = $createTextNode("Title");
  titleText.setFormat("bold");
  titleNode.append(titleText);

  const descriptionNode = $createParagraphNode();
  const descText = $createTextNode(
    "Description: Add your description text here. You can edit this text directly in the editor."
  );
  descriptionNode.append(descText);

  leftColumn.append(titleNode, descriptionNode);

  // RIGHT COLUMN - 4 Images Horizontally (75%)
  const rightColumn = $createLayoutItemNode();
  // Create horizontal layout for 4 images
  const imageGrid = $createLayoutContainerNode("1fr 1fr 1fr 1fr");

  // Create 4 image containers with people placeholder images
  const imageUrls = [
    "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=300&h=120&fit=crop&crop=faces",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=120&fit=crop&crop=faces",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=120&fit=crop&crop=faces",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=120&fit=crop&crop=faces",
  ];

  // Standard image dimensions matching display size (120px height)
  const imageWidth = 300;
  const imageHeight = 120;

  for (let i = 0; i < 4; i++) {
    const imageContainer = $createLayoutItemNode();

    // Add image with consistent sizing
    const imageNode = $createImageNode({
      src: imageUrls[i],
      altText: `test ${i + 1}`,
      width: imageWidth,
      height: imageHeight,
      maxWidth: imageWidth,
    });

    // Add caption
    const captionNode = $createParagraphNode();
    const captionText = $createTextNode(`test ${i + 1}`);
    captionNode.append(captionText);

    imageContainer.append(imageNode, captionNode);
    imageGrid.append(imageContainer);
  }

  rightColumn.append(imageGrid);

  // Assemble the layout
  layoutContainer.append(leftColumn, rightColumn);

  return layoutContainer;
}

export default function TemplatesPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([LayoutContainerNode, LayoutItemNode])) {
      throw new Error(
        "TemplatesPlugin: LayoutContainerNode or LayoutItemNode not registered on editor"
      );
    }

    return editor.registerCommand<InsertTemplatePayload>(
      INSERT_TEMPLATE_COMMAND,
      (payload) => {
        const selection = $getSelection();
        if (!$isRangeSelection(selection)) {
          return false;
        }

        let templateNode;

        if (payload.templateId === "contact-support") {
          templateNode = $createContactSupportTemplate();
        } else {
          return false;
        }

        // Clear the entire editor before inserting template
        const root = $getRoot();
        root.clear();

        // Insert the template as the only content
        root.append(templateNode);

        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [editor]);

  return null;
}
