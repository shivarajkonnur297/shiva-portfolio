const express = require("express");
const app = express();
const http = require("http");
const https = require("https");
const path = require("path");
var formidable = require("formidable");
exports.dotenv = require("dotenv").config();
exports.applicationkey = process.env.APPLICATION_KEY;

const cors = require("cors");
const bodyParser = require("body-parser");

const logger = require("./utilities/logger");
const globalRoute = require("./routes/global");

const port = process.env.PORT;
const hostname = process.env.HOST;

const _dirname = path.dirname(__filename);
const buildpath = path.join(_dirname, "../my-portfolio/build");

app.use(express.static(buildpath)); // Serve static React.js files first
app.use(cors()); // Enable CORS
app.use("/static", express.static("./uploads/")); // Serve uploaded files
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json({ limit: "50mb", extended: true }));

// ... (your routes, e.g., globalRoute)
app.use("/", globalRoute);

const server = http.createServer(app);

server.listen(port, hostname, () => {
  console.log("Portfolio listening on ", hostname, port, "!");
});
