import {Suspense, lazy} from 'react';
import {ErrorBoundary} from 'react-error-boundary';

import Header from './Header';
import Sidenav from './Sidenav';
// import MainContent from './MainContent';
import Spinner from './Spinner';

const MainContent = lazy(() => import('./MainContent.js'))

export default function App({data}) {  
  return (
    <div>
      <ErrorBoundary FallbackComponent={Error}>
        <Header/>

        <div className='main'>
          <Sidenav />

          <Suspense fallback={<Spinner />}>
            <MainContent data={data} />
          </Suspense>
        </div>
      </ErrorBoundary>
    </div>
  );
}

function Error({error}) {
  return (
    <div>
      <h1>Application Error</h1>
      <pre style={{whiteSpace: 'pre-wrap'}}>{error.stack}</pre>
    </div>
  );
}
