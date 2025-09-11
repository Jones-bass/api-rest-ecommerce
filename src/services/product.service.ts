import { Like, Repository } from "typeorm";
import { Product } from "../entities/Product";
import { createDatabaseConnection } from "../database";

export class ProductService {
  constructor(private productRepository: Repository<Product>) {}

  async createProduct(
    name: string,
    slug: string,
    description: string,
    price: number
  ): Promise<Product> {
    const product = new Product();
    product.name = name;
    product.slug = slug;
    product.description = description;
    product.price = price;

    return await this.productRepository.save(product);
  }

  async getProductById(id: number): Promise<Product | null> {
    return await this.productRepository.findOne({ where: { id } });
  }

  async getProductBySlug(slug: string): Promise<Product | null> {
    return await this.productRepository.findOne({ where: { slug } });
  }

  async updateProduct(data: {
    id: number;
    name?: string;
    slug?: string;
    description?: string;
    price?: number;
  }): Promise<Product | null> {
    const { id, name, slug, description, price } = data;
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      return null;
    }

    if (name) product.name = name;
    if (slug) product.slug = slug;
    if (description) product.description = description;
    if (price) product.price = price;

    return await this.productRepository.save(product);
  }

  async deleteProduct(id: number): Promise<void> {
    await this.productRepository.delete({ id });
  }

  async listProducts(data: {
    page: number;
    limit: number;
    filter?: { name?: string };
  } = { page: 1, limit: 10 }): Promise<{ products: Product[]; total: number }> {
    const { page, limit, filter } = data;
    const where: any = {};
    if (filter?.name) {
      where.name = Like(`%${filter.name}%`);
    }

    const [products, total] = await this.productRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
    });

    return { products, total };
  }
}

export async function createProductService(): Promise<ProductService> {
  const { productRepository } = await createDatabaseConnection();
  return new ProductService(productRepository);
}
