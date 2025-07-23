"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
const isAuth_guard_1 = require("../auth/guards/isAuth.guard");
const users_service_1 = require("../users/users.service");
const auth_service_1 = require("../auth/auth.service");
(0, common_1.UseGuards)(isAuth_guard_1.IsAuthGuard);
let ProductsService = class ProductsService {
    productModel;
    cloudinaryService;
    usersService;
    authService;
    constructor(productModel, cloudinaryService, usersService, authService) {
        this.productModel = productModel;
        this.cloudinaryService = cloudinaryService;
        this.usersService = usersService;
        this.authService = authService;
    }
    async create({ title, desc, price, quantity, category }, file, userId) {
        if (!userId) {
            throw new common_1.BadRequestException('Authorization token is required');
        }
        const user = await this.authService.getCurrentUser(userId);
        if (!user || user.role !== 'admin') {
            throw new common_1.BadRequestException('You are not authorized to create products');
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
    async findOne(id) {
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid product ID format');
        }
        const findProduct = await this.productModel.findById(id);
        if (!findProduct) {
            throw new common_1.NotFoundException('not found');
        }
        return findProduct;
    }
    async update(id, updateProductDto, file, userId) {
        if (!userId) {
            throw new common_1.BadRequestException('Authorization token is required');
        }
        const user = await this.authService.getCurrentUser(userId);
        if (!user || user.role !== 'admin') {
            throw new common_1.BadRequestException('You are not authorized to update products');
        }
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid product ID format');
        }
        const product = await this.productModel.findById(id);
        if (!product) {
            throw new common_1.NotFoundException('Not Found');
        }
        let imageUrl = product.imageUrl;
        if (file) {
            const uploadResult = await this.cloudinaryService.uploadImage(file);
            imageUrl = uploadResult.secure_url;
        }
        const updated = await this.productModel.findByIdAndUpdate(id, {
            ...updateProductDto,
            imageUrl,
        }, { new: true });
        return updated;
    }
    async remove(id, userId) {
        console.log(userId);
        if (!userId) {
            throw new common_1.BadRequestException('Authorization token is required');
        }
        const user = await this.authService.getCurrentUser(userId);
        console.log('userrr', user);
        if (!user || user.role !== 'admin') {
            throw new common_1.BadRequestException('You are not authorized to delete products');
        }
        if (!mongoose_2.Types.ObjectId.isValid(id)) {
            throw new common_1.BadRequestException('Invalid product ID format');
        }
        const findProduct = await this.productModel.findById(id);
        if (!findProduct) {
            throw new common_1.NotFoundException('no product found with given id');
        }
        const findProductAndDelete = await this.productModel.findByIdAndDelete(id);
        return { message: 'deleted successfully', data: { findProductAndDelete } };
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('product')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        cloudinary_service_1.CloudinaryService,
        users_service_1.UsersService,
        auth_service_1.AuthService])
], ProductsService);
//# sourceMappingURL=products.service.js.map