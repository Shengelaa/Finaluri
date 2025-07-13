import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Product } from './schema/product.schema';
import { IsAuthGuard } from 'src/auth/guards/isAuth.guard';

UseGuards(IsAuthGuard);
@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('product') private productModel: Model<Product>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async create(
    { title, desc, price, quantity, category }: CreateProductDto,
    file?: Express.Multer.File,
  ) {
    let imageUrl = '';
    if (file) {
      const uploadResult = await this.cloudinaryService.uploadImage(file);
      imageUrl = uploadResult.secure_url;
    }

    const newProduct = await this.productModel.create({
      title,
      desc,
      category,
      quantity,
      price,
      imageUrl,
    });

    return { success: 'ok', data: newProduct };
  }

  async findAll() {
    return this.productModel.find();
  }

  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid product ID format');
    }
    const findProduct = await this.productModel.findById(id);
    if (!findProduct) {
      throw new NotFoundException('not found');
    }
    return findProduct;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    file?: Express.Multer.File,
  ) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid product ID format');
    }
    const product = await this.productModel.findById(id);
    if (!product) {
      throw new NotFoundException('Not Found');
    }

    let imageUrl = product.imageUrl;
    if (file) {
      const uploadResult = await this.cloudinaryService.uploadImage(file);
      imageUrl = uploadResult.secure_url;
    }

    const updated = await this.productModel.findByIdAndUpdate(
      id,
      {
        ...updateProductDto,
        imageUrl,
      },
      { new: true },
    );
    return updated;
  }

  async remove(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid product ID format');
    }
    const findProduct = await this.productModel.findById(id);
    if (!findProduct) {
      throw new NotFoundException('no product found with given id');
    }

    const findProductAndDelete = await this.productModel.findByIdAndDelete(id);
    return { message: 'deleted successfully', data: { findProductAndDelete } };
  }
}
