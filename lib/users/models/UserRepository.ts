import { FindUserDto } from "./FindUserDto";
import {UserSchema} from "@/lib/users/models/UserSchema";

export interface UserRepository {
  getUserByPhone(phone: string): Promise<FindUserDto | null>
  createUser(user: UserSchema): Promise<string>
  updateUserBusiness(userId: string, businessId: string): Promise<string>
}