import { NodeServer } from "./server";

async function entry() {
  const server = new NodeServer();
  await server.configure();
  server.listen();
}

entry().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
