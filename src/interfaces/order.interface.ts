import { ProductEntity } from "../entity/product.entity";
import { UserEntity } from "../entity/user.entity";
import { CartEntity } from "../entity/cart.entity";
//import { OrderItemEntity } from "../entity/order_items.entity";
import { SingleOrderItem } from "./order_items.interface";

export interface OrderInterface {
    id: string;
    tax: number;
    shipping_fee: number;
    sub_total: number;
    total: number;
    order_status: string;
    tracking_id: string;
    client_secret: string;
    payment_intent_id: string;
    orderItems: SingleOrderItem[];
    user: UserEntity;
  }