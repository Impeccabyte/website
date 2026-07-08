/**
 * Production entry point for cPanel / CloudLinux (Phusion Passenger).
 *
 * The Node.js Selector runs this file as the "Application startup file".
 * Passenger provides the listening socket via PORT (a TCP port or a Unix
 * socket path), and patches http.Server#listen so the value we pass is used
 * transparently. Run `npm run build` before starting so `.next/` exists.
 */
const { createServer } = require("node:http");
const next = require("next");

// Passenger may hand us a numeric port or a Unix socket path — pass through as-is.
const port = process.env.PORT || 3000;
const numericPort = Number(port) || 3000;

const app = next({ dev: false, port: numericPort });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    createServer((req, res) => handle(req, res)).listen(port, () => {
      console.log(`> Impeccabyte is ready (listening on ${port})`);
    });
  })
  .catch((err) => {
    console.error("Failed to start the Next.js server:", err);
    process.exit(1);
  });
