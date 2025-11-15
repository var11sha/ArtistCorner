// server.js — entry point only

require("dotenv").config({ path: "../.env" });
const http = require("http");
const app = require("../src/app.js");
import eventRoutes from "./routes/eventRoutes.js";

const PORT = process.env.PORT || 5000;

// Create server
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
