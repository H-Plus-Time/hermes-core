const express = require('express')
const cors = require('cors')
const app = express()
var bodyParser = require('body-parser')
const base64Image = require('node-base64-image');
app.use(cors())
app.use(bodyParser.json())

let datastore = require('nedb-promise');


let notesStore = datastore({ filename: './notes.db', autoload: true });

app.post('/api/save-note', function (req, res, next) {
  if(Object.keys(req.body).indexOf('frame') == -1) {
    // empty request, abort
    res.json({msg: 'please provide a frame'});
    return;
  }
  let title = req.body.title;
  let frame = req.body.frame;
  let base64 = new Buffer(frame.split(",")[1], 'base64');
  let hash = 'const';
  let timestamp = req.body.timestamp;
  let filename = `notes/${title}-${hash}-${timestamp}`;
  base64Image.decode(base64, {filename: filename}, (resp) => {
    console.log(resp);
  });
  notesStore.insert([{
    path: filename+'.jpg',
    title: title,
    timestamp: timestamp
  }]).then(resp => {
    console.log("Successfully added to notes db")
    res.json('success')
  })
})

app.listen(8080, function () {
  console.log('CORS-enabled web server listening on port 8080')
})