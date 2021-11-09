import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({
  toJSON: {
    //this is to lite the response data
    transform(doc, ret) {
      delete ret.password;
      delete ret.__v;
      delete ret.salt;
      delete ret.createdAt;
      delete ret.updatedAt;
    },
  },
  timestamps: true,
})
export class User {
  @Prop({ unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  address: string;

  @Prop()
  firstName: string;

  @Prop()
  lastName: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ required: true })
  salt: string;

  @Prop()
  verified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
