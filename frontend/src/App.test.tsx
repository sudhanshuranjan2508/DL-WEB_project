import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app title', () => {
  render(<App />);
  const titleElement = screen.getByText(/AI-Powered Exam Entry System/i);
  expect(titleElement).toBeInTheDocument();
});
