import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Category } from "./entities/Category";
import { Customer } from "./entities/Customer";
import { Product } from "./entities/Product";
import { Cart, CartItem } from "./entities/Cart";
import { Payment } from "./entities/Payment";
import { Order } from "./entities/Order";
import { OrderItem } from "./entities/OrderItem";

let dataSource: DataSource;

export async function createDatabaseConnection() {
  if (!dataSource) {
    dataSource = new DataSource({
      type: "sqlite",
      database: ":memory:",
      entities: [User, Customer, Product, Cart, CartItem, Category, OrderItem, Order, Payment],
      synchronize: true, 
    });

    await dataSource.initialize();
  }

  return {
    customerRepository: dataSource.getRepository(Customer),
    userRepository: dataSource.getRepository(User),
    productRepository: dataSource.getRepository(Product),
    categoryRepository: dataSource.getRepository(Category),
    orderRepository: dataSource.getRepository(Order),
    orderItemRepository: dataSource.getRepository(OrderItem),
    cartRepository: dataSource.getRepository(Cart),
    cartItemRepository: dataSource.getRepository(CartItem),
    paymentRepository: dataSource.getRepository(Payment),
  };
}
