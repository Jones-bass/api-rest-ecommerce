import express from "express";
import { createDatabaseConnection } from "./database";
import jwtAuthRoutes from "./routes/jwt-auth.routes";
import session from "express-session";
import jwt from "jsonwebtoken";
import { createCustomerService } from "./services/customer.service";
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

app.get("/", async (req, res) => {
  await createDatabaseConnection();
  res.send("Hello World!");
});


app.listen(PORT, async () => {
  const customerService = await createCustomerService();

  // Verifica se já existe um admin com esse email
  const existingUser = await (await createDatabaseConnection()).userRepository.findOneBy({
    email: "jonesbass.tb@gmail.com",
  });

  if (!existingUser) {
    const newUser = await customerService.registerCustomer({
      name: "Jones",
      email: "jonesbass.tb@gmail.com",
      password: "123123",
    });
    console.log("Admin criado:", newUser);
  } else {
    console.log("Admin já existe:", existingUser.email);
  }

  console.log(`Server is running on http://localhost:${PORT}`);
});

