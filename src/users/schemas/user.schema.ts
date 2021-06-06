import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

type Bids = {
  id_bid: string;
  maxAmount: number;
  bot: boolean;
  alertAmount: number;
};

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  bids: Bids[];

  // @Prop()
}

export const UserSchema = SchemaFactory.createForClass(User);
