/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {hydrateRoot} from 'react-dom/client';
// import App from './src/App';
// hydrateRoot(document.getElementById('root'), <AppStream {...window.__INIT_DATA__} />);

import AppStream from './src/AppStream';

hydrateRoot(document, <AppStream {...window.__INIT_DATA__} />);
