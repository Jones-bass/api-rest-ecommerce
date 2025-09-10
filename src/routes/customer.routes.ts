import { Router } from "express";
import { createCustomerService } from "../services/customer.service";
import { validateSync } from "class-validator";
import validator from "validator";

const router = Router();

router.post("/createCustomer", async (req, res) => {
  const customerService = await createCustomerService();
  const errors = validateSync(validator);

  if (errors.length > 0) {
    return res.status(400).send(errors);
  }

  const { name, email, password, phone, address } = req.body;
  try {
    const customer = await customerService.registerCustomer({
      name,
      email,
      password,
      phone,
      address,
    });
    res.json(customer);
  } catch (e) {
    return res.status(400).send((e as any).message);
  }
});

router.get("/listCustomers", async (req, res) => {
  const customerService = await createCustomerService();

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  try {
    const result = await customerService.listCustomers({ page, limit });
    res.json(result);
  } catch (e) {
    return res.status(500).send((e as any).message);
  }
});

router.get("/getCustomer/:id", async (req, res) => {
  const customerService = await createCustomerService();
  const id = parseInt(req.params.id);

  try {
    const customer = await customerService.getCustomer(id);
    if (!customer) {
      return res.status(404).send("Customer not found");
    }
    res.json(customer);
  } catch (e) {
    res.status(500).send((e as any).message);
  }
});

router.put("/updateCustomer/:id", async (req, res) => {
  const customerService = await createCustomerService();
  const id = parseInt(req.params.id);
  const { phone, address, password } = req.body;

  try {
    const updated = await customerService.updateCustomer({
      id,
      phone,
      address,
      password,
    });

    if (!updated) {
      return res.status(404).send("Customer not found");
    }

    res.json(updated);
  } catch (e) {
    res.status(500).send((e as any).message);
  }
});


router.delete("/deleteCustomer/:id", async (req, res) => {
  const customerService = await createCustomerService();
  const id = parseInt(req.params.id);

  try {
    await customerService.deleteCustomer(id);
    res.json({ message: "Customer deleted successfully" });
  } catch (e) {
    res.status(500).send((e as any).message);
  }
});


export default router;
