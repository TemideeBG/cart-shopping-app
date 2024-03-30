import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, AfterRemove, AfterInsert } from "typeorm"
import { UserEntity } from "./user.entity";
import { ProductInterface } from "../interfaces/product.interface";
import { CartInterface } from "../interfaces/cart.interface";
import { ProductEntity } from "./product.entity";
import { AppDataSource } from "../database/data-source";

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

/*
    @AfterInsert()
    async updateNumOfProductsRequested(): Promise<void> {
        await this.product.updateNumOfRequested();
    };

    @AfterRemove()
    async updateNumOfProductsRequestedAfterRemove(): Promise<void> {
        await this.product.updateNumOfRequested();
    };


    private async updateProductNumOfRequested(): Promise<void> {
        const productRepository = AppDataSource.getRepository(ProductEntity);
        const cartRepository = AppDataSource.getRepository(CartEntity);

        try {
            const cartItems = await cartRepository.find({ where: { product: this.product } });
            const totalQuantity = cartItems.reduce((acc, cart) => acc + (cart.quantity || 0), 0);

            if (this.product) {
                this.product.num_of_products_requested = totalQuantity;
                await productRepository.save(this.product);
            } else {
                throw new Error('Product is undefined');
            }
        } catch (error) {
            console.error('Error updating product num_of_products_requested:', error);
        }
    }
    */

}

