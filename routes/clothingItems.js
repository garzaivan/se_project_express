const router = require("express").Router();
const {
  getItems,
  createItem,
  deleteItem,
} = require("../controllers/clothingItems");
const { likeItem, dislikeItem } = require("../controllers/likeItem");

router.get("/", getItems);
router.post("/", createItem);
router.delete("/:itemId", deleteItem);

router.put("/:itemId/likes", likeItem);
router.delete("/:itemId/likes", dislikeItem);

module.exports = router;
