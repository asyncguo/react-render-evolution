'use client';
import {
  createContext,
  startTransition,
  useContext,
  useState,
  use,
} from 'react';
import {
  createFromFetch,
  createFromReadableStream
} from 'react-server-dom-webpack/client';

const RouterContext = createContext();
const initialCache = new Map();

const ReactVersions = [
  { name: 'react v18', value: 18 },
  { name: 'react v19', value: 19 },
]

export function Router() {
  const [currentVersion, setCurrentVersion] = useState(18);
  

  const [cache, setCache] = useState(initialCache);
  const [location, setLocation] = useState({
    selectedId: null,
    isEditing: false,
    searchText: '',
  });

  let content = cache.get(currentVersion);
  if (!content) {
    content = createFromFetch(
      fetch('/react?version=' + currentVersion)
        .then(response => {
          // TODO: test stream reader
          const stream = response.clone().body
          const reader = stream.getReader()

          reader
            .read()
            .then(({done,value}) => {
              // console.log('done', done);
              console.log('value', value);

              const decoder = new TextDecoder();
              const text = decoder.decode(new Uint8Array(value.slice(0,100)))
              console.log('text', text);
            })
            .catch((error => {
              console.log('reader error', error);
            }));
          return response
        })
    );
    cache.set(currentVersion, content);
  }

  return (
    <RouterContext.Provider value={{}}>
      <p>current version</p>

      {
        ReactVersions.map(item => {
          return (
            <button
              key={item.value}
              onClick={() => {
                setCurrentVersion(item.value)
              }}
            >{item.name}</button>
          )
        })
      }

      <hr />

      {use(content)}
    </RouterContext.Provider>
  )
}
