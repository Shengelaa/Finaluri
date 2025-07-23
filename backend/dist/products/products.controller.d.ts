import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    create(createProductDto: CreateProductDto, file: Express.Multer.File, userId: string): Promise<{
        success: string;
        data: import("mongoose").Document<unknown, {}, import("./schema/product.schema").Product, {}> & import("./schema/product.schema").Product & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        };
    }>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, import("./schema/product.schema").Product, {}> & import("./schema/product.schema").Product & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    })[]>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, import("./schema/product.schema").Product, {}> & import("./schema/product.schema").Product & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    update(id: string, updateProductDto: UpdateProductDto, userId: string, file?: Express.Multer.File): Promise<(import("mongoose").Document<unknown, {}, import("./schema/product.schema").Product, {}> & import("./schema/product.schema").Product & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
    remove(id: string, userId: string): Promise<{
        message: string;
        data: {
            findProductAndDelete: (import("mongoose").Document<unknown, {}, import("./schema/product.schema").Product, {}> & import("./schema/product.schema").Product & {
                _id: import("mongoose").Types.ObjectId;
            } & {
                __v: number;
            }) | null;
        };
    }>;
}
