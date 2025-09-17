import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Category } from "./entities/Category";
import { Customer } from "./entities/Customer";
import { Product } from "./entities/Product";
import { Cart, CartItem } from "./entities/Cart";

let dataSource: DataSource;

export async function createDatabaseConnection() {
  if (!dataSource) {
    dataSource = new DataSource({
      type: "sqlite",
      database: ":memory:",
      entities: [User, Customer, Product, Category, Cart, CartItem],
      synchronize: true, 
    });

    await dataSource.initialize();
  }

  return {
    userRepository: dataSource.getRepository(User),
    customerRepository: dataSource.getRepository(Customer),
    categoryRepository: dataSource.getRepository(Category),
    productRepository: dataSource.getRepository(Product),
    cartRepository: dataSource.getRepository(Cart),
    cartItemRepository: dataSource.getRepository(CartItem),
  };
}
