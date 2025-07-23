declare class ShippingAddressDto {
    country: string;
    city: string;
    street: string;
    building: string;
}
declare class PaymentDetailsDto {
    cardNumber: string;
    expiry: string;
    cvv: string;
}
declare class OrderItemDto {
    productId: string;
    quantity: number;
    price: number;
}
export declare class CreateOrderDto {
    shippingAddress: ShippingAddressDto;
    paymentDetails: PaymentDetailsDto;
    items: OrderItemDto[];
    total: number;
    userId: string;
    userEmail: string;
}
export {};
