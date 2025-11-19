/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {JSX} from 'react';

import {createContext, ReactNode, useContext, useMemo, useState} from 'react';

type SettingsContextShape = {
  setOption: (name: string, value: boolean) => void;
  settings: Record<string, boolean>;
};

const Context = createContext<SettingsContextShape>({
  setOption: (name: string, value: boolean) => {
    return;
  },
  settings: {},
});

export const SettingsContext = ({
  children,
}: {
  children: ReactNode;
}): JSX.Element => {
  const [settings, setSettings] = useState({
    disableBeforeInput: false,
    emptyEditor: false,
    hasLinkAttributes: false,
    hasNestedTables: false,
    isAutocomplete: false,
    isCharLimit: false,
    isCharLimitUtf8: false,
    isCodeHighlighted: true,
    isCodeShiki: false,
    isCollab: false,
    isMaxLength: false,
    isRichText: true,
    listStrictIndent: false,
    measureTypingPerf: false,
    overrideTheme: false,
    selectionAlwaysOnDisplay: false,
    shouldAllowHighlightingWithBrackets: false,
    shouldPreserveNewLinesInMarkdown: false,
    shouldUseLexicalContextMenu: false,
    showNestedEditorTreeView: false,
    showTableOfContents: false,
    showTreeView: false,
    tableCellBackgroundColor: true,
    tableCellMerge: true,
    tableHorizontalScroll: true,
    useCollabV2: false,
  });

  const setOption = (setting: string, value: boolean) => {
    setSettings((options) => ({
      ...options,
      [setting]: value,
    }));
  };

  const value = useMemo(
    () => ({
      setOption,
      settings,
    }),
    [settings],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useSettings = (): SettingsContextShape => {
  return useContext(Context);
};

