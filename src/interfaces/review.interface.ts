import { ProductEntity } from "../entity/product.entity";
import { UserEntity } from "../entity/user.entity";

export interface ReviewInterface {
    id: number;
    rating: number;
    title: string;
    comment: string;
    user: UserEntity;
    product: ProductEntity;
  };