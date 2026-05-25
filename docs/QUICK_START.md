# ⚡ Quick Start - Import Your Code

This is the **fastest way** to get your existing code into Forge's structure.

## 🎯 5-Minute Setup

### 1. Clone & Install
```bash
git clone https://github.com/jaredbridges90-eng/forge.git
cd forge
npm install
```

### 2. Create Your Code Directories
```bash
# Create placeholder directories for your code
mkdir -p packages/shared/src/utils
mkdir -p packages/ai/src
mkdir -p apps/web/pages
mkdir -p apps/mobile/screens
```

### 3. Import Your Code - Three Options

#### Option A: Copy-Paste (Easiest for small amounts)
1. Open your source files
2. Copy content
3. Paste into corresponding Forge files
4. Update imports to use aliases

#### Option B: Move Files (Best for organized code)
```bash
# If you have base64 helpers
cp ~/your-code/utils/base64.js packages/shared/src/utils/base64.ts

# If you have ChatGPT code
cp ~/your-code/ai/chat.js packages/ai/src/chat.ts
```

#### Option C: Git Import (If in GitHub)
```bash
# Add your repo as upstream
git remote add upstream https://github.com/your-account/your-repo.git

# Fetch their code
git fetch upstream main

# Cherry-pick specific files
git checkout upstream/main -- path/to/file
```

## 📂 Where to Put Each Type of Code

### Your Base64 & Encoding Code
```
Your file location          →  Forge location
─────────────────              ──────────────────────────────
src/utils/base64.js        →   packages/shared/src/utils/encoding.ts
src/helpers/encode.js      →   packages/shared/src/utils/encoding.ts
```

**Example - Before & After:**

```javascript
// BEFORE: src/utils/base64.js
export function encodeBase64(str) {
  return Buffer.from(str).toString('base64');
}

// AFTER: packages/shared/src/utils/encoding.ts
export function encodeBase64(str: string): string {
  return Buffer.from(str).toString('base64');
}
```

### Your ChatGPT / AI Code
```
Your file                   →  Forge location
─────────────────────          ────────────────────────
src/api/openai.js          →   packages/ai/src/chat.ts
src/services/gpt.js        →   packages/ai/src/index.ts
src/prompts/system.js      →   packages/ai/src/prompts.ts
```

**Example - ChatGPT integration:**

```javascript
// BEFORE: src/api/openai.js
const axios = require('axios');

export const chat = async (message) => {
  const response = await axios.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-4',
      messages: [{ role: 'user', content: message }]
    },
    { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` } }
  );
  return response.data;
};

// AFTER: packages/ai/src/chat.ts
import OpenAI from 'openai';
import type { Message } from '@shared/types';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const chat = async (message: string): Promise<Message> => {
  const response = await client.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: message }]
  });
  
  return {
    role: 'assistant',
    content: response.choices[0].message.content || ''
  };
};
```

### Your React Components
```
Your file                   →  Forge location
──────────────────────         ─────────────────────────
src/components/Chat.jsx    →   apps/web/components/Chat.tsx
src/pages/home.jsx         →   apps/web/pages/index.tsx
src/screens/Chat.js        →   apps/mobile/screens/Chat.tsx
```

### Your Data Models / Types
```
Your file                   →  Forge location
──────────────────────         ───────────────────────────
src/types/Message.ts       →   packages/shared/src/types/Message.ts
src/models/User.ts         →   packages/shared/src/types/User.ts
src/interfaces/API.ts      →   packages/shared/src/types/api.ts
```

### Your Database Code
```
Your file                   →  Forge location
──────────────────────         ─────────────────────────
src/db/queries.js          →   packages/db/src/queries.ts
src/models/schema.js       →   packages/db/src/schema.sql
src/migrations/001.js      →   packages/db/src/migrations/001.sql
```

## 🔄 Update Imports After Moving

### Before (old paths)
```typescript
import { encodeBase64 } from '../utils/encoding';
import { chat } from '../../services/ai/chat';
import { Message } from '../types';
```

### After (using aliases)
```typescript
import { encodeBase64 } from '@shared/utils/encoding';
import { chat } from '@ai/chat';
import type { Message } from '@shared/types';
```

## ✅ Step-by-Step Import Process

### Step 1: Utilities First (no dependencies)
```bash
# 1. Create the file
mkdir -p packages/shared/src/utils
touch packages/shared/src/utils/encoding.ts

# 2. Copy your code there
# 3. Update imports
# 4. Add TypeScript types

# 5. Export from index
echo "export * from './encoding';" >> packages/shared/src/index.ts

# 6. Test it works
npm run type-check
```

### Step 2: Types (foundation for everything)
```bash
# Create types from your models
mkdir -p packages/shared/src/types
touch packages/shared/src/types/index.ts

# Paste your interfaces/types
# Create TypeScript versions if needed

# Export
echo "export * from './index';" >> packages/shared/src/index.ts
```

### Step 3: AI Logic (self-contained)
```bash
mkdir -p packages/ai/src
touch packages/ai/src/chat.ts
touch packages/ai/src/index.ts

# Copy your ChatGPT code
# Update to use @shared types
# Export from index

npm run type-check
```

### Step 4: Components (depends on above)
```bash
mkdir -p apps/web/components
touch apps/web/components/Chat.tsx

# Copy your React code
# Update imports to use @shared, @ai
# Add TypeScript types

npm run dev
```

## 🧪 Testing Your Import

After each import:

```bash
# Type check
npm run type-check

# Lint
npm run lint

# Try to build
npm run build

# Start dev
npm run dev
```

## 🚨 Common Issues

### "Module not found"
- Check file path is correct
- Check alias in tsconfig.json
- Run `npm install` again

### "Cannot find name X"
- Missing types in `@shared/types`
- Import not exported from index.ts

### "Circular dependency"
- Move shared code to `packages/shared`
- Don't import from apps into packages

## 📋 Checklist

- [ ] Code copied to correct directories
- [ ] Imports updated to use aliases
- [ ] TypeScript types added
- [ ] Code exported from package index
- [ ] `npm run type-check` passes
- [ ] `npm run build` succeeds
- [ ] Dev servers start: `npm run dev`

## 🎓 Detailed Guide

For more detailed migration:
→ Read **[MIGRATION_GUIDE.md](MIGRATION_GUIDE.md)**

## 🚀 Next Steps

Once your code is imported:

1. **Set up database**: docs/SUPABASE_SETUP.md (coming soon)
2. **Connect AI**: Integrate with Supabase
3. **Deploy web**: Push to GitHub → Auto-deploys to Vercel
4. **Build iOS**: `eas build --platform ios`

## 💡 Pro Tips

1. **Use TypeScript gradually** - JavaScript works too at first
2. **Barrel exports** - Export from `index.ts` for clean imports
3. **Test early** - Run `npm run type-check` after each import
4. **Keep packages small** - Easier to maintain and test
5. **Share don't duplicate** - Put everything shared in `packages/`

---

**Stuck?** Open an issue in the repo! 🆘

Ready to code? Start by importing your utilities first, then build upward! 🚀
