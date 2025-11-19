# Lexical Editor Plugins Implementation Guide

This document outlines what plugins have been implemented and what still needs to be added to match the full [Lexical Playground](https://github.com/facebook/lexical/tree/main/packages/lexical-playground).

## ✅ Completed Infrastructure

### Contexts
- **SettingsContext** - Configuration management for plugin settings
- **SharedHistoryContext** - Shared undo/redo history state

### Custom Nodes
- **ImageNode** - Support for images with captions
- **YouTubeNode** - Embed YouTube videos
- **TweetNode** - Embed tweets  
- **PageBreakNode** - Page break support
- **HorizontalRuleNode** - Horizontal rule dividers

### Plugins Implemented
1. ✅ **HorizontalRulePlugin** - Insert horizontal rules
2. ✅ **PageBreakPlugin** - Insert page breaks
3. ✅ **YouTubePlugin** - Embed YouTube videos
4. ✅ **TwitterPlugin** - Embed tweets
5. ✅ **ImagesPlugin** - Insert and manage images
6. ✅ **DragDropPastePlugin** - Drag & drop file support
7. ✅ **TableCellResizer** - Resize table cells
8. ✅ **MaxLengthPlugin** - Limit editor content length
9. ✅ **ClearEditorPlugin** - Clear editor command
10. ✅ **ClickableLinkPlugin** - Make links clickable
11. ✅ **FloatingTextFormatToolbarPlugin** - Floating format toolbar (basic)

### Built-in Lexical Plugins Already in Use
- AutoFocusPlugin
- CheckListPlugin  
- HashtagPlugin
- HistoryPlugin
- ListPlugin
- RichTextPlugin
- TabIndentationPlugin
- TablePlugin
- AutoLinkPlugin
- CodeHighlightPlugin
- LinkPlugin
- MarkdownShortcutPlugin

## 🚧 Plugins Still Needed

To fully match the playground, you'll need to implement these additional plugins:

### High Priority (Common Features)
1. **ActionsPlugin** - Export/import, clear editor actions
2. **ComponentPickerPlugin** - "/" slash command menu
3. **EmojiPickerPlugin** & **EmojisPlugin** - Emoji support
4. **MentionsPlugin** - @ mention autocomplete
5. **FloatingLinkEditorPlugin** - Edit links in a floating popup
6. **DraggableBlockPlugin** - Drag blocks to reorder

### Medium Priority
7. **AutocompletePlugin** - Word/phrase autocomplete
8. **AutoEmbedPlugin** - Auto-detect and embed URLs
9. **KeywordsPlugin** - Highlight keywords
10. **LayoutPlugin** - Column layouts
11. **CollapsiblePlugin** - Collapsible sections
12. **EquationsPlugin** - KaTeX math equations
13. **TableOfContentsPlugin** - Auto table of contents
14. **ContextMenuPlugin** - Custom right-click menu
15. **ShortcutsPlugin** - Keyboard shortcuts

### Advanced Features
16. **ExcalidrawPlugin** - Embed Excalidraw drawings
17. **FigmaPlugin** - Embed Figma designs
18. **PollPlugin** - Create polls
19. **DateTimePlugin** - Date/time picker
20. **SpeechToTextPlugin** - Voice input
21. **CodeActionMenuPlugin** - Code block actions
22. **TableCellActionMenuPlugin** - Table cell context menu
23. **TableHoverActionsPlugin** - Hover actions for tables
24. **SpecialTextPlugin** - Highlight special text patterns
25. **CommentPlugin** - Commenting system
26. **VersionsPlugin** - Version history (requires Yjs)
27. **CollaborationPlugin** - Real-time collaboration (requires Yjs)

## 📦 Additional Dependencies Needed

For remaining plugins, you may need:

```bash
# For collaboration
npm install @lexical/yjs yjs y-websocket

# For equations  
npm install katex react-katex

# For emojis
npm install emoji-picker-react

# For Excalidraw
npm install @excalidraw/excalidraw
```

## 🎯 How to Add More Plugins

### 1. Get Plugin Source from Playground

Visit the [official playground source](https://github.com/facebook/lexical/tree/main/packages/lexical-playground/src/plugins) and copy the plugin you need.

### 2. Copy Required Nodes

Check if the plugin requires custom nodes from:
`https://github.com/facebook/lexical/tree/main/packages/lexical-playground/src/nodes`

### 3. Copy UI Components

Many plugins depend on UI components from:
`https://github.com/facebook/lexical/tree/main/packages/lexical-playground/src/ui`

### 4. Update nodes/index.ts

Add any new custom nodes to the `PlaygroundNodes` array.

### 5. Update App.tsx

Add the plugin to the `<Editor>` component:

```tsx
import NewPlugin from './plugins/NewPlugin';

// In the Editor component:
<NewPlugin />
```

### 6. Update Theme

Some plugins need theme styles in `ExampleTheme.ts`.

## 🔗 Official Resources

- **Full Playground Source**: https://github.com/facebook/lexical/tree/main/packages/lexical-playground
- **Lexical Documentation**: https://lexical.dev/docs/intro
- **Plugin Examples**: https://github.com/facebook/lexical/tree/main/packages/lexical-playground/src/plugins

## 📝 Current App Structure

```
src/
├── context/
│   ├── SettingsContext.tsx ✅
│   └── SharedHistoryContext.tsx ✅
├── nodes/
│   ├── index.ts ✅
│   ├── ImageNode.tsx ✅
│   ├── YouTubeNode.tsx ✅
│   ├── TwitterNode.tsx ✅
│   ├── HorizontalRuleNode.tsx ✅
│   └── PageBreakNode.tsx ✅
├── plugins/
│   ├── [Existing plugins] ✅
│   ├── HorizontalRulePlugin.tsx ✅
│   ├── PageBreakPlugin.tsx ✅
│   ├── YouTubePlugin.tsx ✅
│   ├── TwitterPlugin.tsx ✅
│   ├── ImagesPlugin.tsx ✅
│   ├── DragDropPastePlugin.tsx ✅
│   ├── TableCellResizer.tsx ✅
│   ├── MaxLengthPlugin.tsx ✅
│   ├── ClearEditorPlugin.tsx ✅
│   ├── ClickableLinkPlugin.tsx ✅
│   └── FloatingTextFormatToolbarPlugin.tsx ✅
└── App.tsx ✅ (Updated with new structure)
```

## 🚀 Next Steps

1. **Test Current Implementation**: Run `npm run dev` to see the editor with current plugins
2. **Pick Plugins by Priority**: Start with ComponentPickerPlugin (slash commands) and MentionsPlugin 
3. **Copy from Official Source**: Download plugin files from the playground repo
4. **Adapt as Needed**: Some plugins may need simplification for your use case
5. **Add Gradually**: Test each plugin before adding the next

## 💡 Tips

- The official playground is the best reference - copy plugins directly from there
- Most complex plugins have dependencies on UI components
- Start with simpler plugins before tackling collaboration/equations
- Use the Settings Context to enable/disable plugins
- Check the playground's package.json for required dependencies

---

**Note**: This is a comprehensive foundation. The full playground has 40+ plugins and would require copying significant additional code. Focus on the plugins you actually need for your use case!

