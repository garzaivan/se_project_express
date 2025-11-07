const Item = require("../models/clothingItem");
const {
  validationError,
  documentNotFoundError,
  serverError,
} = require("../utils/errors");

const getItems = (req, res) => {
  Item.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      console.error(err);
      return res
        .status(serverError)
        .send({ message: "An error has occurred on the server." });
    });
};

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user ? req.user._id : req.body.owner;

  if (!name || !weather || !imageUrl || !owner) {
    return res
      .status(validationError)
      .send({ message: "All fields are required." });
  }

  Item.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(validationError).send({
          message:
            "Invalid data: please provide a valid 'name' (min length 2 max length 30) and a valid 'image' URL.",
        });
      } else if (err.name === "CastError") {
        return res.status(validationError).send({
          message: "Invalid owner ID format. Please provide a valid user ID.",
        });
      } else {
        return res
          .status(serverError)
          .send({ message: "An error has occurred on the server." });
      }
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  Item.findByIdAndDelete(itemId)
    .orFail()
    .then((deletedItem) => res.status(200).send(deletedItem))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(documentNotFoundError)
          .send({ message: "Item not found with the provided ID." });
      } else if (err.name === "CastError") {
        return res.status(validationError).send({
          message: "Invalid item ID format. Please provide a valid item ID.",
        });
      } else {
        return res
          .status(serverError)
          .send({ message: "An error has occurred on the server." });
      }
    });
};

module.exports = { getItems, createItem, deleteItem };
