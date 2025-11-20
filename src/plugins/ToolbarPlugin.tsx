/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { $createCodeNode } from "@lexical/code";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { INSERT_TABLE_COMMAND } from "@lexical/table";
import { mergeRegister } from "@lexical/utils";
import {
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_LOW,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import { useCallback, useEffect, useRef, useState } from "react";

import DropDown, { DropDownItem } from "../ui/DropDown";
import HtmlImportModal from "../components/HtmlImportModal";
import { INSERT_HORIZONTAL_RULE_COMMAND } from "./HorizontalRulePlugin";
import { INSERT_IMAGE_COMMAND } from "./ImagesPlugin";
import { INSERT_PAGE_BREAK_COMMAND } from "./PageBreakPlugin";
import { INSERT_TEMPLATE_COMMAND } from "./TemplatesPlugin";
import { INSERT_TWEET_COMMAND } from "./TwitterPlugin";
import { INSERT_YOUTUBE_COMMAND } from "./YouTubePlugin";

function Divider() {
  return <div className="divider" />;
}

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isHtmlImportModalOpen, setIsHtmlImportModalOpen] = useState(false);

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // Update text format
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(
          () => {
            $updateToolbar();
          },
          { editor }
        );
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, _newEditor) => {
          $updateToolbar();
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor, $updateToolbar]);

  return (
    <>
      <HtmlImportModal
        isOpen={isHtmlImportModalOpen}
        onClose={() => setIsHtmlImportModalOpen(false)}
      />
      <div className="toolbar" ref={toolbarRef}>
        <button
          disabled={!canUndo}
          onClick={() => {
            editor.dispatchCommand(UNDO_COMMAND, undefined);
          }}
          className="toolbar-item spaced"
          aria-label="Undo"
        >
          <i className="format undo" />
        </button>
        <button
          disabled={!canRedo}
          onClick={() => {
            editor.dispatchCommand(REDO_COMMAND, undefined);
          }}
          className="toolbar-item"
          aria-label="Redo"
        >
          <i className="format redo" />
        </button>
        <Divider />
        <button
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
          }}
          className={"toolbar-item spaced " + (isBold ? "active" : "")}
          aria-label="Format Bold"
        >
          <i className="format bold" />
        </button>
        <button
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
          }}
          className={"toolbar-item spaced " + (isItalic ? "active" : "")}
          aria-label="Format Italics"
        >
          <i className="format italic" />
        </button>
        <button
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
          }}
          className={"toolbar-item spaced " + (isUnderline ? "active" : "")}
          aria-label="Format Underline"
        >
          <i className="format underline" />
        </button>
        <button
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
          }}
          className={"toolbar-item spaced " + (isStrikethrough ? "active" : "")}
          aria-label="Format Strikethrough"
        >
          <i className="format strikethrough" />
        </button>
        <Divider />
        <button
          onClick={() => {
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
          }}
          className="toolbar-item spaced"
          aria-label="Left Align"
        >
          <i className="format left-align" />
        </button>
        <button
          onClick={() => {
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
          }}
          className="toolbar-item spaced"
          aria-label="Center Align"
        >
          <i className="format center-align" />
        </button>
        <button
          onClick={() => {
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
          }}
          className="toolbar-item spaced"
          aria-label="Right Align"
        >
          <i className="format right-align" />
        </button>
        <button
          onClick={() => {
            editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
          }}
          className="toolbar-item"
          aria-label="Justify Align"
        >
          <i className="format justify-align" />
        </button>
        <Divider />
        <button
          onClick={() => setIsHtmlImportModalOpen(true)}
          className="toolbar-item spaced html-import-btn"
          aria-label="Import"
          title="Import content into editor"
        >
          <span style={{ fontSize: "14px", fontWeight: 500 }}>📥 Import</span>
        </button>
        <button
          onClick={() => {
            // Call the global test payload function
            (window as any).__testEditorPayload?.();
          }}
          className="toolbar-item spaced test-payload-btn"
          aria-label="Export"
          title="Export editor content"
        >
          <span style={{ fontSize: "14px", fontWeight: 500 }}>📤 Export</span>
        </button>
        <Divider />
        <DropDown
          disabled={false}
          buttonClassName="toolbar-item spaced"
          buttonLabel="Insert"
          buttonAriaLabel="Insert specialized editor node"
          buttonIconClassName="icon plus"
        >
          <DropDownItem
            onClick={() => {
              editor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined);
            }}
            className="item"
          >
            <i className="icon horizontal-rule" />
            <span className="text">Horizontal Rule</span>
          </DropDownItem>
          <DropDownItem
            onClick={() => {
              editor.dispatchCommand(INSERT_PAGE_BREAK_COMMAND, undefined);
            }}
            className="item"
          >
            <i className="icon page-break" />
            <span className="text">Page Break</span>
          </DropDownItem>
          <DropDownItem
            onClick={() => {
              const src = prompt("Enter image URL:");
              if (src) {
                editor.dispatchCommand(INSERT_IMAGE_COMMAND, {
                  altText: "Image",
                  src,
                });
              }
            }}
            className="item"
          >
            <i className="icon image" />
            <span className="text">Image</span>
          </DropDownItem>
          <DropDownItem
            onClick={() => {
              editor.dispatchCommand(INSERT_TABLE_COMMAND, {
                columns: "3",
                rows: "3",
              });
            }}
            className="item"
          >
            <i className="icon table" />
            <span className="text">Table</span>
          </DropDownItem>
          <DropDownItem
            onClick={() => {
              const tweetId = prompt("Enter Tweet ID:");
              if (tweetId) {
                editor.dispatchCommand(INSERT_TWEET_COMMAND, tweetId);
              }
            }}
            className="item"
          >
            <i className="icon tweet" />
            <span className="text">X(Tweet)</span>
          </DropDownItem>
          <DropDownItem
            onClick={() => {
              const videoId = prompt("Enter YouTube Video ID:");
              if (videoId) {
                editor.dispatchCommand(INSERT_YOUTUBE_COMMAND, videoId);
              }
            }}
            className="item"
          >
            <i className="icon youtube" />
            <span className="text">YouTube Video</span>
          </DropDownItem>
          <DropDownItem
            onClick={() => {
              editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                  const codeNode = $createCodeNode();
                  selection.insertNodes([codeNode]);
                }
              });
            }}
            className="item"
          >
            <i className="icon code" />
            <span className="text">Code Block</span>
          </DropDownItem>
          <DropDownItem
            onClick={() => {
              editor.dispatchCommand(INSERT_TEMPLATE_COMMAND, {
                templateId: "contact-support",
              });
            }}
            className="item"
          >
            <i className="icon template" />
            <span className="text">Theme 1 - Contact Support</span>
          </DropDownItem>
        </DropDown>
      </div>
    </>
  );
}
