import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from './schema/user.schema';

@Module({
  imports: [MongooseModule.forFeature([{ schema: userSchema, name: 'users' }])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
