import { createRoot } from 'react-dom/client';
import React from 'react';
import { Root } from './components/Routs/Routers';

createRoot(document.getElementById('root') as HTMLDivElement).render(<Root />);
