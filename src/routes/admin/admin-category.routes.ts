import { Router } from 'express';
import { createCategoryService } from '../../services/category.service';

const router = Router();

router.post('/createCategory', async (req, res) => {
    const categoryService = await createCategoryService();
    const { name, slug } = req.body;
    const category = await categoryService.createCategory({ name, slug });
    res.json(category);
});

router.get('/getCategoryById', async (req, res) => {
    const categoryService = await createCategoryService();
    const category = await categoryService.getCategoryById(parseInt(req.query.id as string));
    res.json(category);
});

router.put('/updateCategory', async (req, res) => {
    const categoryService = await createCategoryService();
    const { id, name, slug } = req.body;
    const category = await categoryService.updateCategory({ id: parseInt(id), name, slug });
    res.json(category);
});

router.delete('/deleteCategory', async (req, res) => {
    const categoryService = await createCategoryService();
    const { id } = req.body;
    await categoryService.deleteCategory(parseInt(id));
    res.sendStatus(204);
});

router.get('/listCategories', async (req, res) => {
    const categoryService = await createCategoryService();
    const { page = 1, limit = 10, name } = req.query;
    const { categories, total } = await categoryService.listCategories({
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        filter: { name: name as string }
    });
    res.json({ categories, total });
});

export default router;