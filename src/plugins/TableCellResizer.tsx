/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {JSX, ReactPortal} from 'react';
import type {LexicalEditor} from 'lexical';

import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {useLexicalEditable} from '@lexical/react/useLexicalEditable';
import * as React from 'react';
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {createPortal} from 'react-dom';

export default function TableCellResizer(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const isEditable = useLexicalEditable();

  return useMemo(
    () =>
      isEditable ? (
        <TableCellResizerPlugin editor={editor} />
      ) : null,
    [editor, isEditable],
  );
}

function TableCellResizerPlugin({
  editor,
}: {
  editor: LexicalEditor;
}): ReactPortal | null {
  const targetRef = useRef<HTMLElement | null>(null);
  const resizerRef = useRef<HTMLDivElement | null>(null);
  const tableRectRef = useRef<DOMRect | null>(null);

  const mouseStartPosRef = useRef<number | null>(null);
  const [mouseCurrentPos, updateMouseCurrentPos] = useState<number | null>(
    null,
  );

  const [activeCell, updateActiveCell] = useState<TableDOMCell | null>(null);
  const [isMouseDown, updateIsMouseDown] = useState<boolean>(false);
  const [isResizing, updateIsResizing] = useState<boolean>(false);

  const resetState = useCallback(() => {
    updateActiveCell(null);
    targetRef.current = null;
    updateIsResizing(false);
    mouseStartPosRef.current = null;
    tableRectRef.current = null;
  }, []);

  useEffect(() => {
    const onMouseMove = (event: MouseEvent) => {
      if (isMouseDown) {
        updateMouseCurrentPos(event.clientX);
        updateIsResizing(true);
      }
    };

    const onMouseUp = () => {
      if (isMouseDown) {
        resetState();
      }
      updateIsMouseDown(false);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [isMouseDown, resetState]);

  const editorRootElement = editor.getRootElement();
  if (editorRootElement === null) {
    return null;
  }

  return createPortal(
    <div ref={resizerRef}>
      {activeCell != null && !isResizing && (
        <>
          <div
            className="TableCellResizer__resizer TableCellResizer__ui"
            style={{
              height: `${activeCell.elem.offsetHeight}px`,
              left: `${activeCell.elem.offsetLeft + activeCell.elem.offsetWidth - 3}px`,
              top: `${activeCell.elem.offsetTop}px`,
            }}
            onMouseDown={() => {
              updateIsMouseDown(true);
              mouseStartPosRef.current = activeCell.elem.getBoundingClientRect().right;
            }}
          />
        </>
      )}
    </div>,
    editorRootElement.parentElement!,
  );
}

type TableDOMCell = {
  elem: HTMLElement;
  highlighted: boolean;
};

