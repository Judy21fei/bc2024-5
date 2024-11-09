const express = require('express');
const http = require('http');
const commander = require('commander');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


commander
  .requiredOption('-h, --host <host>', 'Server host')
  .requiredOption('-p, --port <port>', 'Server port')
  .requiredOption('-c, --cache <cacheDir>', 'Cache directory path')
  .parse(process.argv);

const { host, port, cache } = commander.opts();


if (!fs.existsSync(cache)) {
  fs.mkdirSync(cache);
}

const getNotePath = (noteName) => path.join(cache, `${noteName}.txt`);

const listNotes = () => {
    const files = fs.readdirSync(cache);
    const notes = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const note = {
        name: path.basename(file, '.txt'),
        text: fs.readFileSync(path.join(cache, file), 'utf8'),
      };
      notes.push(note);
    }
    
    return notes;
  };