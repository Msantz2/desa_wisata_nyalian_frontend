'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LoginCard, LoginForm } from '@/components/admin/auth';

export default function LoginPage() {
  const [error, setError] = useState<string | undefined>();
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check', {
          method: 'GET',
        });

        if (response.ok) {
          router.push('/admin/dashboard');
        }
      } catch (err) {
        console.error('[AUTH] Check failed:', err);
      } finally {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogin = async (username: string, password: string) => {
    setError(undefined);

    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      router.push('/admin/dashboard');
    } else {
      const errorData = await response.json();
      setError(errorData.error || 'Login failed');
    }
  };

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <LoginCard>
      <LoginForm onSubmit={handleLogin} error={error} />
    </LoginCard>
  );
}
