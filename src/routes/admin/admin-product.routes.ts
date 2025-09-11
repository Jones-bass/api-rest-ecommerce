import { Router } from "express";
import { createProductService } from "../../services/product.service";

const router = Router();

router.post("/createProduct", async (req, res) => {
  const productService = await createProductService();
  const { name, slug, description, price, categoryIds } = req.body;
  const product = await productService.createProduct(
    name,
    slug,
    description,
    price,
    categoryIds
  );
  res.json(product);
});

router.get("/getProductById", async (req, res) => {
  const productService = await createProductService();
  const product = await productService.getProductById(
    parseInt(req.query.id as string)
  );
  res.json(product);
});

router.post("/updateProduct", async (req, res) => {
  const productService = await createProductService();
  const { id, name, slug, description, price, categoryIds } = req.body;
  const product = await productService.updateProduct({
    id: parseInt(id),
    name,
    slug,
    description,
    price,
    categoryIds,
  });
  res.json(product);
});

router.post("/deleteProduct", async (req, res) => {
  const productService = await createProductService();
  const { id } = req.body;
  await productService.deleteProduct(parseInt(id));
  res.send({ message: "Product deleted successfully" });
});

router.get("/listProducts", async (req, res) => {
  const productService = await createProductService();
  const {
    page = 1,
    limit = 10,
    name,
    categories_slug: categoriesSlugStr,
  } = req.query;
  const categories_slug = categoriesSlugStr
    ? categoriesSlugStr.toString().split(",")
    : [];
  const { products, total } = await productService.listProducts({
    page: parseInt(page as string),
    limit: parseInt(limit as string),
    filter: {
      name: name as string,
      categories_slug,
    },
  });
  res.json({ products, total });
});

router.get("/listProducts.csv", async (req, res) => {
  const productService = await createProductService();
  const {
    page = 1,
    limit = 10,
    name,
    categories_slug: categoriesSlugStr,
  } = req.query;
  const categories_slug = categoriesSlugStr
    ? categoriesSlugStr.toString().split(",")
    : [];
  const { products } = await productService.listProducts({
    page: parseInt(page as string),
    limit: parseInt(limit as string),
    filter: {
      name: name as string,
      categories_slug,
    },
  });
  const csv = products
    .map((product) => {
      return `${product.name},${product.slug},${product.description},${product.price}`;
    })
    .join("\n");
  res.send(csv);
});

export default router;
