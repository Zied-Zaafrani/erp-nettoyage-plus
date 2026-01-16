import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { User, LoginCredentials, RegisterDto, UserRole } from '@/types';
import { authService } from '@/services';
import { getStoredToken, getStoredUser, clearAuthToken } from '@/services/api';

// ============================================
// TYPES
// ============================================

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (dto: RegisterDto) => Promise<void>;
  logout: () => void;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  refreshUser: () => Promise<void>;
}

// ============================================
// CONTEXT
// ============================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================
// PROVIDER
// ============================================

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from storage
  useEffect(() => {
    const initAuth = async () => {
      const token = getStoredToken();
      const storedUser = getStoredUser<User>();

      if (token && storedUser) {
        try {
          // Verify token is still valid by fetching current user
          const currentUser = await authService.getMe();
          setUser(currentUser);
        } catch {
          // Token is invalid, clear everything
          clearAuthToken();
          setUser(null);
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  // Login handler
  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Register handler
  const register = useCallback(async (dto: RegisterDto) => {
    setIsLoading(true);
    try {
      const response = await authService.register(dto);
      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout handler
  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  // Check if user has required role(s)
  const hasRole = useCallback(
    (roles: UserRole | UserRole[]): boolean => {
      if (!user) return false;

      const roleArray = Array.isArray(roles) ? roles : [roles];
      
      // Role hierarchy based on backend USER_ROLES
      const roleHierarchy: Record<UserRole, number> = {
        SUPER_ADMIN: 10,
        DIRECTOR: 9,
        ASSISTANT: 8,
        SECTOR_CHIEF: 7,
        ZONE_CHIEF: 6,
        TEAM_CHIEF: 5,
        QUALITY_CONTROLLER: 4,
        ACCOUNTANT: 3,
        AGENT: 2,
        CLIENT: 1,
      };

      // Check if user's role is in the allowed roles or has higher privilege
      const userRoleLevel = roleHierarchy[user.role];
      const minRequiredLevel = Math.min(...roleArray.map((r) => roleHierarchy[r]));

      return userRoleLevel >= minRequiredLevel;
    },
    [user]
  );

  // Refresh user data
  const refreshUser = useCallback(async () => {
    if (!getStoredToken()) return;

    try {
      const currentUser = await authService.getMe();
      setUser(currentUser);
    } catch {
      clearAuthToken();
      setUser(null);
    }
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    hasRole,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ============================================
// HOOK
// ============================================

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

// ============================================
// ROLE CONSTANTS
// ============================================

export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN' as UserRole,
  DIRECTOR: 'DIRECTOR' as UserRole,
  ASSISTANT: 'ASSISTANT' as UserRole,
  SECTOR_CHIEF: 'SECTOR_CHIEF' as UserRole,
  ZONE_CHIEF: 'ZONE_CHIEF' as UserRole,
  TEAM_CHIEF: 'TEAM_CHIEF' as UserRole,
  AGENT: 'AGENT' as UserRole,
  QUALITY_CONTROLLER: 'QUALITY_CONTROLLER' as UserRole,
  ACCOUNTANT: 'ACCOUNTANT' as UserRole,
  CLIENT: 'CLIENT' as UserRole,
};

// Translation keys for user roles
export const ROLE_KEYS: Record<UserRole, string> = {
  SUPER_ADMIN: 'users.roles.SUPER_ADMIN',
  DIRECTOR: 'users.roles.DIRECTOR',
  ASSISTANT: 'users.roles.ASSISTANT',
  SECTOR_CHIEF: 'users.roles.SECTOR_CHIEF',
  ZONE_CHIEF: 'users.roles.ZONE_CHIEF',
  TEAM_CHIEF: 'users.roles.TEAM_CHIEF',
  AGENT: 'users.roles.AGENT',
  QUALITY_CONTROLLER: 'users.roles.QUALITY_CONTROLLER',
  ACCOUNTANT: 'users.roles.ACCOUNTANT',
  CLIENT: 'users.roles.CLIENT',
};

export const ROLE_COLORS: Record<UserRole, string> = {
  SUPER_ADMIN: 'bg-purple-100 text-purple-800',
  DIRECTOR: 'bg-indigo-100 text-indigo-800',
  ASSISTANT: 'bg-pink-100 text-pink-800',
  SECTOR_CHIEF: 'bg-blue-100 text-blue-800',
  ZONE_CHIEF: 'bg-cyan-100 text-cyan-800',
  TEAM_CHIEF: 'bg-teal-100 text-teal-800',
  AGENT: 'bg-green-100 text-green-800',
  QUALITY_CONTROLLER: 'bg-amber-100 text-amber-800',
  ACCOUNTANT: 'bg-orange-100 text-orange-800',
  CLIENT: 'bg-gray-100 text-gray-800',
};
