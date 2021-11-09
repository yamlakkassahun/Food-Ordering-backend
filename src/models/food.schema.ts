/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ItemDocument = Food & Document;

@Schema({
  toJSON: {
    //this is to lite the response data
    transform(doc, ret) {
      delete ret.__v;
      delete ret.createdAt;
      delete ret.updatedAt;
    },
  },
  timestamps: true,
})
export class Food {
  @Prop()
  vendorId: string;
  @Prop()
  name: string;
  @Prop()
  description: string;
  @Prop()
  category: string;
  @Prop()
  itemType: string;
  @Prop()
  price: string;
  @Prop({ max: 5, min: 1 })
  rating: number;
  @Prop([String])
  images: string[];
}

export const ItemSchema = SchemaFactory.createForClass(Food);