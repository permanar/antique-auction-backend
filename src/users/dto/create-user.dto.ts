// import { IsNumber } from 'class-validator';

type Bids = {
  id_bid: string;
  maxAmount: number;
  bot: boolean;
  alertAmount: number;
};

export class CreateUserDto {
  readonly bids: Bids[];
}
