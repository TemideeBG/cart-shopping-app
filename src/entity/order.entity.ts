// entity/order.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from "typeorm";
import { UserEntity } from "./user.entity";
import { SingleOrderItem } from "../interfaces/order_items.interface";

@Entity({ name: "orders" })
export class OrderEntity {
    @PrimaryGeneratedColumn()
    id: string;

    @Column({ type: 'decimal', nullable: false })
    tax: number;

    @Column({ type: 'decimal', nullable: false })
    shipping_fee: number;

    @Column({ type: 'decimal', nullable: false })
    sub_total: number;

    @Column({ type: 'decimal', nullable: false })
    total: number;

    @Column({ type: 'enum', enum: ['pending', 'failed', 'paid', 'delivered', 'cancelled'], default: 'pending' })
    order_status: string;

    @Column({ nullable: true })
    tracking_id: string;

    @Column({ nullable: true })
    client_secret: string;

    @Column({ nullable: true })
    payment_intent_id: string;

    @Column({ nullable: false, type: "simple-array" })
    orderItems: SingleOrderItem[];

    @ManyToOne(() => UserEntity, user => user.orders, { onDelete: 'CASCADE' })
    user: UserEntity;
};