/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {
  DOMConversionMap,
  DOMConversionOutput,
  EditorConfig,
  ElementFormatType,
  LexicalNode,
  NodeKey,
  Spread,
} from "lexical";

import {
  $applyNodeReplacement,
  $isElementNode,
  ElementNode,
  SerializedElementNode,
} from "lexical";

export type SerializedLayoutContainerNode = Spread<
  {
    templateColumns: string;
    backgroundColor?: string;
  },
  SerializedElementNode
>;

export class LayoutContainerNode extends ElementNode {
  __templateColumns: string;
  __backgroundColor: string;

  constructor(
    templateColumns: string,
    backgroundColor?: string,
    format?: ElementFormatType,
    key?: NodeKey
  ) {
    super(key);
    this.__templateColumns = templateColumns;
    this.__backgroundColor = backgroundColor || "#f9fafb";
    this.__format = format || "";
  }

  static getType(): string {
    return "layout-container";
  }

  static clone(node: LayoutContainerNode): LayoutContainerNode {
    return new LayoutContainerNode(
      node.__templateColumns,
      node.__backgroundColor,
      node.__format,
      node.__key
    );
  }

  createDOM(config: EditorConfig): HTMLElement {
    const dom = document.createElement("div");
    dom.setAttribute("data-lexical-layout-container", "true");
    dom.style.display = "grid";
    dom.style.gridTemplateColumns = this.__templateColumns;
    dom.style.gap = "20px";
    dom.style.backgroundColor = this.__backgroundColor;
    if (typeof this.__format === "string") {
      dom.style.textAlign = this.__format;
    }
    return dom;
  }

  updateDOM(prevNode: LayoutContainerNode, dom: HTMLElement): boolean {
    if (prevNode.__templateColumns !== this.__templateColumns) {
      dom.style.gridTemplateColumns = this.__templateColumns;
    }
    if (prevNode.__backgroundColor !== this.__backgroundColor) {
      dom.style.backgroundColor = this.__backgroundColor;
    }
    return false;
  }

  static importDOM(): DOMConversionMap | null {
    return {};
  }

  static importJSON(
    serializedNode: SerializedLayoutContainerNode
  ): LayoutContainerNode {
    return $createLayoutContainerNode(
      serializedNode.templateColumns,
      serializedNode.backgroundColor
    );
  }

  isShadowRoot(): boolean {
    return true;
  }

  canBeEmpty(): boolean {
    return false;
  }

  exportJSON(): SerializedLayoutContainerNode {
    return {
      ...super.exportJSON(),
      templateColumns: this.__templateColumns,
      backgroundColor: this.__backgroundColor,
      type: "layout-container",
      version: 1,
    };
  }

  getBackgroundColor(): string {
    return this.__backgroundColor;
  }

  setBackgroundColor(backgroundColor: string): void {
    const writable = this.getWritable();
    writable.__backgroundColor = backgroundColor;
  }
}

export function $createLayoutContainerNode(
  templateColumns: string,
  backgroundColor?: string
): LayoutContainerNode {
  return $applyNodeReplacement(
    new LayoutContainerNode(templateColumns, backgroundColor)
  );
}

export function $isLayoutContainerNode(
  node: LexicalNode | null | undefined
): node is LayoutContainerNode {
  return node instanceof LayoutContainerNode;
}

export type SerializedLayoutItemNode = SerializedElementNode;

export class LayoutItemNode extends ElementNode {
  static getType(): string {
    return "layout-item";
  }

  static clone(node: LayoutItemNode): LayoutItemNode {
    return new LayoutItemNode(node.__key);
  }

  createDOM(): HTMLElement {
    const dom = document.createElement("div");
    dom.setAttribute("data-lexical-layout-item", "true");
    return dom;
  }

  updateDOM(): boolean {
    return false;
  }

  static importDOM(): DOMConversionMap | null {
    return {};
  }

  static importJSON(serializedNode: SerializedLayoutItemNode): LayoutItemNode {
    return $createLayoutItemNode();
  }

  isShadowRoot(): boolean {
    return true;
  }

  exportJSON(): SerializedLayoutItemNode {
    return {
      ...super.exportJSON(),
      type: "layout-item",
      version: 1,
    };
  }
}

export function $createLayoutItemNode(): LayoutItemNode {
  return $applyNodeReplacement(new LayoutItemNode());
}

export function $isLayoutItemNode(
  node: LexicalNode | null | undefined
): node is LayoutItemNode {
  return node instanceof LayoutItemNode;
}
