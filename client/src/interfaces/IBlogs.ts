import { IUser } from "./IUser";

export interface IBlog {
  id?: number;
  title: string;
  thumbnail: string;
  content: string;
  slug: string;
  status: boolean;
  user_id: number;
  is_active: boolean;
  created_at:string
  updated_at:string
  user:IUser
}
