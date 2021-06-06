import { PartialType } from '@nestjs/mapped-types';
import { CreateItemDto } from './create-item.dto';

type CurrentBid = {
  id_user: number;
  name: string;
  price: number;
};

export class UpdateItemDto extends PartialType(CreateItemDto) {
  id: number;
  readonly _id: number;
  readonly name: string;
  readonly desc: string;
  readonly price: number;
  readonly image: [];
  readonly current_bid: CurrentBid;
  readonly id_bid: number;
}
