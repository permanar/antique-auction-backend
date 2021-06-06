type CurrentBid = {
  id_user: number;
  name: string;
  price: number;
};

export class CreateItemDto {
  readonly name: string;
  readonly desc: string;
  readonly price: number;
  readonly image: string[];
  readonly current_bid: CurrentBid;
  readonly id_bid: number;
}
