import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";
import { Order } from "./Order";


@Entity()
export class Customer{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    phone: string;

    @Column()
    address: string;

    @ManyToOne(() => User)
    user: User;

    @OneToMany(() => Order, order => order.customer)
    orders: Order[];
}