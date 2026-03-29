import './bootstrap';
import '../css/app.css';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import AppRouter from './router';

const container = document.getElementById('app');
const root = createRoot(container);

root.render(
    <BrowserRouter>
        <AppRouter />
    </BrowserRouter>
);
