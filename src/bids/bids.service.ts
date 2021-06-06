import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBidDto } from './dto/create-bid.dto';
import { UpdateBidDto } from './dto/update-bid.dto';
import { Bid, BidDocument } from './schemas/bid.schema';

@Injectable()
export class BidsService {
  constructor(
    @InjectModel(Bid.name) private readonly bidModel: Model<BidDocument>,
  ) {}

  create(createBidDto: CreateBidDto) {
    const createdBid = new this.bidModel(createBidDto);

    return createdBid.save();
  }

  findAll() {
    return this.bidModel.find().exec();
  }

  findOne(id: string) {
    return this.bidModel.findById(id).exec();
  }

  update(id: number, updateBidDto: UpdateBidDto) {
    return `This action updates a #${id} bid`;
  }

  remove(id: number) {
    return `This action removes a #${id} bid`;
  }
}
