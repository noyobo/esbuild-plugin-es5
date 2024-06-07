import React from 'react';
import { createRoot } from 'react-dom/client';

import './index.css';

const App = () => {
  console.warn('Hello World');
  return <div>Hello World</div>;
};

const div = document.createElement('div');
document.body.appendChild(div);

const root = createRoot(div);

root.render(<App />);
