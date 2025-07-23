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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const order_schema_1 = require("./schema/order.schema");
const purchase_service_1 = require("../purchaseemail/purchase.service");
const users_service_1 = require("../users/users.service");
let OrdersService = class OrdersService {
    orderModel;
    mailService;
    userService;
    constructor(orderModel, mailService, userService) {
        this.orderModel = orderModel;
        this.mailService = mailService;
        this.userService = userService;
    }
    async create(createOrderDto) {
        const createdOrder = new this.orderModel(createOrderDto);
        await this.mailService.sendThankYou(createOrderDto.userEmail, createOrderDto.total);
        return createdOrder.save();
    }
    async findAll(checkRoleDto) {
        const { id } = checkRoleDto;
        if (!id) {
            throw new common_1.ForbiddenException('Forbidden: Admin access required (missing ID).');
        }
        const user = await this.userService.findOne(id);
        if (!user || user.role !== 'admin') {
            throw new common_1.ForbiddenException('Forbidden: Admin access required.');
        }
        console.log(user, user.role);
        return this.orderModel.find().exec();
    }
    async findOne(id) {
        const order = await this.orderModel.findById(id);
        if (!order) {
            throw new common_1.NotFoundException(`Order with id ${id} not found`);
        }
        return order;
    }
    async update(id, updateOrderDto) {
        const updatedOrder = await this.orderModel.findByIdAndUpdate(id, updateOrderDto, { new: true });
        if (!updatedOrder) {
            throw new common_1.NotFoundException(`Order with id ${id} not found`);
        }
        return updatedOrder;
    }
    async remove(id) {
        const deletedOrder = await this.orderModel.findByIdAndDelete(id);
        if (!deletedOrder) {
            throw new common_1.NotFoundException(`Order with id ${id} not found`);
        }
        return deletedOrder;
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(order_schema_1.Order.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        purchase_service_1.MailService,
        users_service_1.UsersService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map