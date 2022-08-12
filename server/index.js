const express = require("express");
const { errorHandler, notFound } = require("./handlers");

const app = express();
const port = 4000;

app.get("/", (req, res) => res.json({ helo: "hello world" }));

app.use(notFound);
app.use(errorHandler);

app.listen(port, console.log("Server starter on port " + port));
