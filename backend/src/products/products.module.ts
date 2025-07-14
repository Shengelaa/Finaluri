import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { productSchema } from './schema/product.schema';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ schema: productSchema, name: 'product' }]),
    CloudinaryModule,
    UsersModule,
    AuthModule
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
