import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

export type ItemDocument = Item & Document;

type CurrentBid = {
  id_user: number;
  name: string;
  price: number;
};

@Schema({ timestamps: true })
export class Item {
  @Prop({ required: true })
  name: string;

  @Prop()
  desc: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  image: string[];

  @Prop({ required: true, type: Map })
  current_bid: CurrentBid;

  @Prop({ required: true })
  id_bid: string;
}

export const ItemSchema = SchemaFactory.createForClass(Item);
