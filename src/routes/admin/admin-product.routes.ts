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

export default router;
