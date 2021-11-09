/* eslint-disable prettier/prettier */
import { Role } from 'src/models/role.enum';

//this will add the type safety to owr payload
export interface JwtPayload {
  email: string;
  role: string;
}
