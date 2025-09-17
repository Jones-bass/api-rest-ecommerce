import express from "express";
import session from "express-session";
import jwt from "jsonwebtoken";
import { createDatabaseConnection } from "./database";
import { createCustomerService } from "./services/customer.service";

import jwtAuthRoutes from "./routes/jwt-auth.routes";
import categoryRoutes from "./routes/category.routes";
import cartRoutes from "./routes/cart.routes";

import loginRoutes from "./routes/admin/admin-session-auth.routes";
import adminCustomerRoutes from "./routes/admin/admin-customer.routes";
import adminProductRoutes from "./routes/admin/admin-product.routes";
import adminCategoryRoutes from "./routes/admin/admin-category.routes";

import { authenticateJWT } from "./middleware/auth.middleware.ts";


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(
  session({
    secret: "123",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

app.use(async (req, res, next) => {
  const protectedRoutes = ["/admin", "/orders"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    req.url.startsWith(route)
  );

  if (isProtectedRoute) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(200).send({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(token, "123");
      //@ts-expect-error
      req.userId = decoded.sub;
    } catch (e) {
      return res.status(200).send({ message: "Unauthorized" });
    }
  }

  next();
});

app.use("/jwt", jwtAuthRoutes);
app.use("/categories", categoryRoutes);
app.use("/carts", cartRoutes);

app.use("/admin/session", authenticateJWT, loginRoutes);
app.use("/admin/products", authenticateJWT, adminProductRoutes);
app.use("/admin/customers", authenticateJWT, adminCustomerRoutes);
app.use("/admin/categories", authenticateJWT, adminCategoryRoutes);

app.get("/", async (req, res) => {
  await createDatabaseConnection();
  res.send("Hello World!");
});


app.listen(PORT, async () => {
  const customerService = await createCustomerService();
  //create a admin user
  await customerService.registerCustomer({
    name: "admin",
    email: "jonesbass.tb@gmail.com",
    password: "123123",
    phone: "79999591921",
    address: "admin address",
  });
  console.log(`Server is running on http://localhost:${PORT}`);
});




