import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, BaseEntity, OneToOne } from "typeorm"
import { ProductEntity } from "./product.entity";
import { User } from "../interfaces/user.interface";
import { CartEntity } from "./cart.entity";

@Entity({ name: "users" })
export class UserEntity implements User {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column({ nullable: true })
    full_name: string;

    @Column({
        unique: true,
      })
    email: string;
  
    @Column()
    password: string;

    @Column({ default: "user", enum: ['user', 'admin', 'super-admin'] })
    role: string;
  
    @Column({
        default: "nigerian"
      })
    nationality: string;

    @Column({ nullable: true })
    home_address: string;

    @Column({ nullable: true })
    city: string;
  
    @Column({
      type: 'enum',
      enum: ['male', 'female']
      })
    gender: string;
  
    @Column({ 
          type: 'date',
       })
    date_of_birth: Date;

    @Column({ nullable: true })
    age: number;

    @Column({
        default: ""
    })
    phone_number: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => ProductEntity, product => product.user)
    products: ProductEntity[];

    @OneToMany(() => CartEntity, cart => cart.user)
    carts: CartEntity[];

}

/*

*/
