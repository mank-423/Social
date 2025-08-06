import type { LoginUser, UpdateUser, userType } from "./auth";

interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  profilePic?: string,
  createdAt?: string,
  updatedAt?:string,
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
  updateProfile: (data: UpdateUser) => Promise<void>;
}
