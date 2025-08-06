export type userType = {
    email: string,
    fullName: string,
    password: string,
    profilePic?: string,
}


export interface LoginUser{
  email: string,
  password: string,
}


export interface UpdateUser{
  profileUrl: string | ArrayBuffer | null,
}