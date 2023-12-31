import { Document } from 'mongoose';

export interface User extends Document {
  readonly username: string;
  readonly password: string;
  readonly role: string;
  readonly refresh_token?: string;
}
