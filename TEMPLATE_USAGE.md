# Template System in Lexical Editor

## 🎉 What's Been Implemented

You now have a fully functional **template system** in your Lexical editor!

### How to Use

1. **Click "Insert" in the toolbar**
2. **Select "Theme 1 - Contact Support"** from the dropdown
3. **The template will be inserted into your document!**

### Features

✅ **Contact Support Template** - Professional team showcase with:
- Header section with title and description
- "Contact Us" button
- 4 team member cards with photos, names, and roles
- Beautiful gradient background (purple to blue)
- Responsive grid layout
- Hover effects on cards

### Template Structure

The template includes:
- **Adre** - For the data science behind MasterMIND
- **Jennifer Liang** - For business related queries contact
- **Benjamin Ofori** - Project management and product roadmap
- **Lenart Gregolique** - Customer Support

### Customization

You can easily customize the template by editing:

**File**: `src/nodes/TemplateNode.tsx`

```tsx
const teamMembers = [
  {
    name: 'Your Name',
    role: 'Your Role',
    image: 'https://your-image-url.com',
  },
  // Add more team members...
];
```

### Creating New Templates

To add more templates (Theme 2, Theme 3, etc.):

1. **Add template ID check** in `TemplateNode.tsx`:
```tsx
function TemplateComponent({templateId, nodeKey}) {
  if (templateId === 'contact-support') {
    return <ContactSupportTemplate />;
  }
  if (templateId === 'theme-2') {
    return <YourNewTemplate />;
  }
  // ...
}
```

2. **Create your new template component**:
```tsx
function YourNewTemplate() {
  return (
    <div className="template-your-name">
      {/* Your template content */}
    </div>
  );
}
```

3. **Add to toolbar** in `ToolbarPlugin.tsx`:
```tsx
<DropDownItem
  onClick={() => {
    editor.dispatchCommand(INSERT_TEMPLATE_COMMAND, {
      templateId: 'theme-2',
    });
  }}
  className="item"
>
  <i className="icon template" />
  <span className="text">Theme 2 - Your Template</span>
</DropDownItem>
```

4. **Add CSS styles** in `styles.css`:
```css
.template-your-name {
  /* Your template styles */
}
```

### Template Ideas

Here are more template ideas you can implement:

1. **Newsletter Template** - Email-style layout with sections
2. **Product Showcase** - Grid of products with images and prices
3. **Pricing Table** - Comparison table with plans
4. **FAQ Section** - Accordion-style Q&A
5. **Testimonials** - Customer reviews with ratings
6. **Timeline** - Event timeline with dates
7. **Feature Comparison** - Side-by-side comparison
8. **Stats Dashboard** - Key metrics display
9. **Call to Action** - Hero section with CTA button
10. **Blog Post Layout** - Article template with header/body

### Files Modified

- ✅ `src/nodes/TemplateNode.tsx` - Template node and component
- ✅ `src/plugins/TemplatesPlugin.tsx` - Plugin to handle insertion
- ✅ `src/nodes/index.ts` - Registered TemplateNode
- ✅ `src/App.tsx` - Added TemplatesPlugin
- ✅ `src/plugins/ToolbarPlugin.tsx` - Added to Insert menu
- ✅ `src/styles.css` - Template styles

### Technical Details

**Node Type**: DecoratorNode (renders React components)
**Plugin**: Command-based insertion system
**Styling**: CSS with gradient backgrounds, grid layouts, and hover effects
**Images**: Using pravatar.cc for placeholder avatars

---

**Enjoy your new template system! 🚀**
