import { Router } from 'express';
import { createCustomerService } from '../../services/customer.service';

const router = Router();

router.post('/createCustomer', async (req, res) => {
    const customerService = await createCustomerService();
    const { name, email, password, phone, address } = req.body;
    const customer = await customerService.registerCustomer({name, email, password, phone, address});
    res.json(customer);
});

router.get('/getCustomerById', async (req, res) => {
    const customerService = await createCustomerService();
    const customer = await customerService.getCustomer(parseInt(req.query.id as string));
    res.send(customer ? customer : {message: 'Customer not found'});
    //res.json(customer);
});

router.post('/updateCustomer', async (req, res) => {
    const customerService = await createCustomerService();
    const { phone, address, email, password } = req.body;
    const customer = await customerService.updateCustomer({phone, address, email, password});
    res.json(customer);
});

router.post('/deleteCustomer', async (req, res) => {
    const customerService = await createCustomerService();
    const { id } = req.body;
    await customerService.deleteCustomer(parseInt(id));
    res.send({message: 'Customer deleted successfully'});
});

router.get('/listCustomers', async (req, res) => {
    const customerService = await createCustomerService();
    const { page = 1, limit = 10 } = req.query;
    const { customers, total } = await customerService.listCustomers({
        page: parseInt(page as string),
        limit: parseInt(limit as string)
    });
    res.json({ customers, total });
});

export default router;