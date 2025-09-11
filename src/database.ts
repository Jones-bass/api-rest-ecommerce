import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Customer } from "./entities/Customer";
import { Product } from "./entities/Product";

let dataSource: DataSource;

export async function createDatabaseConnection() {
  if (!dataSource) {
    dataSource = new DataSource({
      type: "sqlite",
      database: ":memory:",
      entities: [User, Customer, Product],
      synchronize: true, 
    });

    await dataSource.initialize();
  }

  return {
    userRepository: dataSource.getRepository(User),
    customerRepository: dataSource.getRepository(Customer),
    productRepository: dataSource.getRepository(Product),
  };
}
