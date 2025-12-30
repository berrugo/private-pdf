# PrivatePDF Internationalization (i18n) Setup

## Overview
PrivatePDF now supports multiple languages using **react-i18next**. Currently supported languages:
- **English (en)** - Default
- **Spanish (es)**

## Architecture

### File Structure
```
src/
├── i18n.js                          # i18next configuration
├── locales/
│   ├── en/
│   │   └── translation.json         # English translations
│   └── es/
│       └── translation.json         # Spanish translations
└── components/
    ├── LanguageSwitcher.jsx         # Language toggle component
    └── LanguageSwitcher.css         # Switcher styles
```

### Key Files

#### `src/i18n.js`
Initializes i18next with:
- Language detector (checks localStorage, then browser settings)
- Translation resources for all supported languages
- React integration via `react-i18next`

#### `src/locales/{lang}/translation.json`
Hierarchical JSON structure organizing translations by feature:
- `app.*` - Application-level strings
- `nav.*` - Navigation strings
- `landing.*` - Landing page content
- `fileUploader.*` - File upload interface
- `editor.*` - PDF editor interface
- `thumbnailGallery.*` - Thumbnail controls
- `footer.*` - Footer content
- `error.*` - Error messages

### Components

#### LanguageSwitcher
- Displays EN/ES buttons in the navigation bar
- Highlights active language
- Persists selection in localStorage
- Accessible with ARIA labels

## Usage in Components

### Basic Translation
```jsx
import { useTranslation } from 'react-i18next';

function MyComponent() {
    const { t } = useTranslation();
    
    return <h1>{t('app.title')}</h1>;
}
```

### Translation with Variables
```jsx
// Translation key: "editor.pageCount": "{{count}} page"
// With pluralization: "editor.pageCount_plural": "{{count}} pages"
<p>{t('editor.pageCount', { count: numPages })}</p>
```

### Dynamic Translations
```jsx
// For runtime variables
setProcessingStatus(t('editor.progress.compressing', { level: compressionLevel }));
```

## Adding New Languages

1. **Create translation file:**
   ```bash
   cp src/locales/en/translation.json src/locales/fr/translation.json
   ```

2. **Translate content** in the new file

3. **Import in `i18n.js`:**
   ```javascript
   import frTranslation from './locales/fr/translation.json';
   
   const resources = {
     en: { translation: enTranslation },
     es: { translation: esTranslation },
     fr: { translation: frTranslation }, // Add new language
   };
   ```

4. **Add button to LanguageSwitcher.jsx:**
   ```jsx
   <button
       className={`lang-btn ${i18n.language === 'fr' ? 'active' : ''}`}
       onClick={() => changeLanguage('fr')}
   >
       FR
   </button>
   ```

## Translation Keys Organization

### Naming Convention
Use dot notation to organize hierarchically:
- `section.subsection.key`
- Example: `editor.compression.high`

### Pluralization
i18next automatically handles plurals:
```json
{
  "pageCount": "{{count}} page",
  "pageCount_plural": "{{count}} pages"
}
```

### Interpolation
Use double curly braces for variables:
```json
{
  "greeting": "Hello, {{name}}!"
}
```

## Testing Translations

1. **Start dev server:** `npm run dev`
2. **Open app:** http://localhost:5173
3. **Toggle language** using EN/ES buttons in navbar
4. **Verify:**
   - All UI text changes language
   - Selection persists on page reload
   - Pluralization works correctly
   - Variable interpolation displays correctly

## Best Practices

### For Developers
1. **Never hardcode strings** - Always use `t()` function
2. **Organize keys logically** - Group by component/feature
3. **Use descriptive key names** - Make intent clear
4. **Keep translations atomic** - Avoid embedding HTML in translations
5. **Test all languages** - Verify translations work in context

### For Translators
1. **Preserve placeholders** - Keep `{{variable}}` syntax intact
2. **Maintain tone** - Match the app's friendly, privacy-focused voice
3. **Test in UI** - Ensure translations fit in available space
4. **Consider plurals** - Add `_plural` variants where needed

## Performance Considerations

- Translations are imported statically (tree-shakable)
- Language detection runs once on mount
- No external API calls (all translations bundled)
- localStorage prevents language detection on every load

## Privacy Compliance

- No tracking or analytics for language preferences
- Language selection stored locally only
- No user data transmitted when changing languages

## Future Enhancements

Potential additions:
- Date/time localization
- Number formatting per locale
- RTL (Right-to-Left) language support
- Translation management system integration
- Community-contributed translations
