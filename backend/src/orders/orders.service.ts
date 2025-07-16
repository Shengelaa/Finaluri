import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Order, OrderDocument } from './schema/order.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { MailService } from '../purchaseemail/purchase.service';
import { UsersService } from '../users/users.service';
import { User } from '../users/schema/user.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    private mailService: MailService,
    private userService: UsersService,
  ) {}

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const createdOrder = new this.orderModel(createOrderDto);
    await this.mailService.sendThankYou(
      createOrderDto.userEmail,
      createOrderDto.total,
    );
    return createdOrder.save();
  }

  async findAll(checkRoleDto: { id: string }): Promise<Order[]> {
    const { id } = checkRoleDto;

    if (!id) {
      throw new ForbiddenException(
        'Forbidden: Admin access required (missing ID).',
      );
    }

    const user = await this.userService.findOne(id);

    if (!user || user.role !== 'admin') {
      throw new ForbiddenException('Forbidden: Admin access required.');
    }

    console.log(user, user.role);

    return this.orderModel.find().exec();
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel.findById(id);
    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const updatedOrder = await this.orderModel.findByIdAndUpdate(
      id,
      updateOrderDto,
      { new: true },
    );

    if (!updatedOrder) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    return updatedOrder;
  }

  async remove(id: string): Promise<Order> {
    const deletedOrder = await this.orderModel.findByIdAndDelete(id);

    if (!deletedOrder) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }

    return deletedOrder;
  }
}
