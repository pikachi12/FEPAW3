'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { hasRole, isLoggedIn, getUserRole } from '@/lib/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Small delay untuk memastikan localStorage ready
    const timer = setTimeout(() => {
      console.log('[ProtectedRoute] Checking authorization...', {
        isLoggedIn: isLoggedIn(),
        allowedRoles,
      });

      // Check if user logged in
      if (!isLoggedIn()) {
        console.log('[ProtectedRoute] Not logged in, redirecting to login');
        router.push('/login');
        return;
      }

      // Check if user has allowed role
      if (!hasRole(allowedRoles)) {
        const userRole = getUserRole();
        console.log('[ProtectedRoute] User role not allowed, redirecting to home', {
          userRole,
          allowedRoles,
        });
        // Redirect to role-based home
        router.push(`/${userRole}`);
        return;
      }

      console.log('[ProtectedRoute] Authorization successful');
      setIsAuthorized(true);
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [router, allowedRoles]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
