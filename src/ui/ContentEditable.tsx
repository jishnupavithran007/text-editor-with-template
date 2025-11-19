/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {ContentEditable as LexicalContentEditable} from '@lexical/react/LexicalContentEditable';
import * as React from 'react';

interface ContentEditableProps {
  className?: string;
  placeholder?: string | React.ReactNode;
}

export default function ContentEditable({
  className,
  placeholder,
}: ContentEditableProps): JSX.Element {
  return (
    <LexicalContentEditable
      className={className || 'ContentEditable__root'}
      aria-placeholder={
        typeof placeholder === 'string' ? placeholder : undefined
      }
    />
  );
}

