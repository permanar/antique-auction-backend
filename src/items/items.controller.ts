import { Item, ItemDocument } from './schemas/item.schemas';
import { CreateItemDto } from './dto/create-item.dto';
import {
  Body,
  Controller,
  Post,
  Get,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
import { ItemsService } from './items.service';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  async create(@Body() data: CreateItemDto): Promise<Item> {
    return this.itemsService.create(data);
  }

  @Get()
  async findAll(): Promise<ItemDocument[]> {
    return this.itemsService.findAll();
  }

  @Get(':id')
  async findOne(@Param() data: { id: string }): Promise<ItemDocument> {
    return this.itemsService.findOne(data.id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemsService.remove(+id);
  }

  @Patch('place-bid')
  placeBid(
    @Body()
    data: {
      id_item: string;
      id_bid: string;
      id_user: number;
      price: number;
      name: string;
    },
  ) {
    return this.itemsService.updateBid(data);
    // console.log(data);
  }
}
