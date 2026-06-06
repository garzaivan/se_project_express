const clothingItem = require("../models/clothingItem");
const {
  validationError,
  documentNotFoundError,
  serverError,
  forbiddenError,
} = require("../utils/errors");

const getItems = (req, res) =>
  clothingItem
    .find({})
    .then((items) => res.status(200).send(items))
    .catch(() => {
      res
        .status(serverError)
        .send({ message: "An error has occurred on the server." });
    });

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  if (!name || !weather || !imageUrl || !owner) {
    return res
      .status(validationError)
      .send({ message: "All fields are required." });
  }

  return clothingItem
    .create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(validationError).send({
          message:
            "Invalid data: please provide a valid 'name' (min length 2 max length 30) and a valid 'image' URL.",
        });
      }
      if (err.name === "CastError") {
        return res.status(validationError).send({
          message: "Invalid owner ID format. Please provide a valid user ID.",
        });
      }
      return res
        .status(serverError)
        .send({ message: "An error has occurred on the server." });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  return clothingItem
    .findById(itemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== userId) {
        return res.status(forbiddenError).send({
          message: "You are not allowed to delete this item",
        });
      }

      return clothingItem
        .findByIdAndDelete(itemId)
        .then((deletedItem) => res.status(200).send(deletedItem));
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(documentNotFoundError)
          .send({ message: "Item not found with the provided ID." });
      }

      if (err.name === "CastError") {
        return res.status(validationError).send({
          message: "Invalid item ID format. Please provide a valid item ID.",
        });
      }

      return res
        .status(serverError)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports = { getItems, createItem, deleteItem };
