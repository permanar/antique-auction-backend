import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

type Data = {
  id_user: number;
  name: string;
  price: number;
};

export type BidDocument = Bid & Document;

@Schema({ timestamps: true })
export class Bid {
  @Prop({ required: true })
  data: Data[];

  @Prop({ required: true })
  id_item: string;
}

export const BidSchema = SchemaFactory.createForClass(Bid);
