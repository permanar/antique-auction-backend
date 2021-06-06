import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsGateway } from './items.gateway';
import { ItemsController } from './items.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Item, ItemSchema } from './schemas/item.schemas';
import { Bid, BidSchema } from 'src/bids/schemas/bid.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Item.name, schema: ItemSchema },
      { name: Bid.name, schema: BidSchema },
    ]),
  ],
  providers: [ItemsGateway, ItemsService],
  controllers: [ItemsController],
})
export class ItemsModule {}
