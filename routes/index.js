const router = require("express").Router();
const usersRouter = require("./users");
const itemsRouter = require("./clothingItems");

router.use("/users", usersRouter);
router.use("/items", itemsRouter);

module.exports = router;
