import { Router } from "express";
import { createDatabaseConnection } from "../database";

const router = Router();

router.get("/login", async (req, res) => {
  // @ts-expect-error
  if (!req.session.userId) {
    return res.status(401).send({ message: "Unauthorized" });
  }

  const { userRepository } = await createDatabaseConnection();
  // @ts-expect-error
  const user = await userRepository.findOneBy({ id: req.session.userId });

  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }

  res.send(user);
});

export default router;
