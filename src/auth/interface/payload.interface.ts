import { User } from 'src/models/user.schema';

//this will add the type safety to owr payload
export interface JwtPayload {
  email: string;
}
