/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {JSX} from 'react';

import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {$getNodeByKey, $getSelection, $isNodeSelection, COMMAND_PRIORITY_LOW, SELECTION_CHANGE_COMMAND} from 'lexical';
import {useCallback, useEffect, useRef, useState} from 'react';
import {createPortal} from 'react-dom';

import {$isImageNode} from '../nodes/ImageNode';
import ImageUploadModal from '../components/ImageUploadModal';

function ImageActionMenu({
  imageKey,
  onClose,
}: {
  imageKey: string;
  onClose: () => void;
}): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const menuRef = useRef<HTMLDivElement>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState('');

  // Get current image URL
  useEffect(() => {
    editor.getEditorState().read(() => {
      const node = $getNodeByKey(imageKey);
      if ($isImageNode(node)) {
        setCurrentImageUrl(node.getSrc());
      }
    });
  }, [editor, imageKey]);

  const handleChangeImage = useCallback(() => {
    setShowUploadModal(true);
  }, []);

  const handleImageSelected = useCallback((newSrc: string) => {
    editor.update(() => {
      const node = $getNodeByKey(imageKey);
      if ($isImageNode(node)) {
        const writable = node.getWritable();
        writable.__src = newSrc;
        // Ensure consistent sizing - use dimensions that match display
        writable.__width = 300;
        writable.__height = 120;
      }
    });
    setShowUploadModal(false);
    onClose();
  }, [editor, imageKey, onClose]);

  const handleDeleteImage = useCallback(() => {
    // Replace with placeholder instead of deleting
    editor.update(() => {
      const node = $getNodeByKey(imageKey);
      if ($isImageNode(node)) {
        const writable = node.getWritable();
        // Use a people placeholder image
        writable.__src = 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=300&h=120&fit=crop&crop=faces';
        writable.__altText = 'Placeholder - Click to add image';
        writable.__width = 300;
        writable.__height = 120;
      }
    });
    onClose();
  }, [editor, imageKey, onClose]);

  return (
    <>
      <div ref={menuRef} className="image-action-menu">
        <button
          onClick={handleChangeImage}
          className="image-action-button"
          title="Change Image">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
          <span>Change</span>
        </button>
        <button
          onClick={handleDeleteImage}
          className="image-action-button reset"
          title="Reset to Placeholder">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
          </svg>
          <span>Reset</span>
        </button>
      </div>
      
      <ImageUploadModal
        isOpen={showUploadModal}
        onClose={() => {
          setShowUploadModal(false);
          onClose();
        }}
        onImageSelected={handleImageSelected}
        currentImageUrl={currentImageUrl}
      />
    </>
  );
}

export default function ImageActionMenuPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();
  const [selectedImageKey, setSelectedImageKey] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState<{top: number; left: number} | null>(null);

  const updateImageMenu = useCallback(() => {
    editor.getEditorState().read(() => {
      const selection = $getSelection();

      if (!$isNodeSelection(selection)) {
        setSelectedImageKey(null);
        setMenuPosition(null);
        return;
      }

      const nodes = selection.getNodes();
      if (nodes.length === 1 && $isImageNode(nodes[0])) {
        const imageNode = nodes[0];
        const key = imageNode.getKey();
        
        setSelectedImageKey(key);

        // Get the DOM element to position the menu
        const domElement = editor.getElementByKey(key);
        if (domElement) {
          const rect = domElement.getBoundingClientRect();
          setMenuPosition({
            top: rect.bottom + window.scrollY + 10,
            left: rect.left + window.scrollX + rect.width / 2,
          });
        }
      } else {
        setSelectedImageKey(null);
        setMenuPosition(null);
      }
    });
  }, [editor]);

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        updateImageMenu();
        return false;
      },
      COMMAND_PRIORITY_LOW,
    );
  }, [editor, updateImageMenu]);

  useEffect(() => {
    return editor.registerUpdateListener(() => {
      updateImageMenu();
    });
  }, [editor, updateImageMenu]);

  if (!selectedImageKey || !menuPosition) {
    return null;
  }

  return createPortal(
    <div
      style={{
        position: 'absolute',
        top: `${menuPosition.top}px`,
        left: `${menuPosition.left}px`,
        transform: 'translateX(-50%)',
        zIndex: 100,
      }}>
      <ImageActionMenu
        imageKey={selectedImageKey}
        onClose={() => {
          setSelectedImageKey(null);
          setMenuPosition(null);
        }}
      />
    </div>,
    document.body,
  );
}

