// server.js — entry point only

import dotenv from "dotenv";
dotenv.config({ path: ".env" });
// const http = require("http");
import http from "http";
import app from "./src/app.js";
// const app = require("./src/app.js");

const PORT = process.env.PORT || 5000;

// Create server
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
