import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Category } from "./entities/Category";
import { Customer } from "./entities/Customer";
import { Product } from "./entities/Product";

let dataSource: DataSource;

export async function createDatabaseConnection() {
  if (!dataSource) {
    dataSource = new DataSource({
      type: "sqlite",
      database: ":memory:",
      entities: [User, Customer, Product, Category],
      synchronize: true, 
    });

    await dataSource.initialize();
  }

  return {
    userRepository: dataSource.getRepository(User),
    customerRepository: dataSource.getRepository(Customer),
    categoryRepository: dataSource.getRepository(Category),
    productRepository: dataSource.getRepository(Product),
  };
}
