/**
 * App Component Tests
 */

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import App from '../App';

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />);
  });

  it('renders navigation', () => {
    render(<App />);
    expect(screen.getByText(/cAI-png/i)).toBeInTheDocument();
  });
});

