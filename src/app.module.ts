import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisModule } from 'nestjs-redis';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ItemsModule } from './items/items.module';
import { ItemsService } from './items/items.service';
import { BidsModule } from './bids/bids.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      `mongodb://${process.env.DATABASE_USER}:${process.env.DATABASE_PASS}@cluster0-shard-00-00.g2dkw.mongodb.net:27017,cluster0-shard-00-01.g2dkw.mongodb.net:27017,cluster0-shard-00-02.g2dkw.mongodb.net:27017/${process.env.DATABASE_NAME}?ssl=true&replicaSet=atlas-xg7d46-shard-0&authSource=admin&retryWrites=true&w=majority`,
    ),
    RedisModule.register({
      host: 'redis-19851.c1.ap-southeast-1-1.ec2.cloud.redislabs.com',
      port: 19851,
      password: 'swXwRG8cAM22sxppEh9rABHcLGDnbMNR',
    }),
    ItemsModule,
    BidsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

// Items

// {
//     "name": "Lot 4436: A Belgian made pinfire revolver",
//     "desc": "pre 1900, serial #3, calibre 7mm, 18cm L",
//     "price": 30,
//     "image": ["asdasd/asd122.jpg", "asdasd/asd11.jpg"],
//     "current_bid": 30,
//     "id_bid": {
//         "$numberInt": "3"
//     }
// }

// Bids

// {
//     "entity_id": {
//         "$numberInt": "2"
//     },
//     "_id_item": {
//         "$oid": "60b516bad653dc42dd185534"
//     },
//     "data": [{
//         "name": "Max",
//         "price": {
//             "$numberInt": "33"
//         }
//     }, {
//         "name": "Sam",
//         "price": {
//             "$numberInt": "45"
//         }
//     }, {
//         "name": "John",
//         "price": {
//             "$numberInt": "56"
//         }
//     }, {
//         "name": "Solus",
//         "price": {
//             "$numberInt": "66"
//         }
//     }, {
//         "name": "Freddie",
//         "price": {
//             "$numberInt": "70"
//         }
//     }],
//     "created_at": {
//         "$date": {
//             "$numberLong": "1622452822000"
//         }
//     },
//     "modified_at": {
//         "$date": {
//             "$numberLong": "1622452822000"
//         }
//     }
// }
