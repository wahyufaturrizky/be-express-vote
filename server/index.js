require("dotenv").config();

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { errorHandler, notFound } = require("./handlers");

const db = require("./models");
const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => res.json({ helo: "hello world" }));

app.use(notFound);
app.use(errorHandler);

app.listen(port, console.log("Server starter on port " + port));
