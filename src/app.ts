import express, { NextFunction, Request, Response } from "express";

import jwt from "jsonwebtoken";
import { createDatabaseConnection } from "./database";

import jwtAuthRoutes from "./routes/jwt-auth.routes";
import categoryRoutes from "./routes/category.routes";
import cartRoutes from "./routes/cart.routes";
import orderRoutes from "./routes/order.routes";

import loginRoutes from "./routes/admin/admin-session-auth.routes";
import adminCustomerRoutes from "./routes/admin/admin-customer.routes";
import adminProductRoutes from "./routes/admin/admin-product.routes";
import adminCategoryRoutes from "./routes/admin/admin-category.routes";

import { authenticateJWT } from "./middleware/auth.middleware.ts";
import { Resource } from "./resource.ts/resource";

import { ValidationError } from "./errors";

import {
  createCustomerService,
  UserAlreadyExistsError,
} from "./services/customer.service";

const app = express();
const PORT = process.env.PORT || 3000;
// comum API terem multiplas formas de auth
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(async (req, res, next) => {
  if (!req.headers["content-type"]) {
    return next();
  }

  const allowedContentTypes = [
    "application/json",
    "application/x-www-form-urlencoded",
  ];

  if (!allowedContentTypes.includes(req.headers["content-type"])) {
    return res.status(415).json({
      title: "Unsupported Media Type",
      status: 415,
      detail:
        "Unsupported Media Type. Please use application/json or application/x-www-form-urlencoded",
    });
  }

  next();
});


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

app.use(async (req, res, next) => {
  const routesAllowingAlternateAccept = [
    {
      url: "/admin/products",
      method: "GET",
      accept: "text/csv",
    },
  ];

  const acceptHeader = req.headers["accept"];
  if (!acceptHeader) {
    return next();
  }

  if (acceptHeader === "application/json") {
    return next();
  }

  const route = routesAllowingAlternateAccept.find((route) => {
    return req.url.startsWith(route.url) && req.method === route.method;
  });

  if (route && acceptHeader === route.accept) {
    return next();
  }

  return res
    .status(406)
    .send({
      title: "Not Acceptable",
      status: 406,
      detail: `Not Acceptable format requested: ${req.headers["accept"]}, only application/json and text/csv are supported`,
    });
});

app.use("/jwt", jwtAuthRoutes);
app.use("/categories", categoryRoutes);
app.use("/carts", cartRoutes);
app.use("/orders", orderRoutes);

app.use("/admin/session", authenticateJWT, loginRoutes);
app.use("/admin/products", authenticateJWT, adminProductRoutes);
app.use("/admin/customers", authenticateJWT, adminCustomerRoutes);
app.use("/admin/categories", authenticateJWT, adminCategoryRoutes);

app.get("/", async (req, res) => {
  await createDatabaseConnection();
  res.send("Hello World!");
});

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  if (!(error instanceof Error)) {
    return next(error);
  }

  console.error(error);

  if (error instanceof SyntaxError) {
    return res.status(400).send({
      title: "Bad Request",
      status: 400,
      detail: error.message,
    });
  }

  if (error instanceof UserAlreadyExistsError) {
    return res.status(409).send({
      title: "Conflict",
      status: 409,
      detail: error.message,
    });
  }

  if (error instanceof ValidationError) {
    return res.status(422).send({
      title: "Unprocessable Entity",
      status: 422,
      detail: {
        errors: error.error.map((e) => ({
          field: e.property,
          constraints: e.constraints,
        })),
      },
    });
  }

  res.status(500).send({
    title: "Internal Server Error",
    status: 500,
    detail: "An unexpected error occurred",
  });
});

app.use((result: Resource, req: Request, res: Response, next: NextFunction) => {
  if (result instanceof Resource) {
    return res.json(result.toJson());
  }
  next(result);
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
