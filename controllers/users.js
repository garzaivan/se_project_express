const User = require("../models/user");
const {
  validationError,
  documentNotFoundError,
  serverError,
} = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      console.error(err);
      return res.status(serverError).send({ message: err.message });
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  if (!name || !avatar) {
    return res
      .status(validationError)
      .send({ message: "Both 'name' and 'avatar' fields are required." });
  }

  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(validationError).send({
          message:
            "Invalid data: please provide a valid 'name' (min length 2 max length 30) and a valid 'avatar' URL.",
        });
      }
      return res
        .status(serverError)
        .send({ message: "An error has occurred on the server." });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(documentNotFoundError)
          .send({ message: "User not found with the provided ID." });
      } else if (err.name === "ValidationError") {
        return res.status(validationError).send({
          message: "Invalid user ID format. Please provide a valid user ID.",
        });
      } else if (err.name === "CastError") {
        return res.status(validationError).send({
          message: "Invalid user ID format. Please provide a valid user ID.",
        });
      } else {
        return res
          .status(serverError)
          .send({ message: "An error has occurred on the server." });
      }
    });
};

module.exports = { getUsers, createUser, getUser };
