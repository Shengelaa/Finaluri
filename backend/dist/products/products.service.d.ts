import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Model, Types } from 'mongoose';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { Product } from './schema/product.schema';
import { UsersService } from '../users/users.service';
import { AuthService } from '../auth/auth.service';
export declare class ProductsService {
    private productModel;
    private readonly cloudinaryService;
    private readonly usersService;
    private readonly authService;
    constructor(productModel: Model<Product>, cloudinaryService: CloudinaryService, usersService: UsersService, authService: AuthService);
    create({ title, desc, price, quantity, category }: CreateProductDto, file?: Express.Multer.File, userId?: string): Promise<{
        success: string;
        data: import("mongoose").Document<unknown, {}, Product, {}> & Product & {
            _id: Types.ObjectId;
        } & {
            __v: number;
        };
    }>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, Product, {}> & Product & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, Product, {}> & Product & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }>;
    update(id: string, updateProductDto: UpdateProductDto, file?: Express.Multer.File, userId?: String): Promise<(import("mongoose").Document<unknown, {}, Product, {}> & Product & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
    remove(id: string, userId: string): Promise<{
        message: string;
        data: {
            findProductAndDelete: (import("mongoose").Document<unknown, {}, Product, {}> & Product & {
                _id: Types.ObjectId;
            } & {
                __v: number;
            }) | null;
        };
    }>;
}
