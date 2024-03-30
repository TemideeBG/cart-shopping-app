import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, BaseEntity, OneToOne, AfterLoad } from "typeorm"
import { UserEntity } from "./user.entity";
import { ProductInterface } from "../interfaces/product.interface";
import { CartEntity } from "./cart.entity";

 @Entity({ name: "products" })
export class ProductEntity implements ProductInterface {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'varchar', length: 100, nullable: false, unique: true })
    name: string

    @Column({ type: 'integer', nullable: false })
    num_of_products_created: number

    @Column({ type: 'integer', default: 0, nullable: false })
    num_of_products_requested: number

    @Column({ type: 'integer', nullable: false })
    price: number

    @Column({ type: 'text', default: '₦' })
    currency: string;

    @Column({ type: 'text', nullable: false })
    amount: string;

    @Column({ type: 'text', nullable: false })
    description: string;

    @Column({ type: 'varchar', default: '/uploads/example.jpeg' })
    image: string;

    @Column({ type: 'varchar', length: 20, nullable: false, enum: ['office', 'kitchen', 'bedroom', 'living-room'] })
    category: string;

    @Column({ type: 'varchar', length: 20, nullable: false, enum: ['ikea', 'liddy', 'marcos'] })
    company: string;

    @Column({ type: 'text', nullable: true })
    design_period: string;

    @Column({ type: 'text', nullable: true })
    production_period: string;

    @Column({ type: 'text', nullable: true })
    country_of_manufacture: string;

    @Column({ type: 'text', nullable: true })
    style: string;

    @Column('simple-array', { default: ['#222'], nullable: false })
    colors: string[];

    @Column({ type: 'boolean', default: false })
    featured: boolean;

    @Column({ type: 'boolean', default: false })
    free_shipping: boolean;

    @Column({ type: 'varchar', nullable: false })
    inventory_number: string;

    @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
    average_rating: number;

    @Column({ type: 'int', default: 0 })
    num_of_reviews: number;

    @ManyToOne(() => UserEntity, user => user.products)
    user: UserEntity;

    @OneToMany(() => CartEntity, cart => cart.product)
    carts: CartEntity[];

    /*
    @AfterLoad()
    updateNumOfRequested(): void {
        this.num_of_products_requested = this.carts.reduce((total, cart) => total + cart.quantity, 0);
    }
*/

}
