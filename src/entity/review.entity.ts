import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, AfterInsert, AfterRemove, Index } from "typeorm";
import { ProductEntity } from "./product.entity";
import { UserEntity } from "./user.entity";

@Index(["user", "product"], { unique: true })
@Entity({ name: "reviews" })
export class ReviewEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'decimal', nullable: false })
    rating: number;

    @Column({ type: 'varchar', length: 100, nullable: false })
    title: string;

    @Column({ type: 'text', nullable: false })
    comment: string;

    @ManyToOne(() => UserEntity, user => user.reviews, { onDelete: 'CASCADE' })
    user: UserEntity;

    @ManyToOne(() => ProductEntity, product => product.reviews, { onDelete: 'CASCADE' })
    product: ProductEntity;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
};