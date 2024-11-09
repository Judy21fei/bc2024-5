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

const notes = {};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/notes/:name', (req, res) => {
  const { name } = req.params;
  if (notes[name]) {
    res.send(notes[name]);
  } else {
    res.status(404).send('Note not found');
  }
});

app.put('/notes/:name', (req, res) => {
  const { name } = req.params;
  const { text } = req.body;
  if (notes[name]) {
    notes[name] = text;
    res.send('Note updated');
  } else {
    res.status(404).send('Note not found');
  }
});

app.delete('/notes/:name', (req, res) => {
  const { name } = req.params;
  if (notes[name]) {
    delete notes[name];
    res.send('Note deleted');
  } else {
    res.status(404).send('Note not found');
  }
});

app.get('/notes', (req, res) => {
  const noteList = Object.keys(notes).map(name => ({ name, text: notes[name] }));
  res.json(noteList);
});

app.post('/write', (req, res) => {
  const { note_name, note } = req.body;
  if (notes[note_name]) {
    res.status(400).send('Note already exists');
  } else {
    notes[note_name] = note;
    res.status(201).send('Note created');
  }
});

app.get('/UploadForm.html', (req, res) => {
  res.sendFile(__dirname + '/UploadForm.html');
});
