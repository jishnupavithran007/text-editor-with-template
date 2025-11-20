/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { JSX } from "react";

import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { CheckListPlugin } from "@lexical/react/LexicalCheckListPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HashtagPlugin } from "@lexical/react/LexicalHashtagPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { HorizontalRulePlugin } from "@lexical/react/LexicalHorizontalRulePlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import { useLexicalEditable } from "@lexical/react/useLexicalEditable";
import {
  $isTextNode,
  DOMConversionMap,
  DOMExportOutput,
  DOMExportOutputMap,
  isHTMLElement,
  Klass,
  LexicalEditor,
  LexicalNode,
  ParagraphNode,
  TextNode,
} from "lexical";

import { SettingsContext } from "./context/SettingsContext";
import {
  SharedHistoryContext,
  useSharedHistoryContext,
} from "./context/SharedHistoryContext";
import ExampleTheme from "./ExampleTheme";
import PlaygroundNodes from "./nodes";
import AutoLinkPlugin from "./plugins/AutoLinkPlugin";
import BackgroundColorPlugin from "./plugins/BackgroundColorPlugin";
import ClickableLinkPluginCustom from "./plugins/ClickableLinkPlugin";
import CodeHighlightPlugin from "./plugins/CodeHighlightPlugin";
import DragDropPastePlugin from "./plugins/DragDropPastePlugin";
import ImageActionMenuPlugin from "./plugins/ImageActionMenuPlugin";
import { ImagesPlugin } from "./plugins/ImagesPlugin";
import LinkPlugin from "./plugins/LinkPlugin";
import ListMaxIndentLevelPlugin from "./plugins/ListMaxIndentLevelPlugin";
import MarkdownShortcutPlugin from "./plugins/MarkdownShortcutPlugin";
import PageBreakPlugin from "./plugins/PageBreakPlugin";
import TableCellResizer from "./plugins/TableCellResizer";
import TemplateRestrictionPlugin from "./plugins/TemplateRestrictionPlugin";
import TemplatesPlugin from "./plugins/TemplatesPlugin";
import ToolbarPlugin from "./plugins/ToolbarPlugin";
import TreeViewPlugin from "./plugins/TreeViewPlugin";
import TwitterPlugin from "./plugins/TwitterPlugin";
import YouTubePlugin from "./plugins/YouTubePlugin";
import ExportPayloadPlugin from "./plugins/ExportPayloadPlugin";
import { parseAllowedColor, parseAllowedFontSize } from "./styleConfig";
import ContentEditable from "./ui/ContentEditable";

const placeholder = "Enter some rich text...";

const removeStylesExportDOM = (
  editor: LexicalEditor,
  target: LexicalNode
): DOMExportOutput => {
  const output = target.exportDOM(editor);
  if (output && isHTMLElement(output.element)) {
    // Remove all inline styles and classes if the element is an HTMLElement
    // Children are checked as well since TextNode can be nested
    // in i, b, and strong tags.
    for (const el of [
      output.element,
      ...output.element.querySelectorAll("[style],[class]"),
    ]) {
      el.removeAttribute("class");
      el.removeAttribute("style");
    }
  }
  return output;
};

const exportMap: DOMExportOutputMap = new Map<
  Klass<LexicalNode>,
  (editor: LexicalEditor, target: LexicalNode) => DOMExportOutput
>([
  [ParagraphNode, removeStylesExportDOM],
  [TextNode, removeStylesExportDOM],
]);

const getExtraStyles = (element: HTMLElement): string => {
  // Parse styles from pasted input, but only if they match exactly the
  // sort of styles that would be produced by exportDOM
  let extraStyles = "";
  const fontSize = parseAllowedFontSize(element.style.fontSize);
  const backgroundColor = parseAllowedColor(element.style.backgroundColor);
  const color = parseAllowedColor(element.style.color);
  if (fontSize !== "" && fontSize !== "15px") {
    extraStyles += `font-size: ${fontSize};`;
  }
  if (backgroundColor !== "" && backgroundColor !== "rgb(255, 255, 255)") {
    extraStyles += `background-color: ${backgroundColor};`;
  }
  if (color !== "" && color !== "rgb(0, 0, 0)") {
    extraStyles += `color: ${color};`;
  }
  return extraStyles;
};

const constructImportMap = (): DOMConversionMap => {
  const importMap: DOMConversionMap = {};

  // Wrap all TextNode importers with a function that also imports
  // the custom styles implemented by the playground
  for (const [tag, fn] of Object.entries(TextNode.importDOM() || {})) {
    importMap[tag] = (importNode) => {
      const importer = fn(importNode);
      if (!importer) {
        return null;
      }
      return {
        ...importer,
        conversion: (element) => {
          const output = importer.conversion(element);
          if (
            output === null ||
            output.forChild === undefined ||
            output.after !== undefined ||
            output.node !== null
          ) {
            return output;
          }
          const extraStyles = getExtraStyles(element);
          if (extraStyles) {
            const { forChild } = output;
            return {
              ...output,
              forChild: (child, parent) => {
                const textNode = forChild(child, parent);
                if ($isTextNode(textNode)) {
                  textNode.setStyle(textNode.getStyle() + extraStyles);
                }
                return textNode;
              },
            };
          }
          return output;
        },
      };
    };
  }

  return importMap;
};

const editorConfig = {
  html: {
    export: exportMap,
    import: constructImportMap(),
  },
  namespace: "Lexical Playground",
  nodes: [...PlaygroundNodes],
  onError(error: Error) {
    throw error;
  },
  theme: ExampleTheme,
};

function Editor(): JSX.Element {
  const { historyState } = useSharedHistoryContext();
  const isEditable = useLexicalEditable();

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      // Can be used for floating toolbars in the future
    }
  };

  return (
    <>
      <ToolbarPlugin />
      <div className="editor-container">
        {/* Core Plugins */}
        <AutoFocusPlugin />
        <HashtagPlugin />
        <AutoLinkPlugin />

        {/* History with shared state */}
        <HistoryPlugin externalHistoryState={historyState} />

        {/* Rich Text Editor */}
        <RichTextPlugin
          contentEditable={
            <div className="editor-scroller">
              <div className="editor" ref={onRef}>
                <ContentEditable placeholder={placeholder} />
              </div>
            </div>
          }
          placeholder={<div className="Placeholder__root">{placeholder}</div>}
          ErrorBoundary={LexicalErrorBoundary}
        />

        {/* Markdown Support */}
        <MarkdownShortcutPlugin />

        {/* Code Highlighting */}
        <CodeHighlightPlugin />

        {/* List Plugins */}
        <ListPlugin />
        <CheckListPlugin />
        <ListMaxIndentLevelPlugin maxDepth={7} />

        {/* Table Plugins */}
        <TablePlugin
          hasCellMerge={true}
          hasCellBackgroundColor={true}
          hasHorizontalScroll={true}
        />
        <TableCellResizer />

        {/* Link Plugins */}
        <LinkPlugin />
        <ClickableLinkPluginCustom disabled={!isEditable} />

        {/* Media Plugins */}
        <ImagesPlugin />
        <ImageActionMenuPlugin />
        <YouTubePlugin />
        <TwitterPlugin />

        {/* Templates */}
        <TemplatesPlugin />
        <TemplateRestrictionPlugin />
        <BackgroundColorPlugin />

        {/* Layout & Formatting */}
        <HorizontalRulePlugin />
        <PageBreakPlugin />
        <TabIndentationPlugin maxIndent={7} />

        {/* Drag & Drop */}
        <DragDropPastePlugin />

        {/* Export Payload for Backend Testing */}
        <ExportPayloadPlugin />

        {/* Character Limit (optional - comment out if not needed) */}
        {/* <CharacterLimitPlugin charset="UTF-16" maxLength={5000} /> */}
      </div>
      <TreeViewPlugin />
    </>
  );
}

export default function App(): JSX.Element {
  return (
    <SettingsContext>
      <SharedHistoryContext>
        <LexicalComposer initialConfig={editorConfig}>
          <Editor />
        </LexicalComposer>
      </SharedHistoryContext>
    </SettingsContext>
  );
}
