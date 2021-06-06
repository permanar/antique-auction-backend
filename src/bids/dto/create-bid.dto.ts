type Data = {
  id_user: number;
  name: string;
  price: number;
};

export class CreateBidDto {
  readonly data: Data[];

  readonly id_item: string;
}
