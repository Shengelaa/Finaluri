import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(createOrderDto: CreateOrderDto): Promise<import("./schema/order.schema").Order>;
    findAll(id: string): Promise<import("./schema/order.schema").Order[]>;
    findOne(id: string): Promise<import("./schema/order.schema").Order>;
    update(id: string, updateOrderDto: UpdateOrderDto): Promise<import("./schema/order.schema").Order>;
    remove(id: string): Promise<import("./schema/order.schema").Order>;
}
