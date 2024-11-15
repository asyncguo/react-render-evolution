import {Suspense} from 'react'

import Header from './Header.js'
import Sidenav from './Sidenav.js'
import MainContent from './MainContent.js'
import KeepState from './KeepState.js'
import Spinner from './Spinner.js'

export default async function App({version}) {
  return (
    <div className="app">
      <Header version={version}/>
      <KeepState />
      <div className='main'>
        <Sidenav version={version} />
        <Suspense fallback={<Spinner />}>
          <MainContent />
        </Suspense>
      </div>
    </div>
  );
}
