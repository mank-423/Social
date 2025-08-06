import type { LoginUser, UpdateUser, userType } from "./auth";
import type { messageStructure } from "./message";

export interface AuthUser {
  _id: string;
  fullName: string;
  email: string;
  profilePic?: string,
  createdAt?: string,
  updatedAt?: string,
}



export interface AuthStore {
  authUser: AuthUser | null;
  isCheckingAuth: boolean;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  onlineUsers: Array<string>;

  checkAuth: () => Promise<void>;
  signUp: (data: userType) => Promise<void>;
  logOut: () => Promise<void>;
  logIn: (data: LoginUser) => Promise<void>;
  updateProfile: (data: UpdateUser) => Promise<void>;
}


// Theme store
export interface ThemeStore {
  theme: string;
  setTheme: (theme: string) => void;
}

export interface ContactStore {
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  users: Array<AuthUser>;
  messages: Array<messageStructure>;
  selectedUser: null | AuthUser;
  isMessageSending: boolean;
  setSelectedUser: (data: AuthUser | null) => void;
  getUsers: () => Promise<void>;
  getMessages: (userId: string) => Promise<void>;
  sendMessages: (messageData: any) => Promise<void>;
}