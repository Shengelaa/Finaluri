import { Model } from 'mongoose';
import { Order, OrderDocument } from './schema/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { MailService } from '../purchaseemail/purchase.service';
import { UsersService } from '../users/users.service';
export declare class OrdersService {
    private orderModel;
    private mailService;
    private userService;
    constructor(orderModel: Model<OrderDocument>, mailService: MailService, userService: UsersService);
    create(createOrderDto: CreateOrderDto): Promise<Order>;
    findAll(checkRoleDto: {
        id: string;
    }): Promise<Order[]>;
    findOne(id: string): Promise<Order>;
    update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order>;
    remove(id: string): Promise<Order>;
}
