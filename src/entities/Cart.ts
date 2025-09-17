import {
  Column,
  Entity,
  Generated,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Product } from "./Product";
import { Customer } from "./Customer";

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => CartItem, (cartItem) => cartItem.product)
  items: CartItem[];

  @ManyToOne(() => Customer)
  customer: Customer | null;

  @Column()
  createdAt: Date;
}

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @ManyToOne(() => Product)
  product: Product;

  @ManyToOne(() => Cart, (cart) => cart.items)
  cart: Cart;
}
