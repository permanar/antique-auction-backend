import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

type Bids = {
  id_bid: string;
  maxAmount: number;
  bot: boolean;
  alertAmount: number;
};

export class UpdateUserDto extends PartialType(CreateUserDto) {
  readonly bids: Bids[];
}
