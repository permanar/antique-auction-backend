import { Bid, BidDocument } from './../bids/schemas/bid.schema';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientSession, Model, Mongoose } from 'mongoose';
import { RedisService } from 'nestjs-redis';
import { CreateItemDto } from './dto/create-item.dto';
import { Item, ItemDocument } from './schemas/item.schemas';
import { ItemsGateway } from './items.gateway';

type UpdateBidType = {
  id_item: string;
  id_bid: string;
  id_user: number;
  price: number;
  name: string;
};

@Injectable()
export class ItemsService {
  constructor(
    @InjectModel(Item.name) private readonly itemModel: Model<ItemDocument>,
    @InjectModel(Bid.name) private readonly bidModel: Model<BidDocument>,
    private readonly redisService: RedisService,
    private readonly itemsGateway: ItemsGateway,
  ) {}

  private logger: Logger = new Logger('ItemsService');

  async create(createItemDto: CreateItemDto): Promise<Item> {
    const createdItem = new this.itemModel(createItemDto);

    return createdItem.save();
  }

  findAll() {
    return this.itemModel.find().exec();
  }

  findOne(id: string) {
    return this.itemModel.findById(id).exec();
  }

  update(id: number) {
    this.logger.log(`This action updates a #${id} item`);
    console.log(id);
  }

  remove(id: number) {
    return `This action removes a #${id} item`;
  }

  async updateBid(data: UpdateBidType): Promise<any> {
    // Get latest bidder
    // const  bidder = this.findOne()

    // if()

    // Start a session.
    const session = await this.itemModel.db.startSession();

    try {
      this.updateBidInfo(data, session);
      return {
        isSuccess: true,
        data: {
          id_user: data.id_user,
          name: data.name,
          price: data.price,
        },
      };
    } catch (error) {
      this.logger.error('Update cannot be executed.');
      this.logger.debug(error);
      throw error;
    } finally {
      session.endSession();
    }
  }

  async updateBidInfo(
    data: UpdateBidType,
    session: ClientSession,
  ): Promise<any> {
    const { id_item, id_bid, price, name, id_user } = data;
    // Init redis services
    const redisClient = this.redisService.getClient();
    // Increment while getting the key using redis feature
    const incrMyKey = await redisClient.incr('bidQueue');

    if (incrMyKey == 1) {
      // When concurrent event is happening and they got the first number.
      // proceed to accept the bid and reset the number by 0
      redisClient.set('bidQueue', 0);

      try {
        session.withTransaction(
          async () => {
            await this.itemModel
              .updateOne(
                { _id: this.itemModel.base.Types.ObjectId(id_item) },
                {
                  current_bid: { id_user, name, price },
                  $currentDate: { updatedAt: { $type: 'timestamp' } },
                },
              )
              .exec();

            await this.bidModel
              .updateOne(
                { _id: this.bidModel.base.Types.ObjectId(id_bid) },
                { $push: { data: [{ id_user, name, price }] } },
              )
              .exec();
          },
          {
            readPreference: 'primary',
            readConcern: { level: 'local' },
            writeConcern: { w: 'majority' },
          },
        );

        // Broadcast to websocket
        this.itemsGateway.wss.emit('latestBidClient', price);

        // Log
        this.logger.log(`Bid attempted. Latest Current Bid: ${price}`);
        this.logger.log(`Redis mykey: ${incrMyKey}`);
      } catch (error) {
        // Abourt transaction when catch an error
        this.logger.error('Caught exception during transaction, aborting.');
        await session.abortTransaction();
        throw error;
      }

      this.commitWithRetry(session);
    } else {
      // When concurrent event being happen and they were not the first
      // bid is not going to happen
      this.logger.warn(
        `There are many people bidding at the same time but you were not the first one! Sorry!`,
      );
    }
    this.logger.log(`Latest Current Bid: ${incrMyKey}`);
  }

  async commitWithRetry(session: ClientSession): Promise<void> {
    while (true) {
      try {
        await session.commitTransaction(); // Uses write concern set at transaction start.
        this.logger.log('Transaction committed.');
        break;
      } catch (error) {
        // Can retry commit
        if (
          error.hasOwnProperty('errorLabels') &&
          error.errorLabels.includes('UnknownTransactionCommitResult')
        ) {
          this.logger.warn(
            'UnknownTransactionCommitResult, retrying commit operation ...',
          );
          continue;
        } else {
          this.logger.error('Error during commit ...');
          throw error;
        }
      }
    }
  }
}
