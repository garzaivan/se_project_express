const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mainRouter = require("./routes/index");
const { documentNotFoundError } = require("./utils/errors");

const app = express();
const { PORT = 3001 } = process.env;
app.use(cors());

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.use(express.json());

app.use("/", mainRouter);
app.use((req, res) => {
  res
    .status(documentNotFoundError)
    .send({ message: "Requested resource not found" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
