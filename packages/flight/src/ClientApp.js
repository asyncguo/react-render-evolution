import { createRoot } from 'react-dom/client';
import { createFromFetch } from 'react-server-dom-webpack/client';
import React, { Suspense, use } from 'react'

const rootEntry = createRoot(document.getElementById('root'))

async function hydrateApp() {
  console.log('hydrateApp ==========');
  
  const root = await createFromFetch(
    fetch('/?rsc', {}),
  )

  console.log('root', root);

  rootEntry.render(root)
}

hydrateApp()
