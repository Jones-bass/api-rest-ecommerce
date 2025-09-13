import { Router } from "express";
import { createProductService } from "../../services/product.service";

const router = Router();

router.post("/createProduct", async (req, res) => {
  const productService = await createProductService();
  const { name, slug, description, price } = req.body;
  const product = await productService.createProduct(
    name,
    slug,
    description,
    price,
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

router.put("/updateProduct", async (req, res) => {
  const productService = await createProductService();
  const { id, name, slug, description, price } = req.body;
  const product = await productService.updateProduct({
    id: parseInt(id),
    name,
    slug,
    description,
    price,
  });
  res.json(product);
});

router.delete("/deleteProduct", async (req, res) => {
  const productService = await createProductService();
  const { id } = req.body;
  await productService.deleteProduct(parseInt(id));
  res.send({ message: "Product deleted successfully" });
});

router.get("/listProducts", async (req, res) => {
  const productService = await createProductService();
  const { page = 1, limit = 10, name } = req.query;
  
  const { products, total } = await productService.listProducts({
    page: parseInt(page as string),
    limit: parseInt(limit as string),
    filter: {
      name: name as string,
    },
  });
  res.json({ products, total });
});

export default router;
