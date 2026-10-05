import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import AuthService from './service/AuthService';

// This suite covers routing/authentication, not the D3 renderer (a separate boundary).
jest.mock('./components/canvas/GraphCanvas', () => () => null);
jest.mock('./service/AuthService');

test('a guest opening a private route sees the login form', async () => {
  (AuthService.getCurrentUser as jest.Mock).mockResolvedValue(null);
  window.history.replaceState({}, '', '/profile');
  render(<App />);
  await waitFor(() => expect(AuthService.getCurrentUser).toHaveBeenCalled());
  expect(await screen.findByPlaceholderText('email or username')).toBeInTheDocument();
  expect(window.location.pathname).toBe('/login');
});
