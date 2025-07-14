import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Product } from './schema/product.schema';
import { IsAuthGuard } from 'src/auth/guards/isAuth.guard';
import { UsersService } from 'src/users/users.service';
import { AuthService } from 'src/auth/auth.service';

UseGuards(IsAuthGuard);
@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('product') private productModel: Model<Product>,
    private readonly cloudinaryService: CloudinaryService,
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  async create(
    { title, desc, price, quantity, category }: CreateProductDto,
    file?: Express.Multer.File,
    userId?: string,
  ) {
    if (!userId) {
      throw new BadRequestException('Authorization token is required');
    }

    const user = await this.authService.getCurrentUser(userId);
    if (!user || user.role !== 'admin') {
      throw new BadRequestException(
        'You are not authorized to create products',
      );
    }
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
    userId?: String,
  ) {
    if (!userId) {
      throw new BadRequestException('Authorization token is required');
    }
    const user = await this.authService.getCurrentUser(userId);
    if (!user || user.role !== 'admin') {
      throw new BadRequestException(
        'You are not authorized to update products',
      );
    }
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

  async remove(id: string, userId: string) {
    console.log(userId);
    if (!userId) {
      throw new BadRequestException('Authorization token is required');
    }

    const user = await this.authService.getCurrentUser(userId);
    console.log('userrr', user);

    if (!user || user.role !== 'admin') {
      throw new BadRequestException(
        'You are not authorized to delete products',
      );
    }

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
