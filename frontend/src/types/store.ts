import type { LoginUser, userType } from "./auth";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  // Add any other fields returned by `/auth/check`
}



export interface AuthStore {
  authUser: AuthUser | null;
  isCheckingAuth: boolean;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;

  checkAuth: () => Promise<void>;
  signUp: (data: userType) => Promise<void>;
  logOut: () => Promise<void>;
  logIn: (data: LoginUser) => Promise<void>;
}
