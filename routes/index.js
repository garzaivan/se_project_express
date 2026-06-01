const router = require("express").Router();
const usersRouter = require("./users");
const itemsRouter = require("./clothingItems");
const { login, createUser } = require("../controllers/users");

router.use("/users", usersRouter);
router.use("/items", itemsRouter);
router.post("/signin", login);
router.post("/signup", createUser);

module.exports = router;
