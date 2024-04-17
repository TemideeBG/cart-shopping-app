import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, AfterRemove, AfterInsert, OneToMany } from "typeorm"
import { UserEntity } from "./user.entity";
import { ProductInterface } from "../interfaces/product.interface";
import { CartInterface } from "../interfaces/cart.interface";
import { ProductEntity } from "./product.entity";
import { AppDataSource } from "../database/data-source";
//import { OrderItemEntity } from "./order_items.entity";

 @Entity({ name: "carts" })
export class CartEntity implements CartInterface {

    @PrimaryGeneratedColumn()
    id: string

    @Column({ type: 'decimal', nullable: false })
    price: number

    @Column({ type: 'decimal', default: 0 })
    discount: number;

    @Column({ type: 'text', default: '₦', nullable: true })
    currency: string;

    @Column({ type: 'text', nullable: true })
    amount: string;

    @Column({ type: 'integer', nullable: true })
    quantity: number;

    @ManyToOne(() => UserEntity, user => user.carts, { onDelete: 'CASCADE' })
    user: UserEntity;

    @ManyToOne(() => ProductEntity, product => product.carts, { onDelete: 'CASCADE' })
    product: ProductEntity;
};




