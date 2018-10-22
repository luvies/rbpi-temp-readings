import { AppServer } from './app';

async function entry() {
  const server = new AppServer();
  await server.configure();
  server.listen();
}

entry().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
