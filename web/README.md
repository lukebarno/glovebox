# Glovebox Web

The website version of Glovebox, built from `project/Glovebox Web.dc.html`. It runs as React + TypeScript + Vite.

```sh
npm install
npm run dev      # local dev server
npm run build    # static site in dist/ (relative paths, so any static host or subfolder works)
```

- Data is saved to `localStorage` under the key `glovebox-web-v1`, the same key the prototype used. Nothing syncs between devices.
- The seed data (taken from Gmail) is in `src/data.ts`. **Reset to email data** puts it back.
- The phone design (`public/app/Glovebox.dc.html` and `support.js`) is the original clickable prototype. It is copied as-is so the **App view →** link works. It loads React from unpkg at runtime.
