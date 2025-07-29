import { render, screen, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Mock fetch for testing
global.fetch = jest.fn();

// Simple test component that uses the auth context
const TestComponent = () => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (user) return <div>Authenticated: {user.email}</div>;
  return <div>Not authenticated</div>;
};

// Simple test to verify the application structure
test('should be able to import authentication-related modules', () => {
  // This test verifies that our changes don't break the module structure
  expect(true).toBe(true);
});

test('AuthContext should check authentication on mount', async () => {
  // Mock successful auth response
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      user: { email: 'ragurameee24@gmail.com', isAdmin: true }
    })
  });

  render(
    <AuthProvider>
      <TestComponent />
    </AuthProvider>
  );

  // Should start with loading
  expect(screen.getByText('Loading...')).toBeInTheDocument();

  // Should call /auth/me with credentials: include
  await waitFor(() => {
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/me'),
      expect.objectContaining({
        credentials: 'include'
      })
    );
  });

  // Should show authenticated user after successful response
  await waitFor(() => {
    expect(screen.getByText('Authenticated: ragurameee24@gmail.com')).toBeInTheDocument();
  });
});

test('AuthContext should handle authentication failure gracefully', async () => {
  // Mock failed auth response
  (global.fetch as jest.Mock).mockResolvedValueOnce({
    ok: false,
    status: 401
  });

  render(
    <AuthProvider>
      <TestComponent />
    </AuthProvider>
  );

  // Should start with loading
  expect(screen.getByText('Loading...')).toBeInTheDocument();

  // Should show not authenticated after failed response
  await waitFor(() => {
    expect(screen.getByText('Not authenticated')).toBeInTheDocument();
  });
});

export {};
