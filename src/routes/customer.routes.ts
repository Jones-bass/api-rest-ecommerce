import { Router } from "express";
import { createCustomerService } from "../services/customer.service";
import { validateSync } from "class-validator";
import validator from "validator";

const router = Router();

router.post("/createCustomer", async (req, res) => {
  const customerService = await createCustomerService();
  const errors = validateSync(validator);

  if (errors.length > 0) {
    return res.send(errors);
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
    return res.send((e as any).message);
  }
});

export default router;
