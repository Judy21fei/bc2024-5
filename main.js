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

  app.get('/notes/:name', (req, res) => {
    const notePath = getNotePath(req.params.name);
    if (!fs.existsSync(notePath)) {
      return res.status(404).send('Note not found');
    }
    res.send(fs.readFileSync(notePath, 'utf8'));
  });
  
  app.put('/notes/:name', (req, res) => {
    const notePath = getNotePath(req.params.name);
    if (!fs.existsSync(notePath)) {
      return res.status(404).send('Note not found');
    }
    fs.writeFileSync(notePath, req.body.text);
    res.send('Note updated');
  });
  
  app.delete('/notes/:name', (req, res) => {
    const notePath = getNotePath(req.params.name);
    if (!fs.existsSync(notePath)) {
      return res.status(404).send('Note not found');
    }
    fs.unlinkSync(notePath);
    res.send('Note deleted');
  });
  
  app.get('/notes', (req, res) => {
    res.json(listNotes());
  });
  
  app.post('/write', (req, res) => {
    const { note_name, note } = req.body;
    const notePath = getNotePath(note_name);
    if (fs.existsSync(notePath)) {
      return res.status(400).send('Note already exists');
    }
    fs.writeFileSync(notePath, note);
    res.status(201).send('Note created');
  });
  
  app.get('/UploadForm.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'UploadForm.html'));
  });

  const server = http.createServer(app);

server.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}/`);
});