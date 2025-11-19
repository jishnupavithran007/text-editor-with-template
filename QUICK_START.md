# Quick Start: Adding More Plugins

## What's Been Done ✅

Your editor now has a **solid foundation** with:

- **Core Infrastructure**: Contexts for settings and shared history
- **Custom Nodes**: Image, YouTube, Twitter, HorizontalRule, PageBreak  
- **11 Custom Plugins**: Images, YouTube, Twitter, DragDrop, PageBreak, HorizontalRule, TableResizer, MaxLength, ClearEditor, ClickableLink, FloatingTextFormatToolbar
- **10+ Built-in Plugins**: Lists, Tables, Markdown, CodeHighlight, Links, History, etc.

## Running Your Editor

```bash
npm run dev
```

Your editor is now running with enhanced capabilities!

## The Full Playground Has 40+ Plugins

Implementing ALL plugins from scratch would require copying 100+ files. Instead, here's the **practical approach**:

### Option 1: Copy Individual Plugins (Recommended)

When you need a specific plugin:

1. **Go to the official playground source**:
   ```
   https://github.com/facebook/lexical/tree/main/packages/lexical-playground/src
   ```

2. **Find the plugin** in `/plugins/` folder

3. **Check dependencies**:
   - Look at the import statements
   - Copy any required nodes from `/nodes/`
   - Copy any UI components from `/ui/`

4. **Copy the files** to your project

5. **Add to your editor**:
   ```tsx
   // In App.tsx
   import NewPlugin from './plugins/NewPlugin';
   
   // In the Editor component:
   <NewPlugin />
   ```

### Option 2: Use the Full Playground

If you need ALL features, consider using the official playground:

```bash
# Clone the Lexical monorepo
git clone https://github.com/facebook/lexical.git
cd lexical

# Install and build
npm install
npm run build

# Run the playground
cd packages/lexical-playground
npm run dev
```

## Top 5 Plugins to Add Next

Based on common use cases, here are the most useful plugins to add:

### 1. ComponentPickerPlugin (Slash Commands)
- **What it does**: Type "/" to open a command menu
- **Files needed**: 
  - `/plugins/ComponentPickerPlugin/`
  - `/ui/Modal.tsx`, `/ui/Button.tsx`

### 2. MentionsPlugin
- **What it does**: @mention autocomplete
- **Files needed**:
  - `/plugins/MentionsPlugin.tsx`
  - `/nodes/MentionNode.tsx`

### 3. FloatingLinkEditorPlugin  
- **What it does**: Edit links in a floating popup
- **Files needed**:
  - `/plugins/FloatingLinkEditorPlugin/`
  - `/ui/LinkPreview.tsx`

### 4. EmojiPickerPlugin
- **What it does**: Emoji selector
- **Files needed**:
  - `/plugins/EmojiPickerPlugin.tsx`
  - `/plugins/EmojisPlugin.tsx`
  - Install: `npm install emoji-picker-react`

### 5. DraggableBlockPlugin
- **What it does**: Drag to reorder blocks
- **Files needed**:
  - `/plugins/DraggableBlockPlugin/`
  - `/ui/Button.tsx`

## Example: Adding ComponentPickerPlugin

Here's how to add the slash command menu:

### Step 1: Copy Files

From the playground repo, copy:
```
/plugins/ComponentPickerPlugin/
  ├── index.tsx
  └── ComponentPickerMenuItem.ts
```

### Step 2: Copy UI Dependencies

```
/ui/
  ├── Modal.tsx
  ├── Button.tsx
  └── Dialog.tsx
```

### Step 3: Add to Your Editor

```tsx
// App.tsx
import ComponentPickerPlugin from './plugins/ComponentPickerPlugin';

// In Editor component
<ComponentPickerPlugin />
```

### Step 4: Test

Type "/" in the editor to see the command menu!

## Plugin Categories

### ✅ Already Implemented (Basic Version)
- Images (with drag & drop)
- YouTube embeds
- Twitter embeds  
- Tables (with resizing)
- Horizontal rules
- Page breaks
- Links (clickable)
- Code highlighting
- Markdown
- Lists & checklists

### 🎯 High Value (Copy Next)
- Slash commands (/)
- @mentions
- Emoji picker
- Link editor popup
- Draggable blocks

### 🚀 Advanced (As Needed)
- Equations (KaTeX)
- Excalidraw drawings
- Collaboration (Yjs)
- Comments
- Polls
- Speech-to-text

## File Structure Reference

```
src/
├── context/          # ✅ Done
│   ├── SettingsContext.tsx
│   └── SharedHistoryContext.tsx
│
├── nodes/            # ✅ Core nodes done
│   ├── ImageNode.tsx
│   ├── YouTubeNode.tsx  
│   ├── TwitterNode.tsx
│   ├── HorizontalRuleNode.tsx
│   ├── PageBreakNode.tsx
│   └── index.ts
│
├── plugins/          # ✅ 11 custom plugins + built-ins
│   ├── [Your current plugins]
│   └── [Copy more here as needed]
│
├── ui/               # ⚠️ Create as needed for new plugins
│   └── ContentEditable.tsx (already exists)
│
└── App.tsx           # ✅ Updated structure
```

## Common Plugin Dependencies

When copying plugins, you'll often need these UI components:

```tsx
// Button.tsx - Reusable button component
// Modal.tsx - Popup modal
// Dialog.tsx - Dialog box
// Dropdown.tsx - Dropdown menu
// Input.tsx - Input field
// Select.tsx - Select dropdown
```

**Pro tip**: Create a `/ui/` folder and copy these common components first.

## Testing Your Plugins

After adding a new plugin:

1. **Check imports**: Ensure all dependencies are copied
2. **Update nodes/index.ts**: Add any new node types
3. **Test in dev**: Run `npm run dev`
4. **Check console**: Look for any errors
5. **Try the feature**: Test the plugin functionality

## Helpful Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Type check
npx tsc --noEmit
```

## Resources

- **Official Playground**: https://playground.lexical.dev/
- **Source Code**: https://github.com/facebook/lexical/tree/main/packages/lexical-playground
- **Documentation**: https://lexical.dev/docs/intro
- **Discord Community**: https://discord.gg/lexicaljs

## Need Help?

1. Check the playground source code - it's the best documentation
2. Look at existing plugin implementations in your project
3. Join the Lexical Discord for community support
4. Check GitHub discussions

---

**Remember**: You don't need ALL 40+ plugins. Start with what you need, test thoroughly, and add more incrementally. The foundation is solid! 🚀

