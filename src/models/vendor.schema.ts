/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Food } from './food.schema';

export type VendorDocument = Vendor & Document;

@Schema({
  toJSON: {
    //this is to lite the response data
    transform(doc, ret) {
      delete ret.code;
      delete ret.password;
      delete ret.__v;
      delete ret.salt;
      delete ret.createdAt;
      delete ret.updatedAt;
    },
  },
  timestamps: true,
})
export class Vendor {
  @Prop()
  name: string;
  @Prop()
  ownerName: string;
  @Prop([String])
  foodType: string[];
  @Prop()
  pincode: string;
  @Prop()
  address: string;
  @Prop()
  phone: string;
  @Prop()
  email: string;
  @Prop()
  emailVerification: boolean;
  @Prop()
  password: string;
  @Prop()
  salt: string;
  @Prop()
  serviceAvailable: boolean;
  @Prop([String])
  coverImages: string[];
  @Prop()
  ratting: string;
  @Prop()
  lat: string;
  @Prop()
  lng: string;
  @Prop()
  code: string;
  @Prop()
  role: string;
  @Prop()
  about: string;
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Food' }] })
  foods: Food[];
}

export const VendorSchema = SchemaFactory.createForClass(Vendor);