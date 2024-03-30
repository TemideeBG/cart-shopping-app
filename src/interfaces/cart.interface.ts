import { ProductEntity } from "../entity/product.entity";
import { UserEntity } from "../entity/user.entity";

export interface CartInterface {
    id: string;
    price: number;
    discount: number;
    currency: string;
    amount: string;
    quantity: number;
    user: UserEntity;
    product: ProductEntity;
  }