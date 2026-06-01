const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const {
  validationError,
  documentNotFoundError,
  serverError,
} = require("../utils/errors");

const getUsers = (req, res) =>
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(() => {
      res
        .status(serverError)
        .send({ message: "An error has occurred on the server." });
    });

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!name || !avatar || !email || !password) {
    return res.status(validationError).send({
      message: "Fields 'name', 'avatar', 'email', and 'password' are required.",
    });
  }

  return bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        name,
        avatar,
        email,
        password: hash,
      })
    )
    .then((user) => {
      const userResponse = user.toObject();
      delete userResponse.password;

      res.status(201).send(userResponse);
    })
    .catch((err) => {
      if (err.code === 11000) {
        return res.status(409).send({
          message: "A user with this email already exists.",
        });
      }

      if (err.name === "ValidationError") {
        return res.status(validationError).send({
          message: Object.values(err.errors)
            .map((e) => e.message)
            .join(", "),
        });
      }

      return res
        .status(serverError)
        .send({ message: "An error has occurred on the server." });
    });
};

const getCurrentUser = (req, res) => {
  const userId = req.user._id;
  return User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(documentNotFoundError)
          .send({ message: "User not found." });
      }
      if (err.name === "ValidationError") {
        return res.status(validationError).send({
          message: "Invalid user ID format. Please provide a valid user ID.",
        });
      }
      if (err.name === "CastError") {
        return res.status(validationError).send({
          message: "Invalid user ID format. Please provide a valid user ID.",
        });
      }
      return res
        .status(serverError)
        .send({ message: "An error has occurred on the server." });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(validationError).send({
      message: "Email and password are required.",
    });
  }

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      res.status(200).send({ token });
    })
    .catch(() => {
      res.status(401).send({
        message: "Incorrect email or password",
      });
    });
};

const updateUser = (req, res) => {
  const userId = req.user._id;
  const { name, avatar } = req.body;

  return User.findByIdAndUpdate(
    userId,
    { name, avatar },
    {
      new: true,
      runValidators: true,
    }
  )
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(documentNotFoundError)
          .send({ message: "User not found." });
      }

      if (err.name === "ValidationError") {
        return res.status(validationError).send({
          message: "Invalid user data.",
        });
      }

      return res
        .status(serverError)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports = {
  getUsers,
  createUser,
  getCurrentUser,
  login,
  updateUser,
};
