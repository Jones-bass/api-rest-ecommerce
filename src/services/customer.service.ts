import { Repository } from "typeorm";
import { User } from "../entities/User";
import { createDatabaseConnection } from "../database"; 

export class CustomerService {
  constructor(private userRepository: Repository<User>) {}

  async registerCustomer(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<User> {
    const { name, email, password } = data;

    const user = new User();
    user.name = name;
    user.email = email;
    user.password = password;

    return await this.userRepository.save(user);
  }
}

export async function createCustomerService(): Promise<CustomerService> {
  const { userRepository } = await createDatabaseConnection();
  return new CustomerService(userRepository);
}
