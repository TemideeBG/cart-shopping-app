import { CartEntity } from "../entity/cart.entity";

export interface SingleOrderItem {
    price: number;
    quantity: number;
    cartId: number;
  }