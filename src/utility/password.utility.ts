/* eslint-disable prettier/prettier */
import * as bcrypt from 'bcrypt';

//this is to generate the salt to hash password
export const GenerateSalt = async () => {
  return await bcrypt.genSalt(10);
};

//this is to hash the password and generate the hash password
export const GeneratePassword = async (password: string, salt: string) => {
  return await bcrypt.hash(password, salt);
};

//to validate the password
export const ValidatePassword = async (
  enteredPassword: string,
  savedPassword: string,
) => {
  return await bcrypt.compare(enteredPassword, savedPassword);
};
