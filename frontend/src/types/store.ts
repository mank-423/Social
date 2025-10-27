import type { Socket } from "socket.io-client";
import type { LoginUser, UpdateUser, userType } from "./auth";
import type { messageStructure } from "./message";
import type { AxiosResponse } from "axios";

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
  socket: Socket | null;
  privateKey: string | null;

  checkAuth: () => Promise<void>;
  signUp: (data: userType) => Promise<void>;
  logOut: () => Promise<void>;
  logIn: (data: LoginUser) => Promise<void>;
  updateProfile: (data: UpdateUser) => Promise<void>;
  refresh: () => Promise<string | null>;

  connectSocket: () => void;
  disconnectSocket: () => void;
  keysCheckAndGenerate: () => Promise<{ publicKey: string, privateKey: string }>;
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
  typingUsers: string[]; // Typing indicators state

  // Message functions
  subscribeToMessages: () => void;
  unsubscribeToMessages: () => void;
  setSelectedUser: (data: AuthUser | null) => void;
  getUsers: (page: number) => Promise<AxiosResponse<any, any> | void>;
  getMessages: (userId: string) => Promise<void>;
  sendMessages: (messageData: any) => Promise<void>;
  retryMessages: (messageData: any) => Promise<void>;
  queueMessages: (messageData: any) => void;
  processQueueMsg: () => Promise<void>;
  clearQueue: () => void;

  // Typing functions
  startTyping: () => void;
  stopTyping: () => void;
  setTypingUser: (userId: string, isTyping: boolean) => void;
}