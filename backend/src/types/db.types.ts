import { Types } from "mongoose";

export interface IUser extends Document {
  email: string;
  fullName: string;
  password: string;
  profileUrl?: string;
  _id: Types.ObjectId;
}