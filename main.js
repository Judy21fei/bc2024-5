const { program } = require('commander');
const express = require('express');
const app = express();

program
  .requiredOption('-h, --host <host>', 'server address')
  .requiredOption('-p, --port <port>', 'server port')
  .requiredOption('-c, --cache <cache>', 'cache directory');

program.parse(process.argv);

const { host, port, cache } = program.opts();

app.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`);
});
