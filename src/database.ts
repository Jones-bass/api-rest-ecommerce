import { DataSource } from "typeorm";
import { User } from "./entities/User";

let dataSource: DataSource;

export async function createDatabaseConnection() {
  if (!dataSource) {
    dataSource = new DataSource({
      type: "sqlite",
      database: "database.sqlite", 
      entities: [User],
      synchronize: true, 
    });

    await dataSource.initialize();
  }

  return {
    userRepository: dataSource.getRepository(User),
  };
}
