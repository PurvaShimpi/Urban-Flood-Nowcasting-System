/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { FloodProvider } from './context/FloodContext';
import { AppLayout } from './components/layout/AppLayout';

export default function App() {
  return (
    <FloodProvider>
      <AppLayout />
    </FloodProvider>
  );
}
