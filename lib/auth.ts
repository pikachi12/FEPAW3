export interface UserInfo {
  id: string;
  email: string;
  role: string;
  name?: string;
  isVerified?: boolean;
}

export function getUserInfo(): UserInfo | null {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('user');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr) as UserInfo;
  } catch (error) {
    console.error('Failed to parse user info:', error);
    return null;
  }
}

export function getUserRole(): string | null {
  const user = getUserInfo();
  return user?.role || null;
}

export function isLoggedIn(): boolean {
  return !!getUserInfo();
}

export function hasRole(allowedRoles: string[]): boolean {
  const role = getUserRole();
  return role ? allowedRoles.includes(role) : false;
}

export function logout() {
  localStorage.removeItem('user');
  // Token cookie akan dihapus oleh backend saat logout endpoint dipanggil
}

