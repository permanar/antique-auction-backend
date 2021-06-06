import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Mongoose } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { DataAutoBid } from './users.controller';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  create(createUserDto: CreateUserDto) {
    const createdUser = new this.userModel(createUserDto);

    return createdUser.save();
  }

  findAll() {
    return this.userModel.find().exec();
  }

  findOne(id: string) {
    return this.userModel.findById(id).exec();
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return this.userModel.findOneAndRemove({ id }).exec();
  }

  async autoBidding(data: DataAutoBid): Promise<any> {
    const { _id, id_bid, maxAmount, bot, alertAmount } = data;

    // Find if any record existing
    const find = await this.userModel.find({
      _id: new Mongoose().Types.ObjectId(_id),
      'bids.id_bid': id_bid,
    });

    // If record is found it will return object
    // Otherwise, it would return empty array
    if (find.length == 0) {
      // Adding a new auto-bid bot config
      return this.userModel.updateOne(
        { _id: new Mongoose().Types.ObjectId(_id) },
        {
          $addToSet: { bids: [{ id_bid, maxAmount, bot, alertAmount }] },
        },
      );
    } else {
      // Updating existing auto-bid bot config
      return this.userModel.updateOne(
        { _id: new Mongoose().Types.ObjectId(_id), 'bids.id_bid': id_bid },
        {
          $set: {
            'bids.$.id_bid': id_bid,
            'bids.$.maxAmount': maxAmount,
            'bids.$.bot': bot,
            'bids.$.alertAmount': alertAmount,
          },
        },
      );
    }
  }
}
