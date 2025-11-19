/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {
  $insertNodeToNearestRoot,
  mergeRegister,
} from '@lexical/utils';
import {
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  LexicalCommand,
} from 'lexical';
import {useEffect} from 'react';

import {$createPageBreakNode} from '../nodes/PageBreakNode';

export const INSERT_PAGE_BREAK_COMMAND: LexicalCommand<void> = createCommand(
  'INSERT_PAGE_BREAK_COMMAND',
);

export default function PageBreakPlugin(): null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        INSERT_PAGE_BREAK_COMMAND,
        () => {
          editor.update(() => {
            const pageBreakNode = $createPageBreakNode();
            $insertNodeToNearestRoot(pageBreakNode);
          });
          return true;
        },
        COMMAND_PRIORITY_EDITOR,
      ),
    );
  }, [editor]);

  return null;
}

