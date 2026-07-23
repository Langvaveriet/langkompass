/* eslint-disable @typescript-eslint/no-require-imports */
const { createServer } = require("http");
const next = require("next");

const hostname = process.env.HOSTNAME || "0.0.0.0";
const port = Number.parseInt(process.env.PORT || "3000", 10);
const app = next({ dev: false, hostname, port });
const handle = app.getRequestHandler();

app
  .prepare()
  .then(() => {
    createServer((request, response) => handle(request, response)).listen(
      port,
      hostname,
      () => {
        console.log(`LångKompass läuft auf http://${hostname}:${port}`);
      },
    );
  })
  .catch((error) => {
    console.error("LångKompass konnte nicht gestartet werden:", error);
    process.exit(1);
  });
