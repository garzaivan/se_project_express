const Item = require("../models/clothingItem");
const {
  validationError,
  documentNotFoundError,
  serverError,
} = require("../utils/errors");

module.exports.likeItem = (req, res) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err);

      if (err.name === "DocumentNotFoundError") {
        return res
          .status(documentNotFoundError)
          .send({ message: "Item not found" });
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

module.exports.dislikeItem = (req, res) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      console.error(err);

      if (err.name === "DocumentNotFoundError") {
        return res
          .status(documentNotFoundError)
          .send({ message: "Item not found" });
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
