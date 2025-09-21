import { Router } from "express";
import { createDatabaseConnection } from "../database";

const router = Router();

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const { userRepository } = await createDatabaseConnection();

  const user = await userRepository.findOne({
    where: { email, password },
  });

  if (user) {
    req.session.userId = user.id;
    req.session.save(() => {
      res.send("Logged in successfully");
    });
  } else {
    res.status(401).send("Invalid email or password");
  }
});


router.post("/logout", async (req, res) => {
  req.session.destroy(() => {
    res.send("Logged out successfully");
  });
});

export default router;